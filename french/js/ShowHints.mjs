// Author: Vitaly Spirin

"use strict";

export class ShowHints {
    static initialize(sentenceWithHintClassName) {
        document.querySelectorAll('.' + sentenceWithHintClassName).forEach(
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

    static toggle(sentenceWithHintClassName, isEnabled) {
        document.querySelectorAll('.' + sentenceWithHintClassName).forEach(
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