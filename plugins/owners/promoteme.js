import { gateCommand } from "../../system/command-gate.js";
const promoteme = async (m) => {
    m.promote(m.sender)
   await m.reply("تم رفعك ادمن يا مطوري 🪻")
}

promoteme.usage = ["ارفعني"];
promoteme.command = ["ارفعني"];
promoteme.owner = true;
promoteme.admin = false;
promoteme.botAdmin = true;

promoteme.category = "owners";
export default gateCommand(promoteme, import.meta.url);