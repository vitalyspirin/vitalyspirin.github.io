// Author: Vitaly Spirin

"use strict";


export default class Storage {
    static ConfigKey = 'CONFIG';

    static getStatsKeyList() {
        const pagesKeys = Object.keys(localStorage)
            .filter( element => element != this.ConfigKey);

        return pagesKeys;
    }

    static getStatsDataForKey(statsKey) {
        return localStorage.getItem(statsKey);
    }

    static saveStatsDataForKey(statsKey, value) {
        localStorage.setItem(statsKey, value);
    }

    static saveConfigForKey(key, subkey, value) {
        let config = JSON.parse(localStorage.getItem(this.ConfigKey));

        if (config == null) config = {};

        if (!Object.hasOwn(config, key)) config[key] = {};

        config[key][subkey] = value;

        localStorage.setItem(this.ConfigKey, JSON.stringify(config));
    }

    static getConfigDataForKey(key, subkey) {
        let result;

        let config = JSON.parse(localStorage.getItem(this.ConfigKey));

        if (config == null) {
            result = null;
        } else if (!Object.hasOwn(config, key)) {
            result = null;
        } else if (!Object.hasOwn(config[key], subkey)) {
            result = null;
        } else {
            result = config[key][subkey];
        }

        return result;
    }
}
