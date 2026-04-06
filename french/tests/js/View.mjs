// Author: Vitaly Spirin

"use strict";

import TestResult from "./TestResult.mjs";

export default class View {
    iframe;
    #testProgressArea;
    #testResultsArea;
    #templateForResultArea;

    /**
     * @param {HTMLIFrameElement} iframe
     * @param {HTMLElement} testProgressArea
     * @param {HTMLElement} testResultsArea
     * @param {HTMLTemplateElement} templateForResultArea
     */
    constructor(
        iframe,
        testProgressArea,
        testResultsArea,
        templateForResultArea
    ) {
        this.iframe = iframe;
        this.#testProgressArea = testProgressArea;
        this.#testResultsArea = testResultsArea;
        this.#templateForResultArea = templateForResultArea;
    }

    clear() {
        this.#testResultsArea.innerHTML = '';
        this.#testProgressArea.innerHTML = '';
    }

    /** @param {TestResult} testResult */
    showProgress(testResult) {
        let isPassed;

        if (testResult.isHttpResponseCodeOK !== false &&
            testResult.isCSSLoaded !== false &&
            testResult.isFaviconLoaded !== false &&
            testResult.brokenALinks.length === 0 &&
            testResult.isXmlValid !== false
        ) {
            isPassed = true;
            this.#testProgressArea.innerHTML += '.';
        } else {
            isPassed = false;
            this.#testProgressArea.innerHTML += 'F';
        }

        // @ts-ignore
        const testResultElement = this.#templateForResultArea?.cloneNode(true).content.firstElementChild;
        testResultElement.getElementsByClassName('page-url').item(0).textContent = testResult.pageUrl;

        if (isPassed) {
            testResultElement.classList.add('passed-test');
        } else {
            testResultElement.classList.add('failed-test');
        }

        if (testResult.isHttpResponseCodeOK === false) {
            const httpResponseCodeElement = testResultElement.getElementsByClassName('http-response-code').item(0);
            httpResponseCodeElement.classList.add('failed');
            httpResponseCodeElement.textContent += testResult.httpResponseCode;
        }
        if (testResult.isCSSLoaded === false) {
            testResultElement.getElementsByClassName('css').item(0).classList.add('failed');
        }
        if (testResult.isFaviconLoaded === false) {
            const faviconElement = testResultElement.getElementsByClassName('favicon').item(0);
            faviconElement.classList.add('failed');
            faviconElement.textContent += testResult.faviconURL;
        }
        if (testResult.brokenALinks.length !== 0) {
            const brokenLinksElement = testResultElement.getElementsByClassName('broken-links').item(0);
            brokenLinksElement.classList.add('failed');
            brokenLinksElement.textContent += testResult.brokenALinks;
        }

        if (testResult.isXmlValid === false) {
            const xmlElement = testResultElement.getElementsByClassName('xml').item(0);
            xmlElement.classList.add('failed');
            xmlElement.textContent += testResult.xmlErrorMessage;
        }

        this.#testResultsArea?.appendChild(testResultElement);
    }


}