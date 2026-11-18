import { gateCommand } from "../../system/command-gate.js";
const handler = async (m, { conn, cli, text, command }) => {
 
  const q = m.quoted || m;
  const mime = q.mimetype || q.msg?.mimetype || "";

  if (!/image|video|webp/.test(mime))
    return m.reply(
      `*⪩ لازم ترد على صورة أو فيديو: ↯ •*\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ .${command} ↜ ⟦ رد على صورة أو فيديو ⟧\n` +
      `⦑ ➋ ⦒ ⦂ .${command} اسم | مؤلف ↜ ⟦ لتحديد الاسم والمؤلف ⟧\n` +
      `⦑ ➌ ⦒ ⦂ مثال ↜ ⟦ .${command} reze | VII7 ⟧\n\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`
    );

  if (/video/.test(mime) && (q.msg?.seconds || q.seconds || 0) > 10)
    return m.reply(
      `*⪩ الفيديو طويل: ↯ •*\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ الفيديو لازم يكون ↜ ⟦ 10 ثواني أو أقل ⟧\n\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`
    );

  try {
    const buffer = await q.download();
    if (!buffer)
      return m.reply(
        `*⪩ فشل تحميل الملف: ↯ •*\n` +
        `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ حاول تاني\n\n` +
        `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`
      );

    const [pack, author] = (text || "").split("|").map(v => v.trim());

    await conn.Sticker(
      m.chat,
      {
        file: buffer,
        pack: pack || "reze",
        author: author || "𝐛𝐲 : 𝐕𝐈𝐈𝟕",
        full: false,
      },
      { quoted: m }
    );
  } catch (e) {
    console.error("خطأ في أمر ستيكر:", e);
    return m.reply(
      `*⪩ فشل إنشاء الستيكر: ↯ •*\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ ${e.message}\n\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`
    );
  }
};

handler.usage = ["ستيكر"];
handler.command = ['ستيكر', 'استيكر', 's', 'لستيكر'];
handler.category = "stickers";
export default gateCommand(handler, import.meta.url);