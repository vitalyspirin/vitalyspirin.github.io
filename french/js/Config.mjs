// Author: Vitaly Spirin

"use strict";

export class Config {
    static #storageKey = 'CONFIG';

    static save(key, subkey, value) {
        let config = JSON.parse(localStorage.getItem(this.#storageKey));

        if (config == null) config = {};

        if (!Object.hasOwn(config, key)) config[key] = {};

        config[key][subkey] = value;

        localStorage.setItem(this.#storageKey, JSON.stringify(config));
    }

    static retrieve(key, subkey) {
        let result;

        let config = JSON.parse(localStorage.getItem(this.#storageKey));

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
