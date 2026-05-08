// Author: Vitaly Spirin

"use strict";


export default class Storage {
    static CONFIG_KEY = 'CONFIG';
    static STATS_KEY = 'STATS';

    static getStatsKeyList() {
        const data = JSON.parse(localStorage.getItem(this.STATS_KEY)) ?? [];

        const pagesKeys = Object.keys(data);

        return pagesKeys;
    }

    /**
     * @param {string} key
     * @returns {string?}
     */
    static getStatsDataForKey(key) {
        let result;

        let data = JSON.parse(localStorage.getItem(this.STATS_KEY));

        if (data == null) {
            result = null;
        } else if (!Object.hasOwn(data, key)) {
            result = null;
        } else {
            result = data[key];
        }

        return result;
    }

    /**
     * @param {string} key
     * @param {string} value
     */
    static saveStatsDataForKey(key, value) {
        let data = JSON.parse(localStorage.getItem(this.STATS_KEY));

        if (data == null) data = {};

        data[key] = value;

        localStorage.setItem(this.STATS_KEY, JSON.stringify(data));

    }

    /**
     * @param {string} value
     */
    static replaceStatsData(value) {
        localStorage.setItem(this.STATS_KEY, value);
    }

    /**
     * @param {string} key
     * @param {string} subkey
     * @param {string} value
     */
    static saveConfigForKey(key, subkey, value) {
        let config = JSON.parse(localStorage.getItem(this.CONFIG_KEY));

        if (config == null) config = {};

        if (!Object.hasOwn(config, key)) config[key] = {};

        config[key][subkey] = value;

        localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
    }

    /**
     * @param {string} key
     * @param {string} subkey
     */
    static getConfigDataForKey(key, subkey) {
        let result;

        let config = JSON.parse(localStorage.getItem(this.CONFIG_KEY));

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
