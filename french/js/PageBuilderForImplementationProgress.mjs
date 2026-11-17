// Author: Vitaly Spirin

"use strict";

import BaseObject from './BaseObject.mjs';
import implementationProgress from './implementationProgress.mjs';

export default class PageBuilderForImplementationProgress extends BaseObject {

    /**
     * @param {HTMLElement} menuElement
     * @param {HTMLTemplateElement} menuItemTemplate
     * @param {HTMLElement} tableElement
     * @param {HTMLTemplateElement} trTitleTemplate
     * @param {HTMLTemplateElement} trTemplate
     */
    static build(
        menuElement,
        menuItemTemplate,
        tableElement,
        trTitleTemplate,
        trTemplate
    ) {
        this.#buildMenu(menuElement, menuItemTemplate, implementationProgress);

        this.#buildTable(tableElement, trTitleTemplate, trTemplate, implementationProgress);

        /** @type {HTMLInputElement} */
        const radioButton = menuElement.querySelector("input[type='radio']:first-of-type");
        radioButton.click();
    }

    /**
     * @param {HTMLElement} menuElement
     * @param {HTMLTemplateElement} menuItemTemplate 
     * @param {any} implementationProgress 
     */
    static #buildMenu(menuElement, menuItemTemplate, implementationProgress) {
        const menuItemElementFromTemplate = menuItemTemplate.content.firstElementChild;

        for (let menuItemName in implementationProgress) {
            let newMenuItemElement = /** @type {HTMLLIElement} */
                (menuItemElementFromTemplate.cloneNode(true));

            /** @type {HTMLElement} */ (newMenuItemElement.querySelector('.menu-item-text'))
                .innerText = menuItemName;

            /** @type {HTMLInputElement} */
            let radioButton = newMenuItemElement.querySelector('input[type="radio"]');
            radioButton.value = menuItemName;
            radioButton.onclick = () => {
                const className = this.utils.removeSpecialChars(radioButton.value);
                this.#setVisible(className);
                console.log('onclick');
            };

            menuElement.appendChild(newMenuItemElement);
        }
    }

    /**
     * @param {HTMLElement} tableElement
     * @param {HTMLTemplateElement} trTitleTemplate 
     * @param {HTMLTemplateElement} trTemplate 
     * @param {any} implementationProgress 
     */
    static #buildTable(tableElement, trTitleTemplate, trTemplate, implementationProgress) {
        const tbodyElement = tableElement.querySelector('tbody');
        const trTitleElementFromTemplate = trTitleTemplate.content.firstElementChild;
        const trElementFromTemplate = trTemplate.content.firstElementChild;

        for (let menuItemName in implementationProgress) {
            let newTrTitleElement = /** @type {HTMLLIElement} */
                (trTitleElementFromTemplate.cloneNode(true));
            newTrTitleElement.classList.add(this.utils.removeSpecialChars(menuItemName));

            /** @type {HTMLElement} */ (newTrTitleElement.querySelector('td'))
                .innerText = menuItemName;

            tbodyElement.appendChild(newTrTitleElement);

            for (let exerciseName in implementationProgress[menuItemName]) {
                let newTrElement = /** @type {HTMLLIElement} */
                    (trElementFromTemplate.cloneNode(true));

                this.#buildTr(newTrElement, implementationProgress, menuItemName, exerciseName);

                tbodyElement.appendChild(newTrElement);
            }
        }
    }

    /**
     * @param {HTMLElement} newTrElement
     * @param {any} implementationProgress 
     * @param {string} menuItemName 
     * @param {string} exerciseName 
     */
    static #buildTr(newTrElement, implementationProgress, menuItemName, exerciseName) {
        newTrElement.classList.add(this.utils.removeSpecialChars(menuItemName));

        const exerciseDataObj = implementationProgress[menuItemName][exerciseName];

        /** @type {HTMLElement} */
        let aElement = (newTrElement.querySelector('td:first-of-type a'));
        aElement.innerText = exerciseName;
        aElement.setAttribute("href", exerciseDataObj["original"]['info']);

        /** @type {HTMLElement} */
        aElement = (newTrElement.querySelector('td:nth-of-type(2) a'));
        aElement.setAttribute("href", exerciseDataObj["original"]["exercise"]);

        if (Object.hasOwn(exerciseDataObj["implementation"], "info")) {
            /** @type {HTMLElement} */
            aElement = (newTrElement.querySelector('td:nth-of-type(3) a.info'));
            aElement.setAttribute("href", exerciseDataObj["implementation"]["info"]);
        }

        if (Object.hasOwn(exerciseDataObj["implementation"], "exercise")) {
            /** @type {HTMLElement} */
            aElement = (newTrElement.querySelector('td:nth-of-type(3) a.exercise'));
            aElement.setAttribute("href", exerciseDataObj["implementation"]["exercise"]);
        } else {
            newTrElement.classList.add('not-implemented');
        }
    }


    /**
     * @param {string} className
     */
    static #setVisible(className) {
        document.querySelectorAll(`tbody tr.${className}`)
            .forEach((/** @type {HTMLElement} */ trElement) => {
                trElement.style.display = 'table-row';
            });

        document.querySelectorAll(`tbody tr:not(.${className})`)
            .forEach(/** @type {HTMLElement} */(trElement) => {
                trElement.style.display = 'none';
            });
    }


}
