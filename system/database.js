import fs from "node:fs";
import path from "node:path";

const dataDir = path.resolve(process.env.LUX_DATA_DIR || "./data/local");
const dbFile = path.join(dataDir, "database.json");
fs.mkdirSync(dataDir, { recursive: true });

if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify({ groups: {}, marriages: {} }, null, 2));
}
global.db = JSON.parse(fs.readFileSync(dbFile, "utf8"));
global.saveDB = () => {
  const tmp = `${dbFile}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(global.db, null, 2));
  fs.renameSync(tmp, dbFile);
};
