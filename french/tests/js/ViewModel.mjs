// Author: Vitaly Spirin

"use strict";

import ViewModelBase from "./ViewModelBase.mjs";

export default class ViewModel extends ViewModelBase {

    /** @type {boolean?} */
    httpResponseCode = null;

    /** @type {boolean?} */
    aLinks = null;

    /** @type {boolean?} */
    favicon = null;

    /** @type {boolean?} */
    css = null;

    /** @type {boolean?} */
    xml = null;

    /** @type {boolean?} */
    js = null;

    /** @type {boolean?} */
    html = null;

    /** @type {number|string?} */
    numberOfPages = null;

    /** @type {string?} */
    startingPage = null;

    /**
     * @param {HTMLCollectionOf<HTMLInputElement>} formInput
     */
    constructor(formInput) {
        super();

        this.setFrom(formInput);
    }
}
