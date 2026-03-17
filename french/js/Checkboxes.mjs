
// author: Vitaly Spirin

"use strict";

import Storage from './Storage.mjs';
import StatsPageBuilder from './StatsPageBuilder.mjs';

export class Checkboxes {
    static setCheckboxesBasedOnConfig(self = this) {
        let page = window.location.pathname.split('/').pop() + window.location.search;

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
                    self.addCssClassesBasedOnCheckboxSelection();
                }
            });

            self.addCssClassesBasedOnCheckboxSelection();

            const numberOfDaysElement = document.getElementsByName('number-of-days').item(0);
            if (!(numberOfDaysElement instanceof HTMLInputElement)) return;

            if (Storage.getConfigDataForKey(page, numberOfDaysElement.name) !== null) {
                numberOfDaysElement.value = Storage.getConfigDataForKey(page, numberOfDaysElement.name);
            }
            numberOfDaysElement.onblur = () => {
                Storage.saveConfigForKey(page, numberOfDaysElement.name, numberOfDaysElement.value);
                window.location.reload();
            }

        } // if (checkboxList.length == 0) else {
    }

    static addCssClassesBasedOnCheckboxSelection() {
        document.querySelectorAll('#checkboxes input[type="checkbox"]').forEach((checkboxElement) => {

            if (!(checkboxElement instanceof HTMLInputElement)) return;

            const element = document.getElementsByTagName('article')[0];

            if (checkboxElement.checked) {
                element.classList.add(checkboxElement.name);
            } else {
                element.classList.remove(checkboxElement.name);
            }
        });
    }
}
