// Author: Vitaly Spirin

"use strict";

import { ErrorCounter } from './ErrorCounter.mjs';
import ErrorCounterLine from './ErrorCounterLine.mjs';
import StatsFooter from './StatsFooter.mjs';
import Utils from './Utils.mjs';

export class InputValidation {
    static verbTense;
    static errorLineElement;

    static #initialize(event) {
        this.verbTense = event.target.getAttribute('data-verb-tense');
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
