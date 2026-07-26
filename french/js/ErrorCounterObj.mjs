// Author: Vitaly Spirin

"use strict";

export default class ErrorCounterObj {

    /** @type Record<string, ErrorCounterObj> */
    static errorCounterObjList = {};


    numberOfErrors = 0;
    numberOfCompleted = 0;
    numberOfAllInputElements = 0;
    duration = 0;

    /**
     * 
     * @param {string[]} verbTenseList
     */
    static init(verbTenseList) {
        verbTenseList.forEach(verbTense => {
            this.errorCounterObjList[verbTense] = new ErrorCounterObj();
        });
    }

    /**
     * @param {string?} verbTense
     * @return ErrorCounterObj
     */
    static getErrorCounterObj(verbTense) {
        return this.errorCounterObjList[verbTense ?? ''];
    }

}
