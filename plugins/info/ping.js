import { gateCommand } from "../../system/command-gate.js";
const handler = async (m, { conn, cli }) => {
  const start = process.hrtime.bigint();
  await conn.sendMessage(m.chat, { text: "🏓 msg test" });
  const end = process.hrtime.bigint();
  const ping = Number(end - start) / 1e6;

  const msg =
    `*⪩ سـرعـة الـبـوت ↯ •*\n` +
    `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
    `⦑ ⚡ ⦒ ⦂ الاسـتـجـابـة ↜ ⟦ ${ping.toFixed(2)}ms ⟧\n\n` +
    `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
    `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`;

  await conn.linkPreview(
    m.chat,
    {
      text: msg,
      url: "https://raw.githubusercontent.com/MohamedVex/Lora-Upload1/main/uploads/1794412621932.jpg",
      height: 438,
      width: 734,
      title:
        "𝐑 𝐄 𝐙 𝐄 — 𝐕𝐈𝐈7 🪻 | 𝐁𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐌𝐄𝐎𝐖𝐒𝐀𝐁 𝐅𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤",
      description: "𝚃𝚎𝚜𝚝𝚒𝚗𝚐 𝚝𝚑𝚎 𝚋𝚘𝚝'𝚜 𝚜𝚙𝚎𝚎𝚍: 𝙸𝚜 𝚒𝚝 𝚏𝚊𝚜𝚝 𝚘𝚛 𝚗𝚘𝚝?",
      contextInfo: cli?.config?.info?.channel,
    },
    { quoted: m }
  );
};

handler.command = ["بنج", "ping"];
handler.category = "info";
handler.usage = ["بنج"];
export default gateCommand(handler, import.meta.url);