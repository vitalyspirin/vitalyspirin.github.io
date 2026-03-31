// Author: Vitaly Spirin

"use strict";

import TestEngine from "./TestEngine.mjs";
import TestResult from "./TestResult.mjs";

export default class Controller {
    #view;
    #viewModel;

    constructor(view, viewModel) {
        this.#view = view;
    }

    startTests(viewModel) {
        this.#viewModel = viewModel;

        this.#init(Array.from([viewModel.startingPage]));

        this.#nextPage();
    }

    // static testSystem(viewModel) {
    //     Test.viewModel = viewModel;

    //     Test.#init(Array.from(Test.FAILED_TESTS));

    //     Test.#nextPage();
    // }

    #init(pageForTestingList) {
        TestResult.init(pageForTestingList);

        this.#view.clear();
    }

    #nextPage() {

        if (this.#viewModel.numberOfPages !== ''
            && TestResult.testResultList.length >= this.#viewModel.numberOfPages) return;

        if (TestResult.untestedPageUrlList.length > 0) {
            this.#view.iframe.src = TestResult.untestedPageUrlList.pop();

            const iframeWindow = this.#view.iframe.contentWindow;
            setTimeout(() => { // to be able to use 'this' inside TestEngine.testPage()
                TestEngine.testPage(
                    iframeWindow,
                    this.#viewModel,
                    (testResult) => { this.afterPageHasBeenTested(testResult); }
                );
            },
                TestEngine.TIME_DELAY_TO_LOAD_PAGE,
            );
        }
    }

    afterPageHasBeenTested(testResult) {
        this.#view.showProgress(testResult);

        this.#nextPage();
    }
}