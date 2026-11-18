import { gateCommand } from "../../system/command-gate.js";
const groupSubject = async (m, {conn, text})=> {
  const [action, ...args] = text.trim().split(/\s+/);
const value = args.join(' ');
  if (action === "اسم") {
    if (!value)
      return m.reply("🪻: اكتب اسم الجروب الجديد الاول")
  await conn.groupUpdateSubject(m.chat, value);
    return m.reply('🪻: تم تغيير اسم الجروب بنجاح.');
}
  else if (action === "وصف") {
    if (!value)
      return m.reply("🪻: اكتب الوصف الجديد اول")
    await conn.groupUpdateDescription(m.chat, value);
    return m.reply('🪻: تم تغيير وصف الجروب بنجاح.');
  }
  else if (action === "صورة" || action === "صوره" ) {
    const quoted = m.quoted;

    if (!quoted || !/image/.test(quoted.mimetype || '')) {
      return m.reply('🪻: رد على صورة واكتب:\n.جروب صورة');
    }

    const buffer = await quoted.download();
    await conn.updateProfilePicture(m.chat, buffer);
    return m.reply('🪻: تم تغيير صورة الجروب بنجاح.');
  }

  else {
    return m.reply(
      '*⪩ طريقة الاستخدام: ↯ •*\n' +
      '── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n' +
      '⦑ ➊ ⦒ ⦂ .جروب اسم ↜ ⟦ تعديل اسم الحروب ⟧\n' +
      '⦑ ➋ ⦒ ⦂ .جروب وصف ↜ ⟦ تعديل وصف الجروب ⟧\n' +
      '⦑ ➌ ⦒ ⦂ .جروب صورة ↜ ⟦ تعديل صورة الجروب (بالرد على صورة) ⟧\n\n' +
      '── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n' +
      '> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷'
    );
  }
}
groupSubject.usage = ["جروب"]
groupSubject.command = ["جروب"]
groupSubject.admin  = true;
groupSubject.category = "admins";
groupSubject.botAdmin = true;
export default gateCommand(groupSubject, import.meta.url);
