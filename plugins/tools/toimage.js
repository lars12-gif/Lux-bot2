import { gateCommand } from "../../system/command-gate.js";
const toimg = async (m, { conn, command }) => {
  try {
    if (!m.quoted)
      return m.reply(
        `*⪩ لازم ترد على استيكر: ↯ •*\n` +
        `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ .${command} ↜ ⟦ رد على استيكر ⟧\n` +
        `⦑ ➋ ⦒ ⦂ مثال ↜ ⟦ .${command} (بالرد على استيكر) ⟧\n\n` +
        `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`
      );

    const buffer = await m.quoted.download();

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption:
        `*⪩ تم التحويل بنجاح: ↯ •*\n` +
        `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ النوع ↜ ⟦ استيكر ← صورة ⟧\n\n` +
        `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`
    }, { quoted: m });
  } catch (e) {
    await conn.sendMessage(m.chat, {
      text:
        `*⪩ حصل خطأ: ↯ •*\n` +
        `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ ${e.message}\n\n` +
        `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`
    }, { quoted: m });
  }
};

toimg.usage = ["لصوره"];
toimg.category = "tools";
toimg.command = ["لصوره", "toimage", "toimg"];
export default gateCommand(toimg, import.meta.url);