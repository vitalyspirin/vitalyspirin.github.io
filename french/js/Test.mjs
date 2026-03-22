// Author: Vitaly Spirin

"use strict";

class TestResult {
    static testList = [];

    pageUrl;
    isHttpResponseCodeOK;
    isCSSLoaded;
    isFaviconLoaded;
    brokenALinks; // will be array
}

export class Test {
    static INDEX_PAGE = '../index.html';
    static TIME_DELAY_TO_LOAD_PAGE = 100;
    static CSS_VARIABLE = '--text-color';

    static iframe;
    static testResultsArea;


    static initialize(startTestsHtmlButton, iframe, testResultsArea) {
        startTestsHtmlButton.onclick = this.startTests;
        this.iframe = iframe;
        this.testResultsArea = testResultsArea;
    }

    static startTests() {
        Test.iframe.src = Test.INDEX_PAGE;

        setTimeout(Test.testPage, Test.TIME_DELAY_TO_LOAD_PAGE);
    }

    static async testPage() {
        const iframeWindow = Test.iframe.contentWindow;

        const testResult = new TestResult();
        testResult.pageUrl = iframeWindow.location.href;

        Test.#testHttpResponseCode(testResult, iframeWindow);
        await Test.#testFavicon(testResult, iframeWindow);
        Test.#testCSS(testResult, iframeWindow);
        await Test.#testALinks(testResult, iframeWindow);

        TestResult.testList.push(testResult);
        Test.#showResults(TestResult.testList);
    }

    static #testHttpResponseCode(testResult, iframeWindow) {
        const iframeResponseCode = iframeWindow.performance.getEntriesByType("navigation")[0].responseStatus;
        testResult.isHTTPResponseCodeOK = iframeResponseCode == 200;
    }

    static #testCSS(testResult, iframeWindow) {
        const computedStyle = iframeWindow.getComputedStyle(iframeWindow.document.body);
        const cssVar = computedStyle.getPropertyValue(Test.CSS_VARIABLE);
        testResult.isCSSLoaded = cssVar !== '';
    }

    static async #testFavicon(testResult, iframeWindow) {
        const faviconUrl = iframeWindow.document.querySelector('link[rel="icon"]').href;

        await new Promise((resolve, reject) => {
            const img = new Image();
            img.src = faviconUrl;

            img.onload = () => resolve(true);
            img.onerror = () => reject(false);

            // Handle cases where the image might already be complete
            if (img.complete) {
                resolve(true);
            }
        }).then(() => {
            testResult.isFaviconLoaded = true;
        }).catch(() => {
            testResult.isFaviconLoaded = false;
        });
    }

    static async #testALinks(testResult, iframeWindow) {
        testResult.brokenALinks = [];

        const aLinkList = iframeWindow.document.getElementsByTagName('a');
        for (const aLink of aLinkList) {
            try {
                const response = await fetch(aLink.href, { method: 'HEAD' });
                // Manually check for HTTP errors (fetch() only rejects on network failures)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (err) {
                // This catch block handles network errors or a bad scheme
                testResult.brokenALinks.push(aLink.href);
            }
        };
    }


    static #showResults(testList) {
        testList.forEach((testResult) => {
            Test.testResultsArea.innerHTML += testResult.pageUrl + ' : ';

            Test.testResultsArea.innerHTML += 'HTTP Response Code - ' +
                (testResult.isHTTPResponseCodeOK ? 'passed' : 'FAILED');

            Test.testResultsArea.innerHTML += ', ';
            Test.testResultsArea.innerHTML += 'loading favicon - ' +
                (testResult.isFaviconLoaded ? 'passed' : 'FAILED');

            Test.testResultsArea.innerHTML += ', ';
            Test.testResultsArea.innerHTML += 'loading CSS - ' +
                (testResult.isCSSLoaded ? 'passed' : 'FAILED');

            if (testResult.brokenALinks !== null) {
                Test.testResultsArea.innerHTML += ', ';
                Test.testResultsArea.innerHTML += 'test for broken A links - ' +
                    (testResult.brokenALinks.length == 0 ? 'passed' : 'FAILED');
            }
        });
    }

}