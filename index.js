import { Client } from "meowsab";
import { subBots, subs } from "./system/sub.js";
import "meowsab/safe";
import "./system/database.js";
import * as baileys from "baileys";
import notifications from "./system/notifications.js";
import fs from "node:fs";
import path from "node:path";

const phone = String(process.env.LUX_PHONE || "").replace(/\D/g, "");
const tenantId = String(process.env.LUX_TENANT_ID || "local");
const dataDir = path.resolve(process.env.LUX_DATA_DIR || "./data/local");
const sessionDir = path.resolve(process.env.LUX_SESSION_DIR || path.join(dataDir, "session"));
const statusFile = process.env.LUX_STATUS_FILE || path.join(dataDir, "status.json");

if (!phone || phone.length < 8 || phone.length > 15) {
  throw new Error("أدخل رقم واتساب بصيغة دولية في متغير LUX_PHONE قبل تشغيل المحرك.");
}

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(sessionDir, { recursive: true });

function setStatus(status, details = "") {
  try {
    fs.writeFileSync(statusFile, JSON.stringify({
      tenantId, status, details, updatedAt: new Date().toISOString()
    }, null, 2));
  } catch {}
}

/* إعداد مستقل لكل حساب */
const client = new Client({
  plugsdir: "plugins",
  prefix: [".", "!"],
  library: [baileys],
  sessionStorage: {
    type: "sqlite",
    path: sessionDir,
  },
  login: {
    method: "pair",
    number: phone,
    code: String(process.env.LUX_PAIR_CODE || ""),
  },
  owners: [
    { jid: `${phone}@s.whatsapp.net` }
  ],
  settings: {
    message_owner_only: false,
    private_mode: false,
    message_group_only: false,
    no_message_baileys: false,
    from_me: false,
  },
});

const { config } = client;
config.info = {
  nameBot: "Lux Bot",
  title: "Lux Bot | منصة لوكس",
  images: [],
};

const plugins = client.plug();
plugins.notification(notifications);

client.on("error", (err) => {
  const message = String(err?.stack || err?.message || err).slice(0, 2500);
  console.error("[Lux Bot]", message);
  setStatus("error", "حدث خطأ في اتصال البوت. راجع سجل الاستضافة.");
});

const start = async () => {
  setStatus("starting", "يتم تشغيل محرك واتساب...");
  await client.connect();
  await subBots(client);
  await subs.start();
  setStatus("running", "محرك البوت يعمل. قد يلزم إكمال ربط واتساب من الهاتف.");
  console.log(`[Lux Bot] tenant=${tenantId} started`);
};

start().catch((err) => {
  console.error("[Lux Bot] Startup error:", err);
  setStatus("error", "تعذر تشغيل المحرك. راجع سجل الاستضافة.");
  process.exitCode = 1;
});
