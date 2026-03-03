
// author: Vitaly Spirin

"use strict";

import { Config } from './Config.mjs';

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

                checkboxElement.checked = Config.retrieve(page, checkboxElement.name) ?? true;

                checkboxElement.onclick = () => {
                    Config.save(page, checkboxElement.name, checkboxElement.checked);
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
