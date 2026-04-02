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

    /** @type {boolean?} */
    isHttpResponseCodeOK = null;

    /** @type {number?} */
    httpResponseCode = null;

    /** @type {boolean?} */
    isCSSLoaded = null;

    /** @type {boolean?} */
    isFaviconLoaded = null;

    /** @type {string?} */
    faviconURL = null;

    /** @type {string[]} */
    brokenALinks = []; // will be array

    /** @type {boolean?} */
    isDomValid = null;

    /** @type {string?} */
    DomErrorMessage = null;

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
