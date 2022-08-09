const TelegramBot = require('node-telegram-bot-api');
const fetch = require("node-fetch");
const emoji = require('node-emoji').emoji
const token = process.env['token']
const bot = new TelegramBot(token, { polling: true });
const chatId = -703007506;
const cron = require('node-cron');
const jaekyungApi = "https://beaconcha.in/api/v1/validator/0x9433e36cfdbaff1171e8949b751ba3fb4ee52d91571574489adaa7c29d663ea7923688e5506f2118d11a12231a6cd6fe/attestations";
const heejunApi1 = "https://beaconcha.in/api/v1/validator/0xb25b055ea4c46456d37f964989611b850021bf43323e5b46b446e56e115414f85971b1e36e9fbccd0354952fad74d331/attestations";
const heejunApi2 = "https://beaconcha.in/api/v1/validator/0x88b4478c4935d93beddfbfb89a456ccd541ee86c9620bad56181644fa7208f368c6797758886bb4433ca2f21f3ba637f/attestations";
const haminApi = "https://beaconcha.in/api/v1/validator/0x9113baea7d6b6efc95b1f643a0d71df0f431f909708c9acd2f3710a4f43961e716cc866a81141d686de666e0f0485122/attestations";

bot.sendMessage(chatId, "봇 재시작");

cron.schedule('*/2 * * * *', async () => {
  try {
    let [jeakyungData, heejunData1, heejunData2, haminData] = await Promise.all([
      fetch(jaekyungApi),
      fetch(heejunApi1),
      fetch(heejunApi2),
      fetch(haminApi)
    ]);

    if (jeakyungData.status !== 200 || heejunData1.status !== 200 || heejunData2.status !== 200 || haminData.status !== 200) {
      console.log("run in error", `재경 데이터: ${JSON.stringify(await jeakyungData.json())} \n\n 희준 데이터1: ${JSON.stringify(await heejunData1.json())} \n\n 희준 데이터2: ${JSON.stringify(await heejunData2.json())} \n\n 하민 데이터: ${JSON.stringify(await haminData.json())}`);
      bot.sendMessage(chatId,
        `${jeakyungData.status === 200 ? "재경 노드: 문제없음" : emoji.no_entry_sign + "재경 노드: 문제있음"}\n${heejunData1.status === 200 && heejunData2.status === 200 ? emoji.no_entry_sign + "희준 노드: 문제없음" : emoji.no_entry_sign + "희준 노드: 문제있음"}\n${haminData.status === 200 ? emoji.no_entry_sign + "하민 노드: 문제없음" : emoji.no_entry_sign + "하민 노드: 문제있음"}`);
    } else {
      console.log("run fine");
    }

  } catch (err) {
    console.log(err)
    bot.sendMessage(chatId, "API 또는 봇 에러");
  }
})
