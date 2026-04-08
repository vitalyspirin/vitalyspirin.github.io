// Author: Vitaly Spirin

"use strict";

export default class TestResult {
    /** @type {TestResult[]} */
    static testResultList = [];

    /** @type {string[]} */
    static untestedPageUrlList = [];

    /** @type {string[]} */
    static testedPageUrlList = [];

    /** @type {string} */
    pageUrl = '';

    /** @type {string?} */
    pageContent = null;

    /** @type {boolean?} */
    isHttpResponseCodeOK = null;

    /** @type {number?} */
    httpResponseCode = null;

    /** @type {boolean?} */
    isCssLoaded = null;

    /** @type {string[]} */
    brokenCssLinks = [];

    /** @type {boolean?} */
    isFaviconLoaded = null;

    /** @type {string?} */
    faviconUrl = null;

    /** @type {string[]} */
    brokenALinks = [];

    /** @type {boolean?} */
    isXmlValid = null;

    /** @type {string?} */
    xmlErrorMessage = null;

    /** @type {boolean?} */
    isHtmlValid = null;

    /** @type {string[]} */
    htmlErrorMessageList = [];

    
    /** 
     * @param {string} pageUrl
     */
    constructor(pageUrl = '') {
        this.pageUrl = pageUrl;
    }

    /** 
     * @param {string[]} pageForTestingList - The window object of the iframe. 
     */
    static init(pageForTestingList) {
        TestResult.testResultList = [];
        TestResult.untestedPageUrlList = pageForTestingList;
        TestResult.testedPageUrlList = [];
    }
}
