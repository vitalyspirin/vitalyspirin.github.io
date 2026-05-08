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
                            if (!(event.target instanceof HTMLInputElement)) return;

                            if (event.target.parentElement.className.includes(' on')) return;

                            if (!event.target.checkValidity())
                                event.target.parentElement.className += ' on';
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