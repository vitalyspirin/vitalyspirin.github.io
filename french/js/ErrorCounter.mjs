// Author: Vitaly Spirin

"use strict";

export class ErrorCounter {
    static initialize() {
        const inputElementList = document.getElementsByTagName('input');

        for (const inputElement of inputElementList) {
            inputElement.addEventListener("focusout", this.focusOutEventHandler);
        }
    }

    static focusOutEventHandler(event) {
        if (!(event.target instanceof HTMLInputElement)) return;

        if (!event.target.checkValidity()) {
            const errorCounterElement = document.getElementById('number-of-errors');
            let errorCounter = Number(errorCounterElement.innerText);
            errorCounter++;
            errorCounterElement.textContent = String(errorCounter);

            event.target.removeEventListener("focusout", ErrorCounter.focusOutEventHandler);
        }

    }

}