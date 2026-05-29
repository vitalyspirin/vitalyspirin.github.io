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
        const titleElement = document.getElementsByTagName('h1').item(0);

        if (urlParams.has('title')) {
            titleElement.innerText += ' ' + urlParams.get('title');
        } else if (urlParams.size > 3) {
            let titleStr = '';

            let i = 0;
            urlParams.forEach((key, value) => {
                console.log(value);
                titleStr += value;
                i++;
                if (i < urlParams.size) {
                    titleStr += ', ';
                }
            });

            titleElement.innerText = titleStr;
        }

    }
}

