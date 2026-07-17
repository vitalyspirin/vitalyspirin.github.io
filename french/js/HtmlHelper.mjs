// Author: Vitaly Spirin

"use strict";

export default class HtmlHelper {

    /**
     * @param {HTMLElement} listRootElement 
     */
    static randomizeLiList(listRootElement) {
        // taken from https://stackoverflow.com/questions/7070054/javascript-shuffle-html-list-element-order/11972692#11972692
        for (var i = listRootElement.children.length; i >= 0; i--)
            listRootElement.appendChild(listRootElement.children[Math.random() * i | 0]);
    }
}