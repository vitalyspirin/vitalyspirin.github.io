// Author: Vitaly Spirin

"use strict";

import ErrorCounterObj from "./ErrorCounterObj.mjs";
import Types from "./Types.mjs";


export default class ErrorCounterLine {

    /**
     * @param {HTMLElement} errorLineElement
     * @param {number} numberOfAllInputElements
     */
    static initialize(errorLineElement, numberOfAllInputElements) {
        errorLineElement.style.display = 'block';

        errorLineElement.getElementsByClassName('number-of-errors').item(0).textContent = '0';
        errorLineElement.getElementsByClassName('result').item(0).textContent = '0';

        const numberCorrect = Types.assertType(
            errorLineElement.getElementsByClassName('number-correct').item(0),
            HTMLElement
        );
        numberCorrect.textContent = '0';
        numberCorrect.title = 'out of ' + numberOfAllInputElements;
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