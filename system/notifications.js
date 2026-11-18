const notif_ = async (ctx, { m, conn }) => {
  const senderJid = m?.jid ?? "201066826750";
  const senderNumber = senderJid ? senderJid.split("@")[0] : "201066826750";

  const quoted = {
    key: {
      participant: `867051314767696@bot`,
      remoteJid: "status@broadcast",
      fromMe: false,
    },
    message: {
      contactMessage: {
        displayName: "ᡣ𐭩🪻 Lux Bot ૮₍ ˃ ⤙ ˂ ₎ა",
        verifiedName: "ᡣ𐭩🪻 Lux Bot ૮₍ ˃ ⤙ ˂ ₎ა",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Anti Theft Bot\nitem1.TEL;waid=${senderNumber}:${senderNumber}\nEND:VCARD`,
      },
    },
    participant: "867051314767696@bot",
  };

  const captions = {
    admin:
      `*⪩ الأمـر ده للادمـن فـقـط: ↯ •*\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ اسـتـخـدمـه وانـت ادـمـن يـاعـبـد\n\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
      `> ⦂ Lux Bot | منصة لوكس ╷`,

    owner:
      `*⪩ الأمـر ده للـمـطـوريـن فـقـط: ↯ •*\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ اسـتـخـدمـه وانـت مـطـور يـاعـبـد\n\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
      `> ⦂ Lux Bot | منصة لوكس ╷`,

    group:
      `*⪩ الأمـر ده للـجـروبـات فـقـط: ↯ •*\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ اسـتـخـدمـه داخـل الـجـروب يـاعـبـد\n\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
      `> ⦂ Lux Bot | منصة لوكس ╷`,

    private:
      `*⪩ الأمـر ده للـخـاص فـقـط: ↯ •*\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ اسـتـخـدمـه فـي الـخـاص يـاعـبـد\n\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
      `> ⦂ Lux Bot | منصة لوكس ╷`,

    botAdmin:
      `*⪩ الـبـوت لازم يـكـون ادـمـن: ↯ •*\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ ارفـع الـبـوت ادـمـن الأول يـاعـبـد\n\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
      `> ⦂ Lux Bot | منصة لوكس ╷`,

    cooldown:
      `*⪩ اسـتـنـى شـويـة: ↯ •*\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ الأمـر فـي وقـت تـهـديـئـة\n` +
      `⦑ ➋ ⦒ ⦂ الـمـتـبـقـي ↜ ⟦ {TIME} ⟧\n\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
      `> ⦂ Lux Bot | منصة لوكس ╷`,

    disabled:
      `*⪩ الأمـر مـتـعـطـل: ↯ •*\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ الأمـر ده مـتـوقـف مـؤقـتـًا يـاعـبـد\n\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
      `> ⦂ Lux Bot | منصة لوكس ╷`,

    exclusive:
      `*⪩ الأمـر مـشـغـول: ↯ •*\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ الأمـر ده مـسـتـخـدم مـن حـد قـبـلـك\n` +
      `⦑ ➋ ⦒ ⦂ اسـتـنـى شـويـة وجـرب تـانـي\n\n` +
      `── ⋅ ⋅ ── 🪻 ── ⋅ ⋅ ── \n` +
      `> ⦂ Lux Bot | منصة لوكس ╷`,
  };

  const sendWarning = async (caption) => {
    return conn.docThumb(
      m.chat,
      {
        image:
          "https://i.pinimg.com/736x/1d/a1/78/1da178ed0a9d4db426ae0982324071e8.jpg",
        size: 1024000,
        fileName: "𝐒𝐲𝐬𝐭𝐞𝐦 : 𝐖𝐚𝐫𝐧𝐢𝐧𝐠",
        caption,
      },
      quoted
    );
  };

  ctx.admin(() => sendWarning(captions.admin));
  ctx.owner(() => sendWarning(captions.owner));
  ctx.group(() => sendWarning(captions.group));
  ctx.private(() => sendWarning(captions.private));
  ctx.botAdmin(() => sendWarning(captions.botAdmin));
  ctx.exclusive(() => sendWarning(captions.exclusive));
  ctx.cooldown((remaining) => {
    const secs = Math.ceil(remaining / 1000);
    const minutes = (secs / 60).toFixed(1);
    return sendWarning(captions.cooldown.replace("{TIME}", `${minutes} دقـيـقـة`));
  });

  ctx.disabled(() => sendWarning(captions.disabled));
};

export default notif_;