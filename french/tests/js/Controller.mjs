// Author: Vitaly Spirin

"use strict";

import TestEngine from "./TestEngine.mjs";
import TestResult from "./TestResult.mjs";
import View from "./View.mjs";
import ViewModel from "./ViewModel.mjs";

export default class Controller {
    #view;

    /** @type {ViewModel?} */
    #viewModel = null;

    /**
     * @param {View} view
     */
    constructor(view) {
        this.#view = view;
    }

    /**
     * @param {ViewModel} viewModel
     */
    startTests(viewModel) {
        this.#viewModel = viewModel;

        this.#init(Array.from([viewModel.startingPage ?? '']), viewModel.corsProxy);

        this.#nextPage();
    }


    /**
     * @param {string[]} pageForTestingList
     * @param {string} corsProxy
     */
    #init(pageForTestingList, corsProxy) {
        TestResult.init(pageForTestingList);
        TestEngine.corsProxy = corsProxy;

        this.#view.clear();
    }

    #nextPage() {

        if (this.#viewModel?.numberOfPages !== ''
            && TestResult.testResultList.length >= Number(this.#viewModel?.numberOfPages)) return;

        if (TestResult.untestedPageUrlList.length > 0) {
            this.#view.iframe.src = TestResult.untestedPageUrlList.pop() ?? '';

            const iframeWindow = this.#view.iframe.contentWindow;
            if (iframeWindow === null) return;

            setTimeout(() => { // anonymous function to be able to use 'this' inside TestEngine.testPage()
                TestEngine.testPage(
                    iframeWindow,
                    // @ts-ignore
                    this.#viewModel,
                    (/** @type {TestResult} */ testResult) => {
                        this.afterPageHasBeenTested(testResult);
                    }
                );
            },
                TestEngine.TIME_DELAY_TO_LOAD_PAGE,
            );
        }
    }

    /**
     * @param {TestResult} testResult
     */
    afterPageHasBeenTested(testResult) {
        this.#view.showProgress(testResult);

        this.#nextPage();
    }
}