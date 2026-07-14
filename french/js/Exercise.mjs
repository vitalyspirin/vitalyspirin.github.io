// Author: Vitaly Spirin

"use strict";

import { ErrorCounter } from './ErrorCounter.mjs';

export default class Exercise {

    static init(params = window.location.search) {
        const htmlElement = document.getElementsByTagName('article').item(0);

        const urlParams = new URLSearchParams(params);
        urlParams.forEach((key, value) => {
            htmlElement.classList.add(value);
        });

        this.setTitle(urlParams);

        ErrorCounter.initialize();
    }

    /**
     * @param {URLSearchParams} urlParams
     */
    static setTitle(urlParams) {
        if (urlParams.has('title')) {
            document.getElementsByTagName('h1').item(0).innerText += ' ' + urlParams.get('title');

            document.getElementsByTagName('title').item(0).innerText += ' ' + urlParams.get('title');
        }
    }
}

