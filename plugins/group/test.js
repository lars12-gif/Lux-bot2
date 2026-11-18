import { gateCommand } from "../../system/command-gate.js";
const fff = async (m, { conn, text,}) => {
await conn.linkPreview(m.chat, {
      text: `𝐑𝐞𝐳𝐞 𝐛𝐨𝐭 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 🪻`,
  url: 'https://raw.githubusercontent.com/MohamedVex/Lora-Upload1/main/uploads/1792145035204.jpg',
     height: 438,
      width: 734,  
      title: "𝐑 𝐄 𝐙 𝐄 — 𝐕𝐈𝐈7 🪻 | 𝐁𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐌𝐄𝐎𝐖𝐒𝐀𝐁 𝐅𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤",
      description: "𝙰 𝚋𝚘𝚝 𝚝𝚘 𝚝𝚎𝚜𝚝 𝚝𝚑𝚎 𝚗𝚎𝚠 𝚏𝚛𝚊𝚖𝚎𝚠𝚘𝚛𝚔"
    }, {quoted:  m});
};
fff.usage = ["تست"]
fff.command = ["تست"];
fff.prefixe = false;
fff.category = "group";
export default gateCommand(fff, import.meta.url);