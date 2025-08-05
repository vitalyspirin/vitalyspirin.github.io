// Author: Vitaly Spirin

"use strict";

import { ErrorCounterLine } from './ErrorCounterLine.mjs';
import { Resolver } from './Resolver.mjs';
import { Utils } from './Utils.mjs';

class ErrorCounterObj {
    numberOfErrors = 0;
    numberOfCompleted = 0;
    numberOfAllInputElements = 0;
    duration;
}

export class ErrorCounter {
    static id;
    static errorCounter;
    static startTimestamp;

    static initialize(verbTenseList = [], self = this) {
        if (document.getElementsByTagName('iframe').length != 0) {
            // wait till footer iframe is processed
            setTimeout(self.initialize, 20, verbTenseList, self);
        } else {
            self.initializeAfterDelay(verbTenseList, self);
        }
    }

    static initializeAfterDelay(verbTenseList, self) {
        self.id = Date.now();

        const allInputElements = document.querySelectorAll('input[type="text"]');
        self.initializeTimer(allInputElements);

        allInputElements.forEach((inputElement) => {
            inputElement.addEventListener("focusout", self.focusOutEventHandler);
        });

        if (verbTenseList.length === 0) {
            document.getElementById('error-counter-').style.display = 'block';

            self.errorCounter = new ErrorCounterObj();
            self.errorCounter.numberOfAllInputElements =
                document.querySelectorAll('input[type="text"]').length;

            self.showStats();
        } else {
            self.errorCounter = {};

            document.querySelectorAll('.error-counter-line').forEach(errorLineElement => {
                if (!(errorLineElement instanceof HTMLElement)) return;

                const verbTense = errorLineElement.id.replace('error-counter-', '');
                if (!verbTenseList.includes(verbTense)) {
                    errorLineElement.style.display = 'none';
                } else {
                    ErrorCounterLine.initialize(errorLineElement);

                    self.errorCounter[verbTense] = new ErrorCounterObj();
                    const cssSelector = 'input[type="text"][data-verb-tense="' + verbTense + '"]';
                    self.errorCounter[verbTense].numberOfAllInputElements =
                        document.querySelectorAll(cssSelector).length;
                }
            });
        }
    }

    static initializeTimer(allInputElements) {
        const firstInputElement = allInputElements.item(0);
        firstInputElement.addEventListener("focusout", (e) => {
            if (ErrorCounter.startTimestamp == null) {
                ErrorCounter.startTimestamp = Date.now();
            }
        });

        const lastInputElement = allInputElements.item(allInputElements.length - 1);
        lastInputElement.addEventListener("focusout", (event) => {
            if (ErrorCounter.startTimestamp != null) {
                const timeDuration = Date.now() - ErrorCounter.startTimestamp;

                document.getElementById('total-time').textContent = String(
                    Utils.timestampToTime(timeDuration)
                );

                const verbTense = event.target.getAttribute('data-verb-tense');
                ErrorCounter.getErrorCounter(verbTense).duration = timeDuration;
                ErrorCounter.saveStats(ErrorCounter.getErrorCounter(verbTense), verbTense);
            }
        });
    }

    static focusOutEventHandler(event) {
        if (!(event.target instanceof HTMLInputElement)) return;

        const verbTense = event.target.getAttribute('data-verb-tense');
        const errorLineElement = document.getElementById('error-counter-' + (verbTense ?? ''));

        if (!event.target.checkValidity()) {
            ErrorCounter.getErrorCounter(verbTense).numberOfErrors++;
            event.target.classList.add('failed');
            event.target.removeEventListener("focusout", ErrorCounter.focusOutEventHandler);
        } else if (event.target.value != '') {
            ErrorCounter.getErrorCounter(verbTense).numberOfCompleted++;
            event.target.removeEventListener("focusout", ErrorCounter.focusOutEventHandler);
        }

        ErrorCounterLine.update(errorLineElement, ErrorCounter.getErrorCounter(verbTense));

        if (ErrorCounter.getErrorCounter(verbTense).numberOfCompleted +
            ErrorCounter.getErrorCounter(verbTense).numberOfErrors >
            ErrorCounter.getErrorCounter(verbTense).numberOfAllInputElements / 2
        ) {
            ErrorCounter.saveStats(ErrorCounter.getErrorCounter(verbTense), verbTense);
        }
    }

    static getErrorCounter(verbTense) {
        let resultat;

        if (verbTense === null) {
            resultat = ErrorCounter.errorCounter;
        } else {
            resultat = ErrorCounter.errorCounter[verbTense];
        }

        return resultat;
    }

    /**
     * @param {ErrorCounterObj} errorCounter
     * @param {boolean} verbTense
     */
    static saveStats(errorCounter, verbTense) {
        let stats = this.retrieveStats(verbTense);

        stats[this.id] = {
            'timestamp': Date.now(),
            'result': errorCounter.numberOfCompleted /
                errorCounter.numberOfAllInputElements,
            'errors': errorCounter.numberOfErrors,
            'duration': errorCounter.duration
        };
        localStorage.setItem(this.getStorageKey(verbTense), JSON.stringify(stats));

    }

    static retrieveStats(verbTense) {
        let stats;

        const storageValue = localStorage.getItem(this.getStorageKey(verbTense));
        if (storageValue == null) {
            stats = {};
        } else {
            stats = JSON.parse(storageValue);
        }

        return stats;
    }

    static showStats() {
        const template = document.getElementById('template-stats-line')

        if (!(template instanceof HTMLTemplateElement)) {
            console.error('HTML element with id "template-stats-line" has not been found.');
            return;
        }
        const statsLineElement = template.content.firstElementChild;

        const stats = ErrorCounter.retrieveStats(null);
        const keys = Object.keys(stats).reverse();

        keys.forEach((key) => {
            let newStateLineElement = statsLineElement.cloneNode();

            let formattedDate = Utils.timestampToDateAndTime(Number(stats[key]['timestamp']));
            const result = Math.round(100 * Number(stats[key]['result']));
            newStateLineElement.textContent = formattedDate + ' - ' + result +
                '% (' + stats[key]['errors'] + ' erreurs)';

            document.getElementById('stats').appendChild(newStateLineElement);
        });
    }

    static getStorageKey(verbTense) {
        let storageKey;

        if (verbTense === null) {
            storageKey = window.location.pathname.split('/').pop() + window.location.search;
        } else {
            storageKey = 'conjugations.html?' + Resolver.getURLEncodedTenseByFolder(verbTense);
        }

        return storageKey;
    }
}