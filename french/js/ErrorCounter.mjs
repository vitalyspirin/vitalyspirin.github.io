// Author: Vitaly Spirin

"use strict";

import ErrorCounterLine from './ErrorCounterLine.mjs';
import ErrorCounterObj from './ErrorCounterObj.mjs';
import HtmlHelper from './HtmlHelper.mjs';
import InputValidation from './InputValidation.mjs';
import { Resolver } from './Resolver.mjs';
import StatsFooter from './StatsFooter.mjs';
import Types from './Types.mjs';
import Utils from './Utils.mjs';


export class ErrorCounter {
    /** @type {number} */
    static id;

    /** @type Record<string, ErrorCounterObj> */
    static errorCounterObjList;

    /** @type {number?} */
    static startTimestamp = null;

    /** @type {boolean} */
    static isOneTimerOnly = false;

    /**
     * @param {string[]} verbTenseList
     */
    static initialize(verbTenseList = ['']) {
        this.waitForIframeToLoad(verbTenseList);

        return this;
    }

    static useOneTimerOnly() {
        this.isOneTimerOnly = true;
    }

    /**
     * @param {string[]} verbTenseList
     * @param {ErrorCounter} self
     */
    static waitForIframeToLoad(verbTenseList, self = this) {
        if (document.getElementById('error-counter') !== null) {
            // wait till footer iframe is processed
            setTimeout(ErrorCounter.waitForIframeToLoad, 20, verbTenseList, self);
        } else {
            ErrorCounter.initializeAfterDelay(verbTenseList, self);
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


        self.errorCounterObjList = {};

        verbTenseList.forEach(verbTense => {
            self.errorCounterObjList[verbTense] = new ErrorCounterObj();
        });


        const allInputElements = document.
            querySelectorAll(':is(input[type="text"], input[type="radio"])');

        if (allInputElements.length === 0) {
            StatsFooter.hideStats();
        } else {
            let lastInputElement = null;

            allInputElements.forEach((inputElement) => {
                if (!(inputElement instanceof HTMLInputElement)) return;

                // verbs-and-prepositions.html can have display:none for some input based on query params
                if (!inputElement.checkVisibility()) return;

                const errorCounterObj = self.getErrorCounterObj(inputElement.getAttribute('data-verb-tense'));

                if (inputElement.type == 'text') {
                    inputElement.addEventListener("focus", InputValidation.focusEventHandler);
                    inputElement.addEventListener("focusout", InputValidation.focusOutEventHandler);

                    errorCounterObj.numberOfAllInputElements++;
                }

                if (inputElement.type == 'radio') {
                    inputElement.addEventListener("click", InputValidation.onClickEventHandler);
                    inputElement.addEventListener("focusout", InputValidation.focusOutEventHandler);

                    if (inputElement.getAttribute('data-type') === 'two-choices') {
                        errorCounterObj.numberOfAllInputElements += 1 / 2;
                    } else if (inputElement.getAttribute('data-type') === 'three-choices') {
                        errorCounterObj.numberOfAllInputElements += 1 / 3;
                    } else {
                        console.error('Input element of "radio" type must have attribute ' +
                            '"data-type" with values "two-choices" or "three-choices"');
                    }
                }

                lastInputElement = inputElement;
            }); // allInputElements.forEach

            HtmlHelper.markLastInputElement(lastInputElement);

            if (verbTenseList.length === 0) {
                StatsFooter.showStats();
            } else if (verbTenseList.length === 1) {
                StatsFooter.showStats(verbTenseList[0]);
            } else {
                StatsFooter.hideStats(); // several tenses shown
            }
        } // if (allInputElements.length === 0) else 

        document.querySelectorAll('.error-counter-line').forEach(errorLineElement => {
            if (!(errorLineElement instanceof HTMLElement)) return;

            const verbTense = errorLineElement.id.replace('error-counter-', '');
            if (!verbTenseList.includes(verbTense)) {
                errorLineElement.style.display = 'none';
            } else {
                const errorCounterObj = self.getErrorCounterObj(verbTense);

                ErrorCounterLine.initialize(errorLineElement, errorCounterObj.numberOfAllInputElements);
            }
        }); // forEach(errorLineElement

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
        errorCounterSection.textContent = '';

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

    static updateTimer() {
        let timeDuration = 0;
        let title = '';
        Object.entries(this.errorCounterObjList).forEach(([verbeTense, errorCounterObj]) => {
            timeDuration += errorCounterObj.duration;

            if (verbeTense !== '') {
                title += Resolver.getTenseByFolder(verbeTense) + ': ' +
                    String(Utils.timestampToTime(errorCounterObj.duration)) + "\n";
            }
        });

        const totalTimeElement = document.getElementById('total-time');
        totalTimeElement.textContent = String(Utils.timestampToTime(timeDuration));
        totalTimeElement.title = title;
    }

    /**
     * @param {string?} verbTense
     * @return ErrorCounterObj
     */
    static getErrorCounterObj(verbTense) {
        return ErrorCounter.errorCounterObjList[verbTense ?? ''];
    }

    static #setInfoLink() {
        const page = window.location.pathname.split('/').pop() + window.location.search;
        const infoLink = Resolver.getInfoLinkForPage(page);

        /** @type HTMLAnchorElement? */
        const infoLinkElement = document.querySelector('a.info-icon');

        if (infoLinkElement === null) return;

        infoLinkElement.href = infoLink;
        infoLinkElement.style.visibility = 'visible';
    }
}