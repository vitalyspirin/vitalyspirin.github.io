// Author: Vitaly Spirin

"use strict";

import TestResult from "./TestResult.mjs";

Array.prototype.removeOnce = function (value) {
    const index = this.indexOf('mouse');
    if (index > -1) {
        this.splice(index, 1);
    }
    return this;
};

export default class TestEngine {
    static TIME_DELAY_TO_LOAD_PAGE = 100;
    static PAGE_EXTENTIONS_LIST = ['html'];
    static NO_TESTING_CLASS = 'no-testing'; // href of A tags with such CSS class will not be tested

    static async testPage(iframeWindow, viewModel, callbackFunction) {
        console.log('testPage() : ' + iframeWindow.location.href);

        const testResult = new TestResult();
        testResult.pageUrl = iframeWindow.location.href;

        if (this.#testHttpResponseCode(testResult, iframeWindow)) {

            if (this.PAGE_EXTENTIONS_LIST.includes(testResult.pageUrl.split('.').pop())) {
                if (viewModel.favicon) {
                    await this.#testFavicon(testResult, iframeWindow);
                }

                if (viewModel.css) {
                    this.#testCSS(testResult, iframeWindow, viewModel);
                }

                if (viewModel.aLinks) {
                    await this.#testALinks(testResult, iframeWindow);
                }

                if (viewModel.domXml) {
                    await this.#testDOM(testResult, iframeWindow);
                }
            }
            TestResult.testResultList.push(testResult);
            TestResult.testedPageUrlList.push(testResult.pageUrl);
            TestResult.untestedPageUrlList.removeOnce(testResult.pageUrl);
        }


        callbackFunction(testResult);
        // Test.#showProgress(testResult);
        // Test.#nextPage();
    }

    static #testHttpResponseCode(testResult, iframeWindow) {
        const iframeResponseCode = iframeWindow.performance.getEntriesByType("navigation")[0].responseStatus;

        testResult.isHttpResponseCodeOK = (iframeResponseCode == 200);
        testResult.httpResponseCode = iframeResponseCode;

        return testResult.isHttpResponseCodeOK;
    }

    static #testCSS(testResult, iframeWindow, viewModel) {
        const computedStyle = iframeWindow.getComputedStyle(iframeWindow.document.body);
        const cssVar = computedStyle.getPropertyValue(viewModel.cssVar);
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
            if (aLink.classList.contains(this.NO_TESTING_CLASS)) continue;

            try {
                let url = aLink.href;
                if (window.location.hostname !== (new URL(url)).hostname) {
                    url = this.#addProxyToExternalUrl(url);
                }

                const response = await fetch(url, { method: 'HEAD' });

                // Manually check for HTTP errors (fetch() only rejects on network failures)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                } else {
                    if (url === aLink.href && // the same domain
                        this.PAGE_EXTENTIONS_LIST.includes(url.split('.').pop()) &&
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

}