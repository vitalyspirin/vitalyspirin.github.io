// Author: Vitaly Spirin

"use strict";

import { ErrorCounter } from './ErrorCounter.mjs';
import ErrorCounterObj from './ErrorCounterObj.mjs';
import ErrorCounterLine from './ErrorCounterLine.mjs';
import StatsFooter from './StatsFooter.mjs';
import HtmlHelper from './HtmlHelper.mjs';
import Timer from './Timer.mjs';

export default class InputValidation {

    /** @type string */
    static verbTense;

    /** @type HTMLElement */
    static errorLineElement;

    /** @type HTMLInputElement */
    static inputElement;

    /**
     * @param {Event} event
     */
    static #initialize(event) {
        this.inputElement = /** @type {HTMLInputElement} */ (event.target);

        this.verbTense = this.inputElement.getAttribute('data-verb-tense') ?? '';
        this.errorLineElement = document.getElementById('error-counter-' + this.verbTense);
    }

    static #finalize() {
        const errorCounterObj = ErrorCounterObj.getErrorCounterObj(this.verbTense);

        ErrorCounterLine.update(
            this.errorLineElement,
            errorCounterObj
        );


        if (HtmlHelper.isLastInputElement(this.inputElement)) {
            ErrorCounter.showTotalTime();
        }

        if (
            (errorCounterObj.numberOfCompleted + errorCounterObj.numberOfErrors >
                errorCounterObj.numberOfAllInputElements / 2) ||
            HtmlHelper.isLastInputElement(this.inputElement)
        ) {
            Object.entries(ErrorCounterObj.errorCounterObjList)
                .forEach(([verbeTense, errorCounterObj]) => {
                    StatsFooter.saveStats(
                        ErrorCounter.id,
                        errorCounterObj,
                        verbeTense
                    );
                });
        }
    }

    /**
     * for radio buttons
     * 
     * @param {Event} event
     */
    static onClickEventHandler(event) {

        const self = InputValidation;
        self.#initialize(event);

        Timer.restartIfNecessary();

        const target = /** @type {HTMLInputElement} */ (event.target);

        if (!target.required) {
            ErrorCounterObj.getErrorCounterObj(self.verbTense).numberOfErrors++;
            target.parentElement.classList.add('failed');
        } else {
            ErrorCounterObj.getErrorCounterObj(self.verbTense).numberOfCompleted++;
        }

        document.getElementsByName(target.name).forEach((element) => {
            element.removeEventListener('click', InputValidation.onClickEventHandler);
        });

        Timer.setDuration(self.verbTense);

        self.#finalize();
    }

    /**
     * @param {Event} event
     */
    static focusEventHandler(event) {
        Timer.restartIfNecessary();
    }

    /**
     * @param {Event} event
     */
    static focusOutEventHandler(event) {
        const self = InputValidation;
        self.#initialize(event);

        const errorCounterObj = ErrorCounterObj.getErrorCounterObj(self.verbTense);

        const target = /** @type {HTMLInputElement} */ (event.target);

        if (target.type === 'text') {
            if (!target.checkValidity()) {
                errorCounterObj.numberOfErrors++;
                target.classList.add('failed');
                target.removeEventListener("focusout", InputValidation.focusOutEventHandler);
            } else if (target.value != '') {
                errorCounterObj.numberOfCompleted++;
                target.removeEventListener("focusout", InputValidation.focusOutEventHandler);
            }

            Timer.setDuration(self.verbTense);
        } else {
            // for radio button validity is checked in onClickEventHandler
            document.getElementsByName(target.name).forEach((element) => {
                element.removeEventListener('focusout', InputValidation.focusOutEventHandler);
            });
        }

        self.#finalize();
    }
}
