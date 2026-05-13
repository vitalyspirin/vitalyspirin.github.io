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
        this.verbTense = Types.assertType(event.target, HTMLElement)
            .getAttribute('data-verb-tense') ?? '';
        this.errorLineElement = document.getElementById('error-counter-' + this.verbTense);
    }

    static #finalize() {
        ErrorCounterLine.update(
            this.errorLineElement,
            ErrorCounter.getErrorCounterObj(this.verbTense)
        );

        if (ErrorCounter.getErrorCounterObj(this.verbTense).numberOfCompleted +
            ErrorCounter.getErrorCounterObj(this.verbTense).numberOfErrors >
            ErrorCounter.getErrorCounterObj(this.verbTense).numberOfAllInputElements / 2
        ) {
            StatsFooter.saveStats(
                ErrorCounter.id,
                ErrorCounter.getErrorCounterObj(this.verbTense),
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
    static focusOutEventHandler(event) {
        if (!(event.target instanceof HTMLInputElement)) return;

        const self = InputValidation;
        self.#initialize(event);

        if (!event.target.checkValidity()) {
            ErrorCounter.getErrorCounterObj(self.verbTense).numberOfErrors++;
            event.target.classList.add('failed');
            event.target.removeEventListener("focusout", InputValidation.focusOutEventHandler);
        } else if (event.target.value != '') {
            ErrorCounter.getErrorCounterObj(self.verbTense).numberOfCompleted++;
            event.target.removeEventListener("focusout", InputValidation.focusOutEventHandler);
        }

        self.#finalize();
    }

}
