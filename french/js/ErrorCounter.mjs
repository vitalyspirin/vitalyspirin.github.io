// Author: Vitaly Spirin

"use strict";

import ErrorCounterLine from './ErrorCounterLine.mjs';
import { InputValidation } from './InputValidation.mjs';
import { Resolver } from './Resolver.mjs';
import StatsFooter from './StatsFooter.mjs';
import Utils from './Utils.mjs';

export class ErrorCounterObj {
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

        this.#setInfoLink();

        this.#buildErrorCounterLines();

        if (verbTenseList.length === 0) {
            Utils.getElementById('error-counter-').style.display = 'block';

            self.errorCounter = new ErrorCounterObj();
            self.errorCounter.numberOfAllInputElements =
                document.querySelectorAll('input[type="text"]').length;

            // page for present subjunctive text exercise also has radio buttons
            self.errorCounter.numberOfAllInputElements +=
                document.querySelectorAll('input[type="radio"]').length / 2;
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

        const allInputElements = document.
            querySelectorAll(':is(input[type="text"], input[type="radio"])');

        if (allInputElements.length === 0) {
            self.hideStats();
        } else {
            self.initializeTimer(allInputElements);

            allInputElements.forEach((inputElement) => {
                if (!(inputElement instanceof HTMLInputElement)) return;

                if (inputElement.type == 'text') {
                    inputElement.addEventListener("focusout", InputValidation.focusOutEventHandler);
                }

                if (inputElement.type == 'radio') {
                    inputElement.addEventListener("click", InputValidation.onClickEventHandler);
                }
            });


            if (verbTenseList.length === 0) {
                StatsFooter.showStats();
            } else if (verbTenseList.length === 1) {
                StatsFooter.showStats(verbTenseList[0]);
            } else {
                StatsFooter.hideStats(); // several tenses shown
            }
        }
    }

    static initializeTimer(allInputElements) {
        const firstInputElement = allInputElements.item(0);

        if (firstInputElement === null) {
            return; // probably no tense is chosen on mixed conjugation page
        }

        firstInputElement.addEventListener("focusout", (e) => {
            if (ErrorCounter.startTimestamp == null) {
                ErrorCounter.startTimestamp = Date.now();
            }
        });

        const lastInputElement = allInputElements.item(allInputElements.length - 1);
        if (lastInputElement.type == 'text') {
            lastInputElement.addEventListener("focusout", (event) => {
                this.#updateTimer(event);
            });
        } else { // radio button
            // two radio button with the same name (with correct and with wrong answer)
            document.getElementsByName(lastInputElement.name).forEach((element) => {
                element.addEventListener('click', (event) => {
                    this.#updateTimer(event);
                });
            });
        }
    }

    static #buildErrorCounterLines() {
        const template = document.getElementById('template-error-counter-line')

        if (!(template instanceof HTMLTemplateElement)) {
            console.error('HTML element with id "template-error-counter-line" has not been found.');
            return;
        }

        const errorCounterSection = document.getElementById('error-counter-section');

        const errorCounterLineTemplate = template.content.firstElementChild;
        let newErrorCounterLine = errorCounterLineTemplate.cloneNode(true);
        errorCounterSection.appendChild(newErrorCounterLine);

        Object.entries(Resolver.map).forEach(([tenseName, element]) => {
            let newErrorCounterLine = errorCounterLineTemplate.cloneNode(true);
            newErrorCounterLine.id += element.folder;
            const resultatStr = newErrorCounterLine.getElementsByClassName('resultat-for-which-tense').item(0);
            resultatStr.innerText = ' pour ' + tenseName.toLowerCase();
            errorCounterSection.appendChild(newErrorCounterLine);
        });
    }

    static #updateTimer(event) {
        if (ErrorCounter.startTimestamp != null) {
            const timeDuration = Date.now() - ErrorCounter.startTimestamp;

            document.getElementById('total-time').textContent = String(
                Utils.timestampToTime(timeDuration)
            );

            const verbTense = event.target.getAttribute('data-verb-tense');
            ErrorCounter.getErrorCounter(verbTense).duration = timeDuration;
            StatsFooter.saveStats(this.id, ErrorCounter.getErrorCounter(verbTense), verbTense);
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

    static #setInfoLink() {
        let infoLink = '#';

        const page = window.location.pathname.split('/').pop() + window.location.search;
        if (!Object.hasOwn(Resolver.infoForPages, page)) {
            console.error('There is no Info Link for page "' + page + '"');
        } else {
            infoLink = '..\\' + Resolver.infoForPages[page];
        }

        document.querySelector('a.info-icon').href = infoLink;
    }
}