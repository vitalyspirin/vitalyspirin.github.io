// Author: Vitaly Spirin

"use strict";

import ViewModelBase from "./ViewModelBase.mjs";

export default class ViewModel extends ViewModelBase {
    httpResponseCode;
    aLinks;
    favicon;
    domXml;
    css;
    cssVar;
    numberOfPages;

    constructor(formInput) {
        super();

        this.setFrom(formInput);
    }
}
