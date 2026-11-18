import { SubBots } from "meowsab";

export let subs;
export async function subBots(client) {
  subs = new SubBots({
    root: process.env.LUX_SUB_DIR || "./sub",
    storage: "auto",
    code: process.env.LUX_SUB_CODE || "LUX71234",
    main: client,
    settings: {},
  });
globalThis.subBots = subs;
  subs.on("ready", (sock) => console.log("ready:", sock.user?.id));

  await subs.start();
  
  return subs;
}