// Author: Vitaly Spirin

"use strict";

export class ShowHints {

    /**
     * @param {string} sentenceWithHintCSSClassName
     */
    static initialize(sentenceWithHintCSSClassName) {
        document.querySelectorAll('.' + sentenceWithHintCSSClassName).forEach(
            function (sentence) {

                for (const element of sentence.children) {
                    if (element.tagName.toLowerCase() === 'input') {
                        element.addEventListener("focusout", (event) => {
                            const target = /** @type {HTMLInputElement} */ (event.target);

                            if (target.parentElement.className.includes(' on')) return;

                            if (!target.checkValidity())
                                target.parentElement.className += ' on';
                        });
                    }
                }
            });
    }

    /**
     * @param {string} sentenceWithHintCSSClassName
     * @param {boolean} isEnabled
     */
    static toggle(sentenceWithHintCSSClassName, isEnabled) {
        document.querySelectorAll('.' + sentenceWithHintCSSClassName).forEach(
            function (element) {
                if (isEnabled) {
                    if (element.className.includes(' on')) return;
                    element.className += ' on';
                } else {
                    element.className = element.className.replace(' on', '');
                }

            });
    }
}