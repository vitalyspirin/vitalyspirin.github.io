// Author: Vitaly Spirin

"use strict";

import ErrorCounterLine from './ErrorCounterLine.mjs';
import { InputValidation } from './InputValidation.mjs';
import { Resolver } from './Resolver.mjs';
import StatsFooter from './StatsFooter.mjs';
import Types from './Types.mjs';
import Utils from './Utils.mjs';

export class ErrorCounterObj {
    numberOfErrors = 0;
    numberOfCompleted = 0;
    numberOfAllInputElements = 0;
    duration = 0;
}

export class ErrorCounter {
    /** @type {number} */
    static id;

    /** @type ErrorCounterObj|Record<string, ErrorCounterObj> */
    static errorCounter;

    /** @type {number} */
    static startTimestamp;

    /**
     * @param {string[]} verbTenseList
     */
    static initialize(verbTenseList = [], self = this) {
        if (document.getElementById('error-counter') !== null) {
            // wait till footer iframe is processed
            setTimeout(self.initialize, 20, verbTenseList, self);
        } else {
            self.initializeAfterDelay(verbTenseList, self);
        }
    }

    /**
     * @param {string[]} verbTenseList
     * @param {any} self
     */
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
                document.querySelectorAll('input[type="radio"][data-type="three-choices"]').length / 3;

            self.errorCounter.numberOfAllInputElements +=
                document.querySelectorAll('input[type="radio"][data-type="two-choices"]').length / 2;
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
            self.#initializeTimer(allInputElements);

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

    /**
     * @param {HTMLCollection} allInputElements
     */
    static #initializeTimer(allInputElements) {
        const firstInputElement = allInputElements.item(0);

        if (!(firstInputElement instanceof HTMLInputElement)) {
            return; // probably no tense is chosen on mixed conjugation page
        }

        this.#addEventListenerToInputElement(
            'change',
            firstInputElement,
            (/*event*/) => {
                if (ErrorCounter.startTimestamp == null) {
                    ErrorCounter.startTimestamp = Date.now();
                }
            }
        );

        const lastInputElement = Types.assertType(
            allInputElements.item(allInputElements.length - 1), HTMLInputElement);

        this.#addEventListenerToInputElement(
            'change',
            lastInputElement,
            (/** @type Event */ event) => { this.#updateTimer(event); }
        );
    }

    /**
     * @param {string} eventName
     * @param {HTMLInputElement} inputElement
     * @param {function} eventListenerFunction
     */
    static #addEventListenerToInputElement(eventName, inputElement, eventListenerFunction) {
        if (inputElement.type == 'text') {
            inputElement.addEventListener(eventName, (event) => {
                eventListenerFunction(event);
            });
        } else { // radio button
            // two radio button with the same name (with correct and with wrong answer)
            document.getElementsByName(inputElement.name).forEach((element) => {
                element.addEventListener(eventName, (event) => {
                    eventListenerFunction(event);
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
            let newErrorCounterLine = Types.assertType(
                errorCounterLineTemplate.cloneNode(true), HTMLElement);

            newErrorCounterLine.id += element.folder;
            const resultatStr = newErrorCounterLine.getElementsByClassName('resultat-for-which-tense').item(0);
            resultatStr.innerText = ' pour ' + tenseName.toLowerCase();
            errorCounterSection.appendChild(newErrorCounterLine);
        });
    }

    /**
     * @param {Event} event
     */
    static #updateTimer(event) {
        if (ErrorCounter.startTimestamp != null) {
            const timeDuration = Date.now() - ErrorCounter.startTimestamp;

            document.getElementById('total-time').textContent = String(
                Utils.timestampToTime(timeDuration)
            );

            const verbTense = Types.assertType(event.target, HTMLElement)
                .getAttribute('data-verb-tense');
            ErrorCounter.getErrorCounter(verbTense).duration = timeDuration;
            StatsFooter.saveStats(this.id, ErrorCounter.getErrorCounter(verbTense), verbTense);
        }
    }

    /**
     * @param {string?} verbTense
     */
    static getErrorCounter(verbTense) {
        let resultat;

        if (verbTense === null) {
            resultat = ErrorCounter.errorCounter;
        } else {
            // @ts-ignore
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

        /** @type HTMLAnchorElement? */
        const infoLinkElement = document.querySelector('a.info-icon');

        if (infoLinkElement === null) return;

        infoLinkElement.href = infoLink;
        infoLinkElement.style.visibility = 'visible';
    }
}