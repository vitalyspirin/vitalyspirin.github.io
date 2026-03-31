// Author: Vitaly Spirin

"use strict";

export default class View {
    iframe;
    #testProgressArea;
    #testResultsArea;

    constructor(
        iframe,
        testProgressArea,
        testResultsArea
    ) {
        this.iframe = iframe;
        this.#testProgressArea = testProgressArea;
        this.#testResultsArea = testResultsArea;
    }

    clear() {
        this.#testResultsArea.innerHTML = '';
        this.#testProgressArea.innerHTML = '';
    }

    showProgress(testResult) {
        let isPassed;

        if (testResult.isHttpResponseCodeOK !== false &&
            testResult.isCSSLoaded !== false &&
            testResult.isFaviconLoaded !== false &&
            testResult.brokenALinks.length === 0 &&
            testResult.isDomValid !== false
        ) {
            isPassed = true;
            this.#testProgressArea.innerHTML += '.';
        } else {
            isPassed = false;
            this.#testProgressArea.innerHTML += 'F';
        }

        const testResultElement = document.getElementById('test-result-template')
            ?.cloneNode(true).content.firstElementChild;
        testResultElement.getElementsByClassName('page-url').item(0).textContent = testResult.pageUrl;

        if (isPassed) {
            testResultElement.classList.add('passed-test');
        } else {
            testResultElement.classList.add('failed-test');
        }

        if (testResult.isHttpResponseCodeOK === false) {
            const httpResponseCodeElement = testResultElement.getElementsByClassName('http-response-code').item(0);
            httpResponseCodeElement.classList.add('failed');
            httpResponseCodeElement.innerHTML += testResult.httpResponseCode;
        }
        if (testResult.isCSSLoaded === false) {
            testResultElement.getElementsByClassName('css').item(0).classList.add('failed');
        }
        if (testResult.isFaviconLoaded === false) {
            const faviconElement = testResultElement.getElementsByClassName('favicon').item(0);
            faviconElement.classList.add('failed');
            faviconElement.innerHTML += testResult.faviconURL;
        }
        if (testResult.brokenALinks.length !== 0) {
            const brokenLinksElement = testResultElement.getElementsByClassName('broken-links').item(0);
            brokenLinksElement.classList.add('failed');
            brokenLinksElement.innerHTML += testResult.brokenALinks;
        }

        if (testResult.isDomValid === false) {
            const domElement = testResultElement.getElementsByClassName('dom').item(0);
            domElement.classList.add('failed');
            domElement.innerHTML += testResult.DomErrorMessage;
        }

        this.#testResultsArea?.appendChild(testResultElement);
    }


}