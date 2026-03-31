// Author: Vitaly Spirin

"use strict";

export default class TestResult {
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

    static init(pageForTestingList) {
        TestResult.testResultList = [];
        TestResult.untestedPageUrlList = pageForTestingList;
        TestResult.testedPageUrlList = [];
    }
}
