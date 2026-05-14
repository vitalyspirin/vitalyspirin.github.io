// Author: Vitaly Spirin

"use strict";


export default class Types {

    /**
      * @param {any} element
      * @param {any} type
      * @param {string?} errorMessage
      */
    static assertType(element, type, errorMessage = null) {
        if (!(element instanceof type)) {
            if (errorMessage == null) {
                errorMessage = 'Element "' + element + '" must be of type "' + type +
                '" but it is of type "' + Object.prototype.toString.apply(element) + '".';
            }
            throw new Error(errorMessage);
        }

        return element;
    }

    /**
      * @param {any} element
      */
    static assertNotNull(element, comment = 'Element must not be null.') {
        if (element === null) {
            throw new Error(comment);
        }

        return element;
    }
}