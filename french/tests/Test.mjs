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
    isDomValid = null;
    DomErrorMessage = null;
}

export class Test {
    static INDEX_PAGE = '../index.html';
    static FAILED_TESTS = [
        './failed-tests/abcdef.html',
        './failed-tests/passed-test.html',
    ];
    //pages/vocabulary/exercise_tout.html
    static PAGE_EXTENTIONS_LIST = ['html'];
    static TIME_DELAY_TO_LOAD_PAGE = 100;
    static CSS_VARIABLE = '--text-color';
    static NO_TESTING_CLASS = 'no-testing'; // href of A tags with such CSS class will not be tested
    static PROXY = 'https://proxy.corsfix.com/?'; // proxy to fetch external url

    static numberOfPagesInput;
    static iframe;
    static testProgressArea;
    static testResultsArea;


    static initialize(
        startTestsHtmlButton,
        numberOfPagesInput,
        iframe,
        testProgressArea,
        testResultsArea
    ) {
        this.numberOfPagesInput = numberOfPagesInput;
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
        if (Test.numberOfPagesInput.value !== ''
            && TestResult.testResultList.length >= Test.numberOfPagesInput.value) return;

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
                await Test.#testDOM(testResult, iframeWindow);
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
                let url = aLink.href;
                if (window.location.hostname !== (new URL(url)).hostname) {
                    url = Test.#addProxyToExternalUrl(url);
                }

                const response = await fetch(url, { method: 'HEAD' });

                // Manually check for HTTP errors (fetch() only rejects on network failures)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                } else {
                    if (url === aLink.href && // the same domain
                        Test.PAGE_EXTENTIONS_LIST.includes(url.split('.').pop()) &&
                        !TestResult.testedPageUrlList.includes(url) &&
                        !TestResult.untestedPageUrlList.includes(url)
                    ) {
                        TestResult.untestedPageUrlList.push(url);
                    }
                }
            } catch (err) {
                // This catch block handles network errors or a bad scheme
                testResult.brokenALinks.push(aLink.href);
            }
        };
    }

    static async #testDOM(testResult, iframeWindow) {
        const response = await fetch(testResult.pageUrl);
        const documentStr = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(documentStr, 'application/xml');

        // Check for parser errors in the parsed document
        const parseErrorList = doc.getElementsByTagName('parsererror');
        if (parseErrorList.length > 0) {
            testResult.isDomValid = false;
            testResult.DomErrorMessage = parseErrorList.item(0).textContent;
        } else {
            testResult.isDomValid = true;
        }
    }

    static #addProxyToExternalUrl(url) {
        return Test.PROXY + url;
    }

    static #showProgress(testResult) {
        let isPassed;

        if (testResult.isHttpResponseCodeOK !== false &&
            testResult.isCSSLoaded !== false &&
            testResult.isFaviconLoaded !== false &&
            testResult.brokenALinks.length === 0 &&
            testResult.isDomValid !== false
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

        if (testResult.isDomValid === false) {
            const domElement = testResultElement.getElementsByClassName('dom').item(0);
            domElement.classList.add('failed');
            domElement.innerHTML += testResult.DomErrorMessage;
        }

        const testResultArea = document.getElementById('test-results');
        testResultArea?.appendChild(testResultElement);
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