// Author: Vitaly Spirin

"use strict";

import Storage from './Storage.mjs';
import Utils from './Utils.mjs';

export class System {

    static initialize(textAreaHtmlElement, AButtonHtmlElement) {
        const statsObj = this.buildObjectWithStatsData();
        const jsonStr = JSON.stringify(statsObj, null, 2);

        textAreaHtmlElement.value = jsonStr;

        const blob = new Blob([jsonStr], { type: "application/json" });
        AButtonHtmlElement.href = URL.createObjectURL(blob);

        const dateTimeStr = Utils.timestampToDateAndTimeSystemFormat(Date.now());
        AButtonHtmlElement.download = AButtonHtmlElement.download.replace(/(.*)\.(.*)/, "$1_" + dateTimeStr + ".$2");
    }

    static buildObjectWithStatsData() {
        const obj = {};

        Storage.getStatsKeyList().forEach((statsKey) => {
            obj[statsKey] = Storage.getStatsDataForKey(statsKey);
        });

        return obj;
    }

}
