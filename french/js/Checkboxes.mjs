
// author: Vitaly Spirin

"use strict";

import Storage from './Storage.mjs';

export class Checkboxes {
    static setCheckboxesBasedOnConfig(self = this) {
        let page = window.location.pathname.split('/').pop() + window.location.search;

        const checkboxList = document.querySelectorAll('#checkboxes input');

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
                    Storage.saveConfig(page, checkboxElement.name, checkboxElement.checked);
                    self.addCssClassesBasedOnCheckboxSelection();
                }
            });

            self.addCssClassesBasedOnCheckboxSelection();
        }
    }

    static addCssClassesBasedOnCheckboxSelection() {
        document.querySelectorAll('#checkboxes input').forEach((checkboxElement) => {

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
