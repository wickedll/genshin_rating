import { InputParameter } from "@modules/command";
import fetch from "node-fetch";
import lodash from "lodash";
import bot from "ROOT";
import { imageOrc } from "../utils/data";



export async function main(
	{ sendMessage, messageData }: InputParameter
): Promise<void> {
	const { user_id: userID, raw_message: msg } = messageData;
	if(msg.indexOf('[CQ:image') <= -1){
		sendMessage(`请发送圣遗物截图`);
		return;
	}
	// bot.logger.info(456456456);
	// bot.logger.info(msg);
	// const source = msg.match(/\[CQ:image,file=.+?\]/);
	// bot.logger.info(source);
	const [url] = /(?<=url=).+(?=])/.exec(msg) || [];
	// bot.logger.info(url);
	const headers = {
		"Content-Type": "application/json",
	};
	let data, response, ret;
	const prop = await imageOrc(msg, url, bot, sendMessage);
	bot.logger.info(JSON.stringify(prop));

	if (undefined === prop) {
		return;
	}

	try {
		response = await fetch("https://api.genshin.pub/api/v1/relic/rate", {
		method: "POST",
		headers,
		body: JSON.stringify(prop),
		});
		

		ret = await response.json();
	} catch (e) {
		bot.logger.info(e)
		sendMessage(`圣遗物评分出错。`);
		return;
	}
	if (400 === response.status) {
		if (lodash.hasIn(ret, "code") && 50003 === ret.code) {
			sendMessage("您上传了正确的截图，但是 AI 未能识别，请重新截图。");
		} else {
			sendMessage(`圣遗物评分出错。`);
		}

		return;
	}

	if (200 === response.status || lodash.hasIn(ret, "total_percent")) {
		data = `您的${prop.pos}（${prop.main_item.name}）评分为 ${ret.total_percent} 分！\n==========`;
		prop.sub_item.forEach((item) => {
		data += `\n${item.name}：${item.value}`;
		});

		sendMessage(data);
		return;
	}

	sendMessage("发生了一个未知错误，请再试一次。");
}