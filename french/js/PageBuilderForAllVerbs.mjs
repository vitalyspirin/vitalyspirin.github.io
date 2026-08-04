// Author: Vitaly Spirin

"use strict";


import Types from './Types.mjs';
import VerbTenseResolver from './VerbTenseResolver.mjs';

export default class PageBuilderForAllVerbs {

    /**
     * @param {HTMLTemplateElement} thTemplate
     * @param {HTMLTemplateElement} trTemplate
     * @param {HTMLTemplateElement} tdTemplate
     */
    static build(thTemplate, trTemplate, tdTemplate) {
        const verbFolderList = this.#buildHeader(thTemplate);

        const trElementFromTemplate = this.#buildTrTemplate(trTemplate, tdTemplate);
        this.#buildBody(trElementFromTemplate, verbFolderList);
    }

    /**
     * 
     * @param {HTMLTemplateElement} thTemplate 
     * @returns {string[]} ['present', 'present-perfect', 'imperfect'...]
     * 
     * @example
     */
    static #buildHeader(thTemplate) {
        const thElementFromTemplate = thTemplate.content.firstElementChild;

        const verbFolderList = [];
        for (let verbName in VerbTenseResolver.map) {
            let newThElement = Types.assertType(
                thElementFromTemplate.cloneNode(true), HTMLTableCellElement);
            newThElement.innerText = verbName;

            thTemplate.insertAdjacentElement('beforebegin', newThElement);

            verbFolderList.push(VerbTenseResolver.map[verbName].folder);
        }

        return verbFolderList;
    }

    /**
     * 
     * @param {HTMLTableRowElement} trElementFromTemplate 
     * @param {string[]} verbFolderList 
     */
    static #buildBody(trElementFromTemplate, verbFolderList) {
        const tbodyElement = document.getElementsByTagName('tbody')[0];

        const verbListObj = VerbTenseResolver.getVerbList(verbFolderList);
        const verbList = Object.keys(verbListObj).sort((a, b) => a.localeCompare(b));

        let index = 1;
        verbList.forEach((verbName) => {
            let newTrElement = Types.assertType(
                trElementFromTemplate.cloneNode(true), HTMLTableRowElement);
            newTrElement.getElementsByClassName('index')[0].innerText = index;
            newTrElement.getElementsByClassName('verb-name')[0].innerText = verbName;

            for (let verbFolder in verbListObj[verbName]) {
                let tdElement = newTrElement.querySelector(`td[data-verb-name="${verbFolder}"]`);

                if (verbListObj[verbName].hasOwnProperty(verbFolder)) {
                    tdElement.setAttribute('data-exist', true);
                }

            }

            tbodyElement.append(newTrElement);
            index++;
        });
        // for (let verbName in verbListObj) {
        //     let newTrElement = Types.assertType(
        //         trElementFromTemplate.cloneNode(true), HTMLTableRowElement);
        //     newTrElement.getElementsByClassName('index')[0].innerText = index;
        //     newTrElement.getElementsByClassName('verb-name')[0].innerText = verbName;

        //     for (let verbFolder in verbListObj[verbName]) {
        //         let tdElement = newTrElement.querySelector(`td[data-verb-name="${verbFolder}"]`);

        //         if (verbListObj[verbName].hasOwnProperty(verbFolder)) {
        //             tdElement.setAttribute('data-exist', true);
        //         }

        //     }

        //     tbodyElement.append(newTrElement);
        //     index++;
        // };
    }


    /**
     * 
     * @param {HTMLTemplateElement} trTemplate 
     * @param {HTMLTemplateElement} tdTemplate 
     * 
     * @returns {HTMLTableRowElement}
     */
    static #buildTrTemplate(trTemplate, tdTemplate) {
        const trElementFromTemplate = Types.assertType(
            trTemplate.content.firstElementChild, HTMLTableRowElement);
        const tdElementFromTemplate = tdTemplate.content.firstElementChild;

        for (let verbName in VerbTenseResolver.map) {
            let newTdElement = Types.assertType(
                tdElementFromTemplate.cloneNode(true), HTMLTableCellElement);
            newTdElement.setAttribute('data-verb-name', VerbTenseResolver.map[verbName].folder);

            trElementFromTemplate.append(newTdElement);
        }

        return trElementFromTemplate;
    }

}
