import { BOT_TOKEN, BOT_CHAT_ID } from '../config.js';

export async function sendToTelegramBot(text){
  if(!BOT_TOKEN || !BOT_CHAT_ID) return; // not configured yet — data still saved locally
  try{
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: BOT_CHAT_ID, text })
    });
  }catch(e){ /* network/bot issue — data is still saved locally */ }
}
