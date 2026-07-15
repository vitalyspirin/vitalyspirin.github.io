
// author: Vitaly Spirin

"use strict";

import Storage from './Storage.mjs';
import StatsPageBuilder from './StatsPageBuilder.mjs';

export class CheckboxesAndRadioButtons {
    static setValuesBasedOnConfig(self = this) {
        let page = window.location.pathname.split('/').pop() + window.location.search;

        self.setCheckboxesBasedOnConfig(page, self);
        self.setRadioButtonsBasedOnConfig(page, self);
    }

    /**
     * @param {string} page 
     * @param {*}self 
     * @returns 
     */
    static setCheckboxesBasedOnConfig(page, self = this) {
        const checkboxList = document.querySelectorAll('#checkboxes input[type="checkbox"]');

        if (checkboxList.length == 0) {
            // iframe with checkboxes is not loaded yet, so wait...
            setTimeout(self.setCheckboxesBasedOnConfig, 20, self);
        } else {
            checkboxList.forEach((checkboxElement) => {
                if (!(checkboxElement instanceof HTMLInputElement)) return;

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

            const numberOfDaysElement = document.getElementsByName('number-of-days').item(0);
            if (!(numberOfDaysElement instanceof HTMLInputElement)) return;

            if (Storage.getConfigDataForKey(page, numberOfDaysElement.name) !== null) {
                numberOfDaysElement.value = Storage.getConfigDataForKey(page, numberOfDaysElement.name);
            }
            numberOfDaysElement.onchange = () => {
                Storage.saveConfigForKey(page, numberOfDaysElement.name, numberOfDaysElement.value);
                window.location.reload();
            }

        } // if (checkboxList.length == 0) else {
    }


    /**
     * @param {string} page 
     * @param {*} self 
     */
    static setRadioButtonsBasedOnConfig(page, self = this) {

        const radioList = document.querySelectorAll('input[type="radio"]');

        radioList.forEach((radioElement) => {
            if (!(radioElement instanceof HTMLInputElement)) return;

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
        document.querySelectorAll('#checkboxes input[type="checkbox"], input[type="radio"]')
            .forEach((checkboxOrRadioElement) => {

                if (!(checkboxOrRadioElement instanceof HTMLInputElement)) return;

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
