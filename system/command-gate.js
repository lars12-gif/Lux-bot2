import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function pluginId(fileUrl) {
  const file = fileURLToPath(fileUrl);
  const base = path.resolve(process.cwd(), "plugins");
  return path.relative(base, file).split(path.sep).join("/");
}

function enabled(id) {
  try {
    const dataDir = path.resolve(process.env.LUX_DATA_DIR || "./data/local");
    const stateFile = path.join(dataDir, "commands.json");
    const state = JSON.parse(fs.readFileSync(stateFile, "utf8"));
    return !(state.disabledPlugins || []).includes(id);
  } catch {
    return true;
  }
}

function guard(fn, id) {
  return async function (...args) {
    if (!enabled(id)) {
      const message = args[0];
      if (message && typeof message.reply === "function") {
        await message.reply("هذا الأمر متوقف حالياً من لوحة تحكم Lux Bot.");
      }
      return;
    }
    return fn.apply(this, args);
  };
}

export function gateCommand(handler, fileUrl) {
  const id = pluginId(fileUrl);
  if (typeof handler === "function") {
    const wrapped = guard(handler, id);
    Object.assign(wrapped, handler);
    return wrapped;
  }
  if (handler && typeof handler === "object") {
    const wrapped = { ...handler };
    for (const key of ["execute", "run"]) {
      if (typeof wrapped[key] === "function") wrapped[key] = guard(wrapped[key], id);
    }
    return wrapped;
  }
  return handler;
}
