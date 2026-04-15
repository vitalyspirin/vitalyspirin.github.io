// Author: Vitaly Spirin

"use strict";


export default class Types {

    /**
      * @param {any} element
      * @param {any} type
      */
    static assertType(element, type) {
        if (!(element instanceof type)) {
            throw new Error('Element "' + element + '" must be of type "' + type +
                '" but it is of type "' + Object.prototype.toString.apply(element) + '".');
        }

        return element;
    }

    /**
      * @param {any} element
      */
    static assertNotNull(element) {
        if (element === null) {
            throw new Error('Element "' + element + '" must not be null.');
        }

        return element;
    }
}