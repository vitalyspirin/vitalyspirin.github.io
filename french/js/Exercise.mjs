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

        ErrorCounter.initialize();
    }
}

