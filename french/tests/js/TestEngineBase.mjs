// Author: Vitaly Spirin

"use strict";

import TestResult from "./TestResult.mjs";
import ViewModel from "./ViewModel.mjs";


export default class TestEngineBase {
    static TIME_DELAY_TO_LOAD_PAGE = 200;
    static PAGE_EXTENTIONS_LIST = ['html'];
    static NO_TESTING_CLASS = 'no-testing'; // href of A tags with such CSS class will not be tested
    static PROXY = 'https://proxy.corsfix.com/?'; // proxy to fetch external url
    static HTML_VALIDATOR_SERVICE = 'https://validator.w3.org/nu/?out=json'; // https://github.com/validator/validator/wiki/Service-%C2%BB-Input-%C2%BB-POST-body


    /**
     * @param {Window} iframeWindow - The window object of the iframe.
     * @param {ViewModel} viewModel
     * @param {function} callbackFunction
     */
    static async testPage(iframeWindow, viewModel, callbackFunction) {
        console.log('testPage() : ' + iframeWindow.location.href);

        const testResult = new TestResult(iframeWindow.location.href);
        // testResult.pageUrl = iframeWindow.location.href;

        if (this.testHttpResponseCode(testResult, iframeWindow)) {

            if (this.PAGE_EXTENTIONS_LIST.includes(testResult.pageUrl?.split('.').pop() + '')) {
                if (viewModel.favicon) {
                    await this.testFavicon(testResult, iframeWindow);
                }

                if (viewModel.css) {
                    await this.testCSS(testResult, iframeWindow, viewModel);
                }

                if (viewModel.aLinks) {
                    await this.testALinks(testResult, iframeWindow);
                }

                if (viewModel.xml) {
                    await this.testXml(testResult, iframeWindow);
                }

                if (viewModel.html) {
                    await this.testHtml(testResult, iframeWindow);
                }

                if (viewModel.js) {
                    this.testJs(testResult, iframeWindow);
                }
            }
            TestResult.testResultList.push(testResult);
            TestResult.testedPageUrlList.push(testResult.pageUrl);
        }


        callbackFunction(testResult);
    }

    /**
     * @param {TestResult} testResult
     * @param {Window} iframeWindow - The window object of the iframe.
     */
    static testHttpResponseCode(testResult, iframeWindow) {
        // @ts-ignore
        const iframeResponseCode = iframeWindow.performance.getEntriesByType("navigation")[0].responseStatus;

        testResult.isHttpResponseCodeOK = (iframeResponseCode == 200);
        testResult.httpResponseCode = iframeResponseCode;

        return testResult.isHttpResponseCodeOK;
    }

    /**
     * @param {TestResult} testResult
     * @param {Window} iframeWindow - The window object of the iframe.
     * @param {ViewModel} viewModel
     */
    static async testCSS(testResult, iframeWindow, viewModel) {
        /** @type {NodeListOf<HTMLLinkElement>} */
        const cssLinkList = iframeWindow.document.querySelectorAll('link[rel="stylesheet"]');

        testResult.isCssLoaded = true;
        for (const cssLink of cssLinkList) {
            if (! await this.isFetchSuccess(cssLink.href)) {
                testResult.brokenCssLinks.push(cssLink.href);
            }
        };

        testResult.isCssLoaded = (testResult.brokenCssLinks.length == 0);
    }

    /**
     * @param {TestResult} testResult
     * @param {Window} iframeWindow - The window object of the iframe.
     */
    static async testFavicon(testResult, iframeWindow) {
        /** @type {HTMLLinkElement?} */
        const faviconElement = iframeWindow.document.querySelector('link[rel="icon"]');
        if (faviconElement === null) return;

        if (await this.isFetchSuccess(faviconElement.href)) {
            testResult.isFaviconLoaded = true;
        } else {
            testResult.isFaviconLoaded = false;
            testResult.faviconUrl = faviconElement.href;
        }
    }

    /**
     * @param {TestResult} testResult
     * @param {Window} iframeWindow - The window object of the iframe.
     */
    static async testALinks(testResult, iframeWindow) {
        const aLinkList = iframeWindow.document.getElementsByTagName('a');
        for (const aLink of aLinkList) {
            if (aLink.classList.contains(this.NO_TESTING_CLASS)) continue;

            const url = aLink.href;
            if (await this.isFetchSuccess(url)) {
                if (window.location.hostname === (new URL(url)).hostname && // the same domain
                    this.PAGE_EXTENTIONS_LIST.includes(url.split(/[?#]/)[0].split('.').pop() + '') &&
                    !TestResult.testedPageUrlList.includes(url) &&
                    !TestResult.untestedPageUrlList.includes(url)
                ) {
                    TestResult.untestedPageUrlList.push(url);
                }
            } else {
                // This catch block handles network errors or a bad scheme
                testResult.brokenALinks.push(url);
            }
        };
    }

    /**
     * @param {TestResult} testResult
     * @param {Window} iframeWindow - The window object of the iframe.
     */
    static async testXml(testResult, iframeWindow) {
        if (testResult.pageContent === null) {
            const response = await fetch(testResult.pageUrl);
            testResult.pageContent = await response.text();
        }

        const parser = new DOMParser();
        let doc = parser.parseFromString(testResult.pageContent, 'application/xml');

        // Check for parser errors in the parsed document
        let parseError = doc.getElementsByTagName('parsererror').item(0);
        if (parseError !== null && parseError.textContent.includes("'nbsp'")) {
            const documentStr2 = testResult.pageContent.replace('<!DOCTYPE html>',
                '<!DOCTYPE html [ <!ENTITY nbsp "&#160;"> ]>');
            doc = parser.parseFromString(documentStr2, 'application/xml');
            parseError = doc.getElementsByTagName('parsererror').item(0);
        }

        if (parseError !== null) {
            testResult.isXmlValid = false;
            testResult.xmlErrorMessage = parseError.textContent;
        } else {
            testResult.isXmlValid = true;
        }
    }

    /**
     * @param {TestResult} testResult
     * @param {Window} iframeWindow - The window object of the iframe.
     */
    static async testHtml(testResult, iframeWindow) {
        if (testResult.pageContent === null) {
            const response = await fetch(testResult.pageUrl);
            testResult.pageContent = await response.text();
        }

        try {
            const responseFromValidator = await fetch(
                this.addProxyToExternalUrlIfNeeded(this.HTML_VALIDATOR_SERVICE),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/html; charset=utf-8",
                        'User-Agent': 'MyValidatorClient/1.0' // Recommended to identify your script
                    },
                    body: testResult.pageContent
                }
            );

            // Manually check for HTTP errors (fetch() only rejects on network failures)
            if (!responseFromValidator.ok) {
                throw new Error(`HTTP error! status: ${responseFromValidator.status}`);
            } else {
                const responseObj = await responseFromValidator.json();

                testResult.isHtmlValid = true;
                if (responseObj.messages.length !== 0) {
                    for (let i = 0; i < responseObj.messages.length; i++) {
                        if (responseObj.messages[i].type == 'error') {
                            testResult.isHtmlValid = false;
                            testResult.htmlErrorMessageList.push(
                                responseObj.messages[i].lastLine + ':' +
                                responseObj.messages[i].lastColumn + ' - ' +
                                responseObj.messages[i].message);
                        }
                    } // for
                } // if (responseObj.messages.length !== 0) {
            } // if else (!responseFromValidator.ok) {
        } catch (err) {
            console.log(err);
            // This catch block handles network errors or a bad scheme
            testResult.isHtmlValid = false;
            // @ts-ignore
            testResult.htmlErrorMessageList.push(err.message);
        }
    }

    /**
     * @param {TestResult} testResult
     * @param {Window} iframeWindow - The window object of the iframe.
     */
    static testJs(testResult, iframeWindow) {
        console.log('#testJs() inside TestEngineBase');
    }

    /**
     * @param {string} url
     */
    static async isFetchSuccess(url) {
        let result;

        try {
            url = this.addProxyToExternalUrlIfNeeded(url);

            const response = await fetch(url, { method: 'HEAD' });

            // Manually check for HTTP errors (fetch() only rejects on network failures)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                result = true;
            }
        } catch (err) {
            // This catch block handles network errors or a bad scheme
            result = false;
        }

        return result;
    }

    /**
     * @param {string} url
     */
    static addProxyToExternalUrlIfNeeded(url) {
        if (window.location.hostname !== (new URL(url)).hostname) {
            url = this.PROXY + url;
        }
        return url;
    }

}