// Author: Vitaly Spirin

"use strict";

import Utils from './Utils.mjs';

export class RadioButtonValidation {
    static initialize() {
        const radioButtonList = document.querySelectorAll('input[type="radio"]');

        radioButtonList.forEach(element => {
            if (!(element instanceof HTMLInputElement)) return;

            element.onclick = () => {
                if (!element.required) {
                    element.parentElement.classList.add('failed');
                }
            }
        });
    }
}
