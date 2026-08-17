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
import VerbTenseResolver from './VerbTenseResolver.mjs';


export class ErrorCounter {
    /** @type {number} */
    static id;

    /**
     * @param {string[]} verbTenseList
     */
    static initialize(verbTenseList = ['']) {
        this.id = Date.now();

        this.waitForIframeToLoad(verbTenseList);

        return this;
    }

    /**
     * @param {string[]} verbTenseList
     */
    static waitForIframeToLoad(verbTenseList) {
        if (document.getElementById('error-counter') !== null) {
            // wait till footer iframe is processed
            setTimeout(ErrorCounter.waitForIframeToLoad, 20, verbTenseList);
        } else {
            ErrorCounter.initializeAfterDelay(verbTenseList);
        }
    }


    /**
     * @param {string[]} verbTenseList
     */
    static initializeAfterDelay(verbTenseList) {
        this.#setInfoLink();

        this.#buildErrorCounterLines();

        ErrorCounterObj.init(verbTenseList);

        const allInputElements = /** @type {NodeListOf<HTMLInputElement>} */ (document.
            querySelectorAll(':is(input[type="text"], input[type="radio"])'));

        if (allInputElements.length === 0) {
            StatsFooter.hideStats();
        } else {
            let lastInputElement = null;

            allInputElements.forEach((inputElement) => {
                // verbs-and-prepositions.html can have display:none for some input based on query params
                if (!inputElement.checkVisibility()) return;

                const errorCounterObj = ErrorCounterObj.getErrorCounterObj(inputElement.getAttribute('data-verb-tense'));

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

        const errorLineElementList = /** @type {NodeListOf<HTMLElement>} */
            (document.querySelectorAll('.error-counter-line'));

        errorLineElementList.forEach((errorLineElement) => {
            const verbTense = errorLineElement.id.replace('error-counter-', '');
            if (!verbTenseList.includes(verbTense)) {
                errorLineElement.style.display = 'none';
            } else {
                const errorCounterObj = ErrorCounterObj.getErrorCounterObj(verbTense);
                errorCounterObj.numberOfAllInputElements = Math.round(errorCounterObj.numberOfAllInputElements);

                ErrorCounterLine.initialize(errorLineElement, errorCounterObj.numberOfAllInputElements);
            }
        }); // forEach(errorLineElement

    }

    static #buildErrorCounterLines() {
        const template = /** @type HTMLTemplateElement*/ 
            (document.getElementById('template-error-counter-line'));

        const errorCounterSection = document.getElementById('error-counter-section');
        errorCounterSection.textContent = '';

        const errorCounterLineTemplate = template.content.firstElementChild;
        let newErrorCounterLine = errorCounterLineTemplate.cloneNode(true);
        errorCounterSection.appendChild(newErrorCounterLine);

        Object.entries(VerbTenseResolver.map).forEach(([tenseName, element]) => {
            let newErrorCounterLine = /** @type {HTMLElement} */ (errorCounterLineTemplate.cloneNode(true));

            newErrorCounterLine.id += element.folder;
            const resultatStr = /** @type {HTMLElement} */
                (newErrorCounterLine.getElementsByClassName('resultat-for-which-tense').item(0));
            resultatStr.innerText = ' pour ' + tenseName.toLowerCase();
            errorCounterSection.appendChild(newErrorCounterLine);
        });
    }

    static showTotalTime() {
        let timeDuration = 0;
        let title = '';
        Object.entries(ErrorCounterObj.errorCounterObjList)
            .forEach(([verbeTense, errorCounterObj]) => {
                timeDuration += errorCounterObj.duration;

                if (verbeTense !== '') {
                    title += VerbTenseResolver.getTenseByFolder(verbeTense) + ': ' +
                        String(Utils.timestampToTime(errorCounterObj.duration)) + "\n";
                }
            });

        const totalTimeElement = document.getElementById('total-time');
        totalTimeElement.textContent = String(Utils.timestampToTime(timeDuration));
        totalTimeElement.title = title;
    }

    static #setInfoLink() {
        const page = window.location.pathname.split('/').pop() + window.location.search;
        const infoLink = Resolver.getInfoLinkForPage(page);

        /** @type HTMLAnchorElement? */
        const infoLinkElement = document.querySelector('a.info-icon');

        if (infoLinkElement === null) return;

        infoLinkElement.href = infoLink;
        infoLinkElement.style.visibility = 'visible';

        // to show user that JS executed without any errors
        document.getElementsByTagName('article').item(0).style.opacity = '100%';
    }
}