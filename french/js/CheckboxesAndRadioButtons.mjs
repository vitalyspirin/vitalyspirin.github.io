
// author: Vitaly Spirin

"use strict";

import Storage from './Storage.mjs';

export class CheckboxesAndRadioButtons {

    static setValuesBasedOnConfig(self = this) {
        let page = window.location.pathname.split('/').pop() + window.location.search;

        self.setCheckboxesBasedOnConfig(page, self);
        self.setRadioButtonsBasedOnConfig(page, self);

        self.setNumberOfDays(page);
    }

    /**
     * @param {string} page 
     */
    static setNumberOfDays(page) {
        const numberOfDaysElement = /** @type HTMLInputElement */
            (document.getElementsByName('number-of-days').item(0));

        if (numberOfDaysElement === null) return; // index page (so no numberOfDaysElement)

        if (Storage.getConfigDataForKey(page, numberOfDaysElement.name) !== null) {
            numberOfDaysElement.value = Storage.getConfigDataForKey(page, numberOfDaysElement.name);
        }

        numberOfDaysElement.onchange = () => {
            Storage.saveConfigForKey(page, numberOfDaysElement.name, numberOfDaysElement.value);
            window.location.reload();
        }
    }

    /**
     * @param {string} page 
     * @param {*}self 
     * @returns 
     */
    static setCheckboxesBasedOnConfig(page, self = this) {
        const checkboxList = /** @type {NodeListOf<HTMLInputElement>} */
            (document.querySelectorAll('#checkboxes input[type="checkbox"]'));

        if (checkboxList.length == 0) {
            // iframe with checkboxes is not loaded yet, so wait...
            setTimeout(self.setCheckboxesBasedOnConfig, 20, page, self);
        } else {
            checkboxList.forEach((checkboxElement) => {
                if (Storage.getConfigDataForKey(page, checkboxElement.name) != null) {
                    checkboxElement.checked = Storage.getConfigDataForKey(page, checkboxElement.name);
                } else if (checkboxElement.hasAttribute('data-unchecked')) {
                    // uncheck 'recent-dates' checkbox
                    checkboxElement.checked = false;
                } else {
                    checkboxElement.checked = true;
                }

                checkboxElement.onclick = () => {
                    Storage.saveConfigForKey(page, checkboxElement.name, checkboxElement.checked);
                    self.addCssClassesBasedOnSelection();
                }
            });

            self.addCssClassesBasedOnSelection();

        } // if (checkboxList.length == 0) else {
    }


    /**
     * @param {string} page 
     * @param {*} self 
     */
    static setRadioButtonsBasedOnConfig(page, self = this) {

        const radioList = /** @type {NodeListOf<HTMLInputElement>} */
            (document.querySelectorAll('input[type="radio"]'));

        radioList.forEach((radioElement) => {
            if (Storage.getConfigDataForKey(page, radioElement.name) != null) {
                if (radioElement.value === Storage.getConfigDataForKey(page, radioElement.name)) {
                    radioElement.checked = true;
                }
            }

            radioElement.onclick = () => {
                Storage.saveConfigForKey(page, radioElement.name, radioElement.value);
                self.addCssClassesBasedOnSelection();
            }
        });

        self.addCssClassesBasedOnSelection();
    }

    static addCssClassesBasedOnSelection() {
        const checkboxOrRadioElementList = /** @type {NodeListOf<HTMLInputElement>} */
            (document.querySelectorAll('#checkboxes input[type="checkbox"], input[type="radio"]'));

        checkboxOrRadioElementList.forEach((checkboxOrRadioElement) => {
            const element = document.getElementsByTagName('article')[0];

            let cssClass;
            if (checkboxOrRadioElement.type === 'checkbox') {
                cssClass = checkboxOrRadioElement.name;
            } else {
                cssClass = checkboxOrRadioElement.value;
            }

            if (checkboxOrRadioElement.checked) {
                element.classList.add(cssClass);
            } else {
                element.classList.remove(cssClass);
            }
        });
    }


}
