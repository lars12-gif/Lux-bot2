import { gateCommand } from "../../system/command-gate.js";
import os from "os";

const handler = async (m, { conn, cli }) => {
  const txt =
    `*⪩ اسـتـهـلاك الـرام ↯ •*\n` +
    `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
    `⦑ 📥 ⦒ ⦂ الـمسـتـخـدم ↜ ⟦ ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)}MB ⟧\n` +
    `⦑ 📤 ⦒ ⦂ الـمتـبـقـي ↜ ⟦ ${(os.freemem() / 1024 / 1024).toFixed(1)}MB ⟧\n\n` +
    `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
    `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`;

  await conn.sendMessage(
    m.chat,
    {
      text: txt,
      contextInfo: cli?.config?.info?.channel,
      mentions: [m.sender],
    },
    { quoted: m }
  );
};

handler.command = ["الرام", "ram"];
handler.category = "info";
handler.usage = ["ram"];
export default gateCommand(handler, import.meta.url);