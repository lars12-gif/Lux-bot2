import { gateCommand } from "../../system/command-gate.js";
const luxPlugin = {
  event: 'group-participants.update',

  async run(data, { conn, cli }) {
    const { id, participants, action } = data;

    if (!['add', 'remove'].includes(action)) return;

    if (global.db?.groups?.[id]?.welcome !== true) return;

    const now = Date.now();
    if (!global.startupTime) global.startupTime = now;
    
    if (now - global.startupTime < 10000) return;

    const contextInfo = cli?.config?.info?.channel;
    let groupName = 'Our Group';
    let groupMembers = 0;

    try {
      const metadata = await conn.groupMetadata(id);
      groupName = metadata?.subject || groupName;
      groupMembers = metadata?.participants?.length || 0;
    } catch (error) {
      console.error('Metadata error:', error);
    }

    for (const participant of participants || []) {
      const jid = typeof participant === 'string' ? participant : participant?.id || participant?.jid;
      if (!jid) continue;

      const num = jid.split('@')[0].split(':')[0];

      try {
        if (action === 'add') {
          const text = `*⪩ تـم الانـضـمـام ↯ •*\n` +
                       `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
                       `*『 🪻 اهـلا بـك فـي الـجـروب 』*\n\n` +
                       `⦑ ➊ ⦒ ⦂ الـعـضـو ↜ ⟦ @${num} ⟧\n` +
                       `⦑ ➋ ⦒ ⦂ الـجـروب ↜ ⟦ ${groupName} ⟧\n` +
                       `⦑ ➌ ⦒ ⦂ الاعـضـاء ↜ ⟦ ${groupMembers} ⟧\n\n` +
                       `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
                       `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`;

          await conn.linkPreview(id, {
            text,
            url: "https://raw.githubusercontent.com/MohamedVex/Lora-Upload1/main/uploads/1794253862863.jpg",
            height: 438,
            width: 734,
            title: "𝐑 𝐄 𝐙 𝐄 — 𝐕𝐈𝐈7 🪻 | 𝐖𝐞𝐥𝐜𝐨𝐦𝐞",
            description: `اهـلا بـك فـي ${groupName} 🪻`,
            mentions: [jid],
            contextInfo: contextInfo
          }, { quoted: null });

        } else if (action === 'remove') {
          const text = `*⪩ تـم الـخـروج ↯ •*\n` +
                       `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
                       `*『 🪻 وداعـاً لـك 』*\n\n` +
                       `⦑ ➊ ⦒ ⦂ الـعـضـو ↜ ⟦ @${num} ⟧\n` +
                       `⦑ ➋ ⦒ ⦂ الـجـروب ↜ ⟦ ${groupName} ⟧\n` +
                       `⦑ ➌ ⦒ ⦂ الاعـضـاء ↜ ⟦ ${groupMembers} ⟧\n\n` +
                       `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
                       `> ⦂ 𝐫𝐞𝐳𝐞 ↚ 𝐛𝐲 : 𝐕𝐈𝐈𝟕 ╷`;

          await conn.linkPreview(id, {
            text,
            url: "https://raw.githubusercontent.com/MohamedVex/Lora-Upload1/main/uploads/1794253862863.jpg",
            height: 438,
            width: 734,
            title: "𝐑 𝐄 𝐙 𝐄 — 𝐕𝐈𝐈7 🪻 | 𝐆𝐨𝐨𝐝𝐛𝐲𝐞",
            description: `وداعـاً لـك مـن ${groupName} 🪻`,
            mentions: [jid],
            contextInfo: contextInfo
          }, { quoted: null });
        }

      } catch (error) {
        console.error(`Welcome event error for ${jid}:`, error);
      }
    }
  }
};
export default gateCommand(luxPlugin, import.meta.url);