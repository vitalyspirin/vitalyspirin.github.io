// Author: Vitaly Spirin

"use strict";

import { ErrorCounter } from './ErrorCounter.mjs';
import HtmlHelper from './HtmlHelper.mjs';
import Timer from './Timer.mjs';
import Types from './Types.mjs';

export default class Exercise {
    static RANDOMIZE_CLASS_NAME = 'randomize';

    static init(params = window.location.search) {
        const htmlElement = document.getElementsByTagName('article').item(0);

        const urlParams = new URLSearchParams(params);
        urlParams.forEach((key, value) => {
            htmlElement.classList.add(value);
        });

        this.#setTitle(urlParams);

        this.#randomizeIfNecessary();

        ErrorCounter.initialize();

        return this;
    }

    static useOneTimerOnly() {
        Timer.isOneTimerOnly = true;
    }


    /**
     * @param {URLSearchParams} urlParams
     */
    static #setTitle(urlParams) {
        if (urlParams.has('title')) {
            document.getElementsByTagName('h1').item(0).innerText += ' ' + urlParams.get('title');

            document.getElementsByTagName('title').item(0).innerText += ' ' + urlParams.get('title');
        }
    }

    static #randomizeIfNecessary() {
        const listsToRandomize = document.getElementsByClassName(this.RANDOMIZE_CLASS_NAME);
        Array.from(listsToRandomize).forEach((listBlock) => {
            HtmlHelper.randomizeLiList(Types.assertType(listBlock, HTMLElement));
        });
    }
}

