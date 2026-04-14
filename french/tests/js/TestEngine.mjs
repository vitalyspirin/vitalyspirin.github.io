// Author: Vitaly Spirin

"use strict";

import TestEngineBase from "./TestEngineBase.mjs";
import TestResult from "./TestResult.mjs";

export default class TestEngine extends TestEngineBase {

    /**
     * @param {TestResult} testResult
     * @param {Window} iframeWindow - The window object of the iframe.
     */
    static testJs(testResult, iframeWindow) {
        const infoIconElement = iframeWindow.document.getElementsByClassName('info-icon').item(0);
        if (infoIconElement === null) {
            console.error('To test JavaScript the page must have HTML element with class "info-icon".');
            return;
        }

        const visibilityValue = infoIconElement?.computedStyleMap().get('visibility');

        // @ts-ignore
        testResult.isJsValid = (visibilityValue?.value === 'visible');
    }
}