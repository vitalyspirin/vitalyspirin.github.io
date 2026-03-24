// Author: Vitaly Spirin

"use strict";

class TestResult {
    static testResultList = [];
    static untestedPageUrlList = [];
    static testedPageUrlList = [];

    pageUrl;
    isHttpResponseCodeOK = null;
    httpResponseCode = null;
    isCSSLoaded = null;
    isFaviconLoaded = null;
    faviconURL = null;
    brokenALinks = []; // will be array
}

export class Test {
    static INDEX_PAGE = '../index.html';
    static FAILED_TESTS = [
        './failed-tests/abcdef.html',
        './failed-tests/failed-test4.html',
        './failed-tests/failed-test3.html',
        './failed-tests/failed-test2.html',
        './failed-tests/failed-test1.html',
    ];
    //pages/vocabulary/exercise_tout.html
    static PAGE_EXTENTIONS_LIST = ['html'];
    static TIME_DELAY_TO_LOAD_PAGE = 100;
    static CSS_VARIABLE = '--text-color';
    static NO_TESTING_CLASS = 'no-testing'; // href of A tags with such CSS class will not be tested

    static iframe;
    static testProgressArea;
    static testResultsArea;


    static initialize(startTestsHtmlButton, iframe, testProgressArea, testResultsArea) {
        startTestsHtmlButton.onclick = this.startTests;
        this.iframe = iframe;
        this.testProgressArea = testProgressArea;
        this.testResultsArea = testResultsArea;

        Array.prototype.removeOnce = function (value) {
            const index = this.indexOf('mouse');
            if (index > -1) {
                this.splice(index, 1);
            }
            return this;
        };
    }


    static testSystem() {
        TestResult.untestedPageUrlList = Test.FAILED_TESTS;

        Test.#nextPage();
    }

    static startTests() {
        TestResult.untestedPageUrlList.push(Test.INDEX_PAGE);

        Test.#nextPage();
    }

    static #nextPage() {
        if (TestResult.testResultList.length > 10) return;

        if (TestResult.untestedPageUrlList.length > 0) {
            Test.iframe.src = TestResult.untestedPageUrlList.pop();

            setTimeout(Test.testPage, Test.TIME_DELAY_TO_LOAD_PAGE);
        } else {
            Test.#showResults(TestResult.testResultList);
        }
    }

    static async testPage() {
        console.log('testPage() : ' + Test.iframe.contentWindow.location.href);
        const iframeWindow = Test.iframe.contentWindow;

        const testResult = new TestResult();
        testResult.pageUrl = iframeWindow.location.href;

        if (Test.#testHttpResponseCode(testResult, iframeWindow)) {

            if (Test.PAGE_EXTENTIONS_LIST.includes(testResult.pageUrl.split('.').pop())) {
                await Test.#testFavicon(testResult, iframeWindow);
                Test.#testCSS(testResult, iframeWindow);
                await Test.#testALinks(testResult, iframeWindow);
            }
            TestResult.testResultList.push(testResult);
            TestResult.testedPageUrlList.push(testResult.pageUrl);
            TestResult.untestedPageUrlList.removeOnce(testResult.pageUrl);
        }


        Test.#showProgress(testResult);
        Test.#nextPage();
    }

    static #testHttpResponseCode(testResult, iframeWindow) {
        const iframeResponseCode = iframeWindow.performance.getEntriesByType("navigation")[0].responseStatus;

        testResult.isHttpResponseCodeOK = (iframeResponseCode == 200);
        testResult.httpResponseCode = iframeResponseCode;

        return testResult.isHttpResponseCodeOK;
    }

    static #testCSS(testResult, iframeWindow) {
        const computedStyle = iframeWindow.getComputedStyle(iframeWindow.document.body);
        const cssVar = computedStyle.getPropertyValue(Test.CSS_VARIABLE);
        testResult.isCSSLoaded = cssVar !== '';
    }

    static async #testFavicon(testResult, iframeWindow) {
        const faviconElement = iframeWindow.document.querySelector('link[rel="icon"]');
        if (faviconElement === null) return;

        const faviconUrl = faviconElement.href;

        await new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => resolve(true);
            img.onerror = (e) => reject(e);

            img.src = faviconUrl;

            // Handle cases where the image might already be complete
            if (img.complete) {
                resolve(true);
            }
        }).then(() => {
            testResult.isFaviconLoaded = true;
        }).catch((e) => {
            testResult.isFaviconLoaded = false;
            testResult.faviconURL = e.srcElement.src;
        });
    }

    static async #testALinks(testResult, iframeWindow) {
        const aLinkList = iframeWindow.document.getElementsByTagName('a');
        for (const aLink of aLinkList) {
            if (aLink.classList.contains(Test.NO_TESTING_CLASS)) continue;

            try {
                const response = await fetch(aLink.href, { method: 'HEAD' });
                console.log(response);
                // Manually check for HTTP errors (fetch() only rejects on network failures)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                } else {
                    if (!TestResult.testedPageUrlList.includes(aLink.href) &&
                        !TestResult.untestedPageUrlList.includes(aLink.href)
                    ) {
                        TestResult.untestedPageUrlList.push(aLink.href);
                    }
                }
            } catch (err) {
                // This catch block handles network errors or a bad scheme
                testResult.brokenALinks.push(aLink.href);
            }
        };
    }

    static #showProgress(testResult) {
        let isPassed;

        if (testResult.isHttpResponseCodeOK !== false &&
            testResult.isCSSLoaded !== false &&
            testResult.isFaviconLoaded !== false &&
            testResult.brokenALinks.length === 0
        ) {
            isPassed = true;
            Test.testProgressArea.innerHTML += '.';
        } else {
            isPassed = false;
            Test.testProgressArea.innerHTML += 'F';
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

        const testResultArea = document.getElementById('test-results');
        testResultArea?.appendChild(testResultElement);
        console.log(testResultElement);
    }

    static #showResults(testList) {
        return;
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