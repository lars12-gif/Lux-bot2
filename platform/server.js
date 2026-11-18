import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_ROOT = path.resolve(process.env.LUX_PLATFORM_DATA || path.join(ROOT, "platform-data"));
const USERS_ROOT = path.join(DATA_ROOT, "users");
const DB_FILE = path.join(DATA_ROOT, "platform.sqlite");
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = Number(process.env.PORT || 8080);
const MAX_ACTIVE_BOTS = Number(process.env.MAX_ACTIVE_BOTS || 10);

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("يرجى ضبط JWT_SECRET في ملف البيئة بطول 32 حرفاً على الأقل.");
}
fs.mkdirSync(USERS_ROOT, { recursive: true });

const db = new Database(DB_FILE);
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS bot_accounts (
  user_id TEXT PRIMARY KEY,
  phone TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`);

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.WEBSITE_ORIGIN || false }));
app.use(express.json({ limit: "32kb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));

const workers = new Map();
const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, "commands-catalog.json"), "utf8"));
const safeEqual = (a, b) => {
  const aa = Buffer.from(String(a || ""));
  const bb = Buffer.from(String(b || ""));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
};

function issueToken(user) {
  return jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });
}
function auth(req, res, next) {
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "انتهت الجلسة أو أن تسجيل الدخول غير صالح." });
  }
}
function userDir(userId) {
  const dir = path.join(USERS_ROOT, userId);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
function readState(userId) {
  try {
    return JSON.parse(fs.readFileSync(path.join(userDir(userId), "commands.json"), "utf8"));
  } catch {
    return { disabledPlugins: [] };
  }
}
function writeState(userId, state) {
  const file = path.join(userDir(userId), "commands.json");
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2), { mode: 0o600 });
  fs.renameSync(tmp, file);
}
function makePairCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(8);
  const raw = [...bytes].map(b => alphabet[b % alphabet.length]).join("");
  return raw;
}
function stopWorker(userId) {
  const item = workers.get(userId);
  if (!item) return false;
  item.child.kill("SIGTERM");
  workers.delete(userId);
  return true;
}
function startWorker(userId, phone, pairCode = "") {
  stopWorker(userId);
  const dir = userDir(userId);
  const sessionDir = path.join(dir, "session");
  const statusFile = path.join(dir, "status.json");
  const logFile = path.join(dir, "worker.log");
  fs.mkdirSync(sessionDir, { recursive: true });
  const log = fs.createWriteStream(logFile, { flags: "a", mode: 0o600 });
  const child = spawn(process.execPath, [path.join(ROOT, "index.js")], {
    cwd: ROOT,
    env: {
      ...process.env,
      LUX_TENANT_ID: userId,
      LUX_PHONE: phone,
      LUX_PAIR_CODE: pairCode,
      LUX_DATA_DIR: dir,
      LUX_SESSION_DIR: sessionDir,
      LUX_SUB_DIR: path.join(dir, "sub"),
      LUX_SUB_CODE: "LUX" + crypto.randomBytes(3).toString("hex").toUpperCase(),
      LUX_STATUS_FILE: statusFile
    },
    stdio: ["ignore", "pipe", "pipe"]
  });
  child.stdout.pipe(log);
  child.stderr.pipe(log);
  child.on("exit", (code) => {
    log.end();
    const status = { status: "stopped", details: `انتهت عملية البوت (رمز الخروج ${code}).`, updatedAt: new Date().toISOString() };
    try { fs.writeFileSync(statusFile, JSON.stringify(status, null, 2), { mode: 0o600 }); } catch {}
    workers.delete(userId);
  });
  workers.set(userId, { child, phone, startedAt: new Date().toISOString() });
  return { pid: child.pid };
}

app.get("/api/health", (_req, res) => res.json({ ok: true, name: "Lux Bot API" }));

app.post("/api/auth/register", async (req, res) => {
  const username = String(req.body?.username || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!/^[a-z0-9_]{3,24}$/.test(username)) return res.status(400).json({ error: "اسم المستخدم: 3 إلى 24 حرفاً إنجليزياً أو رقماً أو _." });
  if (password.length < 10) return res.status(400).json({ error: "كلمة المرور يجب أن تكون 10 أحرف على الأقل." });
  const id = crypto.randomUUID();
  try {
    const hash = await bcrypt.hash(password, 12);
    db.prepare("INSERT INTO users(id,username,password_hash,created_at) VALUES(?,?,?,?)")
      .run(id, username, hash, new Date().toISOString());
    db.prepare("INSERT INTO bot_accounts(user_id,created_at) VALUES(?,?)").run(id, new Date().toISOString());
    const user = { id, username };
    res.status(201).json({ token: issueToken(user), user });
  } catch {
    res.status(409).json({ error: "اسم المستخدم مستخدم بالفعل." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const username = String(req.body?.username || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const user = db.prepare("SELECT id,username,password_hash FROM users WHERE username=?").get(username);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: "بيانات الدخول غير صحيحة." });
  }
  res.json({ token: issueToken(user), user: { id: user.id, username: user.username } });
});

app.get("/api/me", auth, (req, res) => {
  res.json({ id: req.user.sub, username: req.user.username });
});

app.post("/api/whatsapp/connect", auth, (req, res) => {
  const phone = String(req.body?.phone || "").replace(/\D/g, "");
  if (phone.length < 8 || phone.length > 15) return res.status(400).json({ error: "أدخل الرقم مع مفتاح الدولة، من دون + أو مسافات." });
  const activeCount = [...workers.values()].filter(w => w.child.exitCode === null).length;
  if (!workers.has(req.user.sub) && activeCount >= MAX_ACTIVE_BOTS) {
    return res.status(503).json({ error: "وصلت المنصة إلى الحد الحالي من الاتصالات. حاول لاحقاً." });
  }
  const pairCode = makePairCode();
  try {
    startWorker(req.user.sub, phone, pairCode);
    db.prepare("UPDATE bot_accounts SET phone=? WHERE user_id=?").run(phone, req.user.sub);
    res.json({
      ok: true,
      phone,
      pairingCode: `${pairCode.slice(0,4)}-${pairCode.slice(4)}`,
      instructions: "افتح واتساب في هاتفك، ثم الأجهزة المرتبطة، ثم ربط جهاز، ثم الربط برقم الهاتف، وأدخل الرمز."
    });
  } catch (err) {
    res.status(500).json({ error: "تعذر بدء محرك واتساب: " + err.message });
  }
});

app.get("/api/whatsapp/status", auth, (req, res) => {
  const file = path.join(userDir(req.user.sub), "status.json");
  let state = { status: "not_started", details: "لم يتم تشغيل البوت بعد." };
  try { state = JSON.parse(fs.readFileSync(file, "utf8")); } catch {}
  const worker = workers.get(req.user.sub);
  res.json({ ...state, processRunning: Boolean(worker && worker.child.exitCode === null) });
});

app.post("/api/whatsapp/stop", auth, (req, res) => {
  const stopped = stopWorker(req.user.sub);
  res.json({ ok: true, stopped, message: stopped ? "تم إيقاف عملية البوت." : "لا توجد عملية تعمل حالياً." });
});

app.post("/api/whatsapp/disconnect", auth, (req, res) => {
  stopWorker(req.user.sub);
  const dir = userDir(req.user.sub);
  const sessionDir = path.join(dir, "session");
  fs.rmSync(sessionDir, { recursive: true, force: true });
  const statusFile = path.join(dir, "status.json");
  try { fs.rmSync(statusFile, { force: true }); } catch {}
  res.json({ ok: true, message: "تم إيقاف البوت وحذف بيانات جلسة الربط المحلية. إذا بقي الجهاز مرتبطاً، أزله من الأجهزة المرتبطة في واتساب." });
});

app.get("/api/commands", auth, (req, res) => {
  const disabled = new Set(readState(req.user.sub).disabledPlugins || []);
  res.json(catalog.map(item => ({ ...item, enabled: !disabled.has(item.id) })));
});

app.patch("/api/commands/:id", auth, (req, res) => {
  const id = String(req.params.id || "");
  const item = catalog.find(x => x.id === id);
  if (!item) return res.status(404).json({ error: "الأمر غير موجود." });
  const enabled = Boolean(req.body?.enabled);
  const state = readState(req.user.sub);
  const disabled = new Set(state.disabledPlugins || []);
  if (enabled) disabled.delete(id); else disabled.add(id);
  writeState(req.user.sub, { disabledPlugins: [...disabled] });
  res.json({ ok: true, id, enabled });
});

app.listen(PORT, "0.0.0.0", () => console.log(`Lux Bot API listening on ${PORT}`));
