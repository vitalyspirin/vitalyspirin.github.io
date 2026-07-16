// Author: Vitaly Spirin

"use strict";

export default class HtmlHelper {

    /**
     * @param {HTMLElement} listRootElement 
     */
    static randomizeLiList(listRootElement) {
        for (var i = listRootElement.children.length; i >= 0; i--)
            listRootElement.appendChild(listRootElement.children[Math.random() * i | 0]);
    }
}