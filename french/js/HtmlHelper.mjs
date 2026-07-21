// Author: Vitaly Spirin

"use strict";

export default class HtmlHelper {

    static LAST_INPUT_ELEMENT_ATTRIBUTE = 'data-last-input-element';

    /**
     * @param {HTMLElement} listRootElement 
     */
    static randomizeLiList(listRootElement) {
        // taken from https://stackoverflow.com/questions/7070054/javascript-shuffle-html-list-element-order/11972692#11972692
        for (var i = listRootElement.children.length; i >= 0; i--)
            listRootElement.appendChild(listRootElement.children[Math.random() * i | 0]);
    }

    /**
     * @param {HTMLInputElement} lastInputElement
     */
    static markLastInputElement(lastInputElement) {
        if (lastInputElement.type == 'radio') {
            document.getElementsByName(lastInputElement.name).forEach((element) => {
                element.setAttribute(this.LAST_INPUT_ELEMENT_ATTRIBUTE, 'true');
            });
        } else { /* type == 'text' */
            lastInputElement.setAttribute(this.LAST_INPUT_ELEMENT_ATTRIBUTE, 'true');
        }
    }

    /**
     * @param {HTMLInputElement} inputElement
     */
    static isLastInputElement(inputElement) {
        return (inputElement.getAttribute(this.LAST_INPUT_ELEMENT_ATTRIBUTE) !== null);
    }
}