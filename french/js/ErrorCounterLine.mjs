// Author: Vitaly Spirin

"use strict";


export default class ErrorCounterLine {
    static initialize(errorLineElement) {
        errorLineElement.style.display = 'block';

        errorLineElement.getElementsByClassName('number-of-errors').item(0).textContent = '0';
        errorLineElement.getElementsByClassName('number-correct').item(0).textContent = '0';
        errorLineElement.getElementsByClassName('result').item(0).textContent = '0';
    }

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