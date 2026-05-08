// Author: Vitaly Spirin

"use strict";

import { ErrorCounterObj } from "./ErrorCounter.mjs";


export default class ErrorCounterLine {

    /**
     * @param {HTMLElement} errorLineElement
     */
    static initialize(errorLineElement) {
        errorLineElement.style.display = 'block';

        errorLineElement.getElementsByClassName('number-of-errors').item(0).textContent = '0';
        errorLineElement.getElementsByClassName('number-correct').item(0).textContent = '0';
        errorLineElement.getElementsByClassName('result').item(0).textContent = '0';
    }

    /**
     * @param {HTMLElement} errorLineElement
     * @param {ErrorCounterObj} errorCounterObj
     */
    static update(errorLineElement, errorCounterObj) {
        errorLineElement.getElementsByClassName('number-of-errors').item(0).textContent =
            String(errorCounterObj.numberOfErrors);

        errorLineElement.getElementsByClassName('number-correct').item(0).textContent =
            String(errorCounterObj.numberOfCompleted);

        errorLineElement.getElementsByClassName('result').item(0).textContent = String(
            Math.round(
                100 *
                errorCounterObj.numberOfCompleted /
                errorCounterObj.numberOfAllInputElements
            )
        );

    }

}