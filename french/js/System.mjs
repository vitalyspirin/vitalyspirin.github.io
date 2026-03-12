// Author: Vitaly Spirin

"use strict";

import { Storage } from './Storage.mjs';

export class System {

    static initialize(htmlElement) {
        const statsObj = this.buildObjectWithStatsData();
        const jsonStr = JSON.stringify(statsObj, null, 2);

        htmlElement.value = jsonStr;

        const blob = new Blob([jsonStr], { type: "application/json" });
        document.getElementById('download-stats').href = URL.createObjectURL(blob);
    }

    static buildObjectWithStatsData() {
        const obj = {};

        Storage.getStatsKeyList().forEach((statsKey) => {
            obj[statsKey] = Storage.getStatsDataForKey(statsKey);
        });

        return obj;
    }

}
