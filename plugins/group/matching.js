import { gateCommand } from "../../system/command-gate.js";
const handler = async (m, { conn, args }) => {
  try {
    const union = await (await import("meowsab")).Api.name("auralix");
    const res = await union.url("/image/matching-pp", {});
    
    const data = typeof res === 'string' ? JSON.parse(res) : res;
    const boy = data.data?.boy || data.boy;
    const girl = data.data?.girl || data.girl;

    if (!boy || !girl) throw new Error("مفيش صور");

    await conn.buttonV2(m.chat, {
      text: "# Boy 🚹",
      footer: "> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷",
      image: boy,
      buttons: [
        {
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "📎╎ قــنــاتــي ",
            url: "https://whatsapp.com/channel/0029Vb3UUKz3QxS3bgWmTc3x",
            merchant_url: "https://whatsapp.com/channel/0029Vb3UUKz3QxS3bgWmTc3x"
          })
        }
      ],
      newsletter: {
        name: '𝐕𝐈𝐈7 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
        jid: '120363225356834044@newsletter'
      }
    }, { quoted: m });

    return await conn.buttonV2(m.chat, {
      text: "# girl 🚺",
      footer: "> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷",
      image: girl,
      buttons: [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "▶️ ╎ الـتـالـي ",
            id: ".تطقيم"
          })
        }
      ],
      newsletter: {
        name: '𝐕𝐈𝐈7 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
        jid: '120363225356834044@newsletter'
      }
    }, { quoted: m });

  } catch (e) {
    m.reply(`*⪩ حصل خطأ: ↯ •*\n${e.message}`);
  }
};

handler.usage = ["تطقيم"];
handler.category = "group";
handler.command = ["ماتشينج", "تطقيم"];

export default gateCommand(handler, import.meta.url);