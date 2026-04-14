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
            testResult.isCssLoaded !== false &&
            testResult.isFaviconLoaded !== false &&
            testResult.brokenALinks.length === 0 &&
            testResult.isXmlValid !== false &&
            testResult.isHtmlValid !== false &&
            testResult.isJsValid !== false
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
        if (testResult.isCssLoaded === false) {
            const brokenCssLinksElement = testResultElement.getElementsByClassName('css').item(0);
            brokenCssLinksElement.classList.add('failed');
            this.#showErrorList(brokenCssLinksElement.firstElementChild, testResult.brokenCssLinks);
        }
        if (testResult.isFaviconLoaded === false) {
            const faviconElement = testResultElement.getElementsByClassName('favicon').item(0);
            faviconElement.classList.add('failed');
            faviconElement.textContent += testResult.faviconUrl;
        }
        if (testResult.brokenALinks.length !== 0) {
            const brokenLinksElement = testResultElement.getElementsByClassName('broken-links').item(0);
            brokenLinksElement.classList.add('failed');
            this.#showErrorList(brokenLinksElement.firstElementChild, testResult.brokenALinks);
        }

        if (testResult.isXmlValid === false) {
            const xmlElement = testResultElement.getElementsByClassName('xml').item(0);
            xmlElement.classList.add('failed');
            xmlElement.textContent += testResult.xmlErrorMessage;
        }

        if (testResult.isHtmlValid === false) {
            const htmlElement = testResultElement.getElementsByClassName('html').item(0);
            htmlElement.classList.add('failed');
            this.#showErrorList(htmlElement.firstElementChild, testResult.htmlErrorMessageList);
        }

        if (testResult.isJsValid === false) {
            const jsElement = testResultElement.getElementsByClassName('js').item(0);
            jsElement.classList.add('failed');
        }

        this.#testResultsArea?.appendChild(testResultElement);
    }

    /** 
     * @param {HTMLOListElement} olElement 
     * @param {string[]} errorList 
     */
    #showErrorList(olElement, errorList) {
        errorList.forEach((error) => {
            /** @type HTMLLIElement */
            const liElement = document.createElement('li');
            liElement.textContent = error;
            olElement.appendChild(liElement);
        })
    }
}