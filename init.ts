import { PluginSetting } from "@modules/plugin";
import { OrderConfig } from "@modules/command";


const rating: OrderConfig = {
	type: "order",
	cmdKey: "genshin.art.rating",
	desc: [ "圣遗物评分", "(圣遗物截图)"],
	headers: [ "rating"],
	regexps: [ ".+" ],
	ignoreCase: false,
	main: "achieves/rating",
	detail: "背包中的圣遗物截图评分"
}


export async function init(): Promise<PluginSetting> {
    return { 
        pluginName: "genshin_rating", 
        cfgList: [ rating ] 
    };
}