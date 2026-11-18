import { gateCommand } from "../../system/command-gate.js";
const handler = async (m, { conn, text, command, cli }) => {
  const query = (text || "").trim();

  if (!query) {
    try { await m.react("🪻"); } catch {}
    return m.reply(
      `*⪩ طريقة الاستخدام: ↯ •*\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ .${command} ↜ ⟦ ابـحـث واصـنـع حـزمـة مـلـصـقـات ⟧\n` +
      `⦑ ➋ ⦒ ⦂ مثال ↜ ⟦ .${command} Anime ⟧\n\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`
    );
  }

  try { await m.react("🔍"); } catch {}

  try {
    const union = await (await import("meowsab")).Api.name("auralix");
    const res = await union.url("/search/pinterest", { q: query });

    if (!res?.data?.status || !res?.data?.data || res.data.data.length === 0) {
      try { await m.react("❌"); } catch {}
      return m.reply(
        `*⪩ ملقتش نتائج: ↯ •*\n` +
        `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ البحث ↜ ⟦ ${query} ⟧\n` +
        `⦑ ➋ ⦒ ⦂ جرّب كلمة تانية\n\n` +
        `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`
      );
    }

    try { await m.react("🎨"); } catch {}

    const urls = res.data.data.slice(0, 10).map((item) => item.url);

    await conn.StickerPack(m.chat, {
      file: urls,
      pack: query,
      author: "VII7",
      contextInfo: cli?.config?.info?.channel
    }, m);

    try { await m.react("🪻"); } catch {}
  } catch (error) {
    try { await m.react("❌"); } catch {}
    m.reply(
      `*⪩ حصل خطأ: ↯ •*\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ ${error.message}\n\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`
    );
  }
};

handler.usage = ["حزمه"];
handler.command = ["ستيك", "استيك", "حزمه"];
handler.category = "sticker";

export default gateCommand(handler, import.meta.url);