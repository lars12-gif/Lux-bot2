import { gateCommand } from "../../system/command-gate.js";
import { WebpToMp4 } from "../../system/utils.js";

let handler = async (m, { conn, text, command }) => {
  if (!m.quoted)
    return m.reply(
      `*⪩ لازم ترد على استيكر: ↯ •*\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ .${command} ↜ ⟦ رد على استيكر ⟧\n\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`
    );

  if (!/webp/.test(m.quoted.mimetype || ''))
    return m.reply(
      `*⪩ ده مش استيكر: ↯ •*\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ تأكد إن الملف استيكر WebP\n\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`
    );

  try {
    const buffer = await m.quoted.download();
    const smp4 = await WebpToMp4(buffer);

    await conn.sendMessage(m.chat, {
      video: { url: smp4 },
      caption:
        `*⪩ تم التحويل بنجاح: ↯ •*\n` +
        `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ النوع ↜ ⟦ استيكر ← فيديو ⟧\n\n` +
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

handler.usage = ["لفيديو"];
handler.category = "tools";
handler.command = /^(tovideo|tovid|tomp4|لفيديو)$/i;

export default gateCommand(handler, import.meta.url);