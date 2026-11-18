import { gateCommand } from "../../system/command-gate.js";
const toGif = async (m, { conn, command }) => {
  try {
    if (!m.quoted)
      return m.reply(
        `*⪩ لازم ترد على فيديو: ↯ •*\n` +
        `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ .${command} ↜ ⟦ رد على فيديو ⟧\n` +
        `⦑ ➋ ⦒ ⦂ مثال ↜ ⟦ .${command} (بالرد على فيديو) ⟧\n\n` +
        `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`
      );

    const buffer = await m.quoted.download();

    await conn.sendMessage(m.chat, {
      video: buffer,
      gifPlayback: true,
      caption:
        `*⪩ تم التحويل بنجاح: ↯ •*\n` +
        `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ النوع ↜ ⟦ فيديو ← جيف ⟧\n\n` +
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

toGif.usage = ["لجيف"];
toGif.category = "tools";
toGif.command = ["لجيف", "togif", "لچيف"];
export default gateCommand(toGif, import.meta.url);