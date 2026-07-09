// Author: Vitaly Spirin

"use strict";

import { ErrorCounter } from './ErrorCounter.mjs';
import ErrorCounterLine from './ErrorCounterLine.mjs';
import StatsFooter from './StatsFooter.mjs';
import Types from './Types.mjs';

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
        this.inputElement = Types.assertType(event.target, HTMLInputElement);

        this.verbTense = this.inputElement.getAttribute('data-verb-tense') ?? '';
        this.errorLineElement = document.getElementById('error-counter-' + this.verbTense);
    }

    static #finalize() {
        const errorCounterObj = ErrorCounter.getErrorCounterObj(this.verbTense);

        ErrorCounterLine.update(
            this.errorLineElement,
            errorCounterObj
        );

        if (this.inputElement.getAttribute('last-input-element') !== null) {
            ErrorCounter.updateTimer();
        }

        if (
            (errorCounterObj.numberOfCompleted + errorCounterObj.numberOfErrors >
                errorCounterObj.numberOfAllInputElements / 2) ||
            (this.inputElement.getAttribute('last-input-element') !== null)
        ) {
            Object.entries(ErrorCounter.errorCounterObjList)
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
     * @param {Event} event
     */
    static onClickEventHandler(event) {
        if (!(event.target instanceof HTMLInputElement)) return;

        const self = InputValidation;
        self.#initialize(event);

        if (ErrorCounter.startTimestamp === null) {
            ErrorCounter.startTimestamp = Date.now();
        }

        if (!event.target.required) {
            ErrorCounter.getErrorCounterObj(self.verbTense).numberOfErrors++;
            event.target.parentElement.classList.add('failed');
        } else {
            ErrorCounter.getErrorCounterObj(self.verbTense).numberOfCompleted++;
        }

        document.getElementsByName(event.target.name).forEach((element) => {
            element.removeEventListener('click', InputValidation.onClickEventHandler);
        });

        self.#finalize();
    }

    /**
     * @param {Event} event
     */
    static focusEventHandler(event) {
        ErrorCounter.startTimestamp = Date.now();
    }

    /**
     * @param {Event} event
     */
    static focusOutEventHandler(event) {
        if (!(event.target instanceof HTMLInputElement)) return;

        const self = InputValidation;
        self.#initialize(event);

        const errorCounterObj = ErrorCounter.getErrorCounterObj(self.verbTense);
        if (event.target.type === 'text') {
            if (!event.target.checkValidity()) {
                errorCounterObj.numberOfErrors++;
                event.target.classList.add('failed');
                event.target.removeEventListener("focusout", InputValidation.focusOutEventHandler);
            } else if (event.target.value != '') {
                errorCounterObj.numberOfCompleted++;
                event.target.removeEventListener("focusout", InputValidation.focusOutEventHandler);
            }
        } else {
            // for radio button validity is checked in onClickEventHandler
            document.getElementsByName(event.target.name).forEach((element) => {
                element.removeEventListener('focusout', InputValidation.focusOutEventHandler);
            });
        }

        const timeDiff = Date.now() - ErrorCounter.startTimestamp;
        errorCounterObj.duration += timeDiff;

        // to catch a bug when duration becomes huge
        if (timeDiff > 1000 * 60 * 60) {
            alert('time difference between "focus in" and "focus out" is ' + timeDiff + '. That is more than an hour.');
        }

        self.#finalize();
    }

}
