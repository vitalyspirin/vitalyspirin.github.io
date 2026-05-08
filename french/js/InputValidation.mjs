// Author: Vitaly Spirin

"use strict";

import { ErrorCounter } from './ErrorCounter.mjs';
import ErrorCounterLine from './ErrorCounterLine.mjs';
import StatsFooter from './StatsFooter.mjs';
import Types from './Types.mjs';

export class InputValidation {

    /** @type string */
    static verbTense;

    /** @type HTMLElement */
    static errorLineElement;

    /**
     * @param {Event} event
     */
    static #initialize(event) {
        this.verbTense = Types.assertType(event.target, HTMLElement).getAttribute('data-verb-tense');
        this.errorLineElement = document.getElementById('error-counter-' + (this.verbTense ?? ''));
    }

    static #finalize() {
        ErrorCounterLine.update(
            this.errorLineElement,
            ErrorCounter.getErrorCounter(this.verbTense)
        );

        if (ErrorCounter.getErrorCounter(this.verbTense).numberOfCompleted +
            ErrorCounter.getErrorCounter(this.verbTense).numberOfErrors >
            ErrorCounter.getErrorCounter(this.verbTense).numberOfAllInputElements / 2
        ) {
            StatsFooter.saveStats(
                ErrorCounter.id,
                ErrorCounter.getErrorCounter(this.verbTense),
                this.verbTense
            );
        }

    }

    /**
     * @param {Event} event
     */
    static onClickEventHandler(event) {
        if (!(event.target instanceof HTMLInputElement)) return;

        const self = InputValidation;
        self.#initialize(event);

        if (!event.target.required) {
            ErrorCounter.getErrorCounter(self.verbTense).numberOfErrors++;
            event.target.parentElement.classList.add('failed');
        } else {
            ErrorCounter.getErrorCounter(self.verbTense).numberOfCompleted++;
        }

        document.getElementsByName(event.target.name).forEach((element) => {
            element.removeEventListener('click', InputValidation.onClickEventHandler);
        });

        self.#finalize();
    }

    /**
     * @param {Event} event
     */
    static focusOutEventHandler(event) {
        if (!(event.target instanceof HTMLInputElement)) return;

        const self = InputValidation;
        self.#initialize(event);

        if (!event.target.checkValidity()) {
            ErrorCounter.getErrorCounter(self.verbTense).numberOfErrors++;
            event.target.classList.add('failed');
            event.target.removeEventListener("focusout", InputValidation.focusOutEventHandler);
        } else if (event.target.value != '') {
            ErrorCounter.getErrorCounter(self.verbTense).numberOfCompleted++;
            event.target.removeEventListener("focusout", InputValidation.focusOutEventHandler);
        }

        self.#finalize();
    }

}
