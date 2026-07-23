// Serverless function (Vercel Node.js runtime).
// Receives the contact form POST and forwards it as a message to a Telegram chat.
//
// Requires two environment variables, set in the Vercel project settings:
//   TELEGRAM_BOT_TOKEN  — token you get from @BotFather
//   TELEGRAM_CHAT_ID    — the chat/user/group id that should receive the leads
//
// See README.md for step-by-step setup instructions.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { from = '', to = '', date = '', vehicle = '', phone = '' } = req.body || {};

    if (!phone) {
      res.status(400).json({ ok: false, error: 'Не вказано телефон' });
      return;
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      res.status(500).json({ ok: false, error: 'Telegram не налаштований (немає env змінних)' });
      return;
    }

    const text =
      '🚚 Нова заявка з сайту TechnoBus\n\n' +
      `Звідки: ${from || '—'}\n` +
      `Куди: ${to || '—'}\n` +
      `Дата: ${date || '—'}\n` +
      `Клас авто: ${vehicle || '—'}\n` +
      `Телефон: ${phone}`;

    const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    const tgData = await tgResponse.json();

    if (!tgData.ok) {
      throw new Error(tgData.description || 'Telegram API error');
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
