import { gateCommand } from "../../system/command-gate.js";
import process from "node:process";
const restart = async (m, { conn }) => {
  m.react("⏳");
await   conn.linkPreview(m.chat, {
      text: "جاري إعادة تشغيل البوت...",
      url: 'https://raw.githubusercontent.com/MohamedVex/Lora-Upload1/main/uploads/1792145035204.jpg',
     height: 438,
      width: 734,  
      title: "𝐑 𝐄 𝐙 𝐄 — 𝐕𝐈𝐈7 🪻 | 𝐁𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐌𝐄𝐎𝐖𝐒𝐀𝐁 𝐅𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤",
      description: "𝙰 𝚋𝚘𝚝 𝚝𝚘 𝚝𝚎𝚜𝚝 𝚝𝚑𝚎 𝚗𝚎𝚠 𝚏𝚛𝚊𝚖𝚎𝚠𝚘𝚛𝚔"
    }, {quoted:  m});
  process.exit(1);
};

restart.usage = ["ريستارت"]
restart.command = ["ريستارت", "restart"];
restart.owner = true;
restart.category = "owners";
export default gateCommand(restart, import.meta.url);
