// Author: Vitaly Spirin

"use strict";

import { Resolver } from './Resolver.mjs';
import { SpeakerPhone } from './SpeakerPhone.mjs';
import Utils from './Utils.mjs';
import VerbTenseResolver from './VerbTenseResolver.mjs';

export class PageBuilderForManyTenses {

    /**
     * @param {string} title
     */
    static buildForManyTenses(title) {
        const tenseList = this.getVerbTenseListFromTitleOrCheckboxes(title);
        const verbMixedConjugationList = VerbTenseResolver.getVerbList(tenseList);

        let verbListBlock = document.getElementById("verb-list");
        verbListBlock.textContent = '';
        if (tenseList.length === 1) {
            verbListBlock.className = 'one-tense-only';
            title = VerbTenseResolver.getTenseByFolder(tenseList[0]);
        } else {
            verbListBlock.className = '';
        }

        document.title = title;
        document.getElementById("page-title").textContent = title;

        let templateVerbBlock = /** @type {HTMLTemplateElement} */
            (document.getElementById("template-verb-block")).content.firstElementChild;

        let templateConjugationsForOneTenseBlock = /** @type {HTMLTemplateElement} */
            (document.getElementById("template-conjugations-for-one-tense-block"))
                .content.firstElementChild;

        let counter = 1;
        let str = ''; // for debugging

        for (let infinitive in verbMixedConjugationList) {

            let infinitiveHasAllTensesInTheList = tenseList.every(tense =>
                Object.keys(verbMixedConjugationList[infinitive]).includes(tense)
            );

            if (!infinitiveHasAllTensesInTheList) continue;

            let verbBlock = /** @type {HTMLElement} */ (templateVerbBlock.cloneNode(true));

            let infinitiveElement = verbBlock.querySelector(".infinitive");
            infinitiveElement.textContent = counter + ' - ' + infinitive;
            counter++;

            for (let tense in verbMixedConjugationList[infinitive]) {
                if (!tenseList.includes(tense)) continue;

                let newConjugationsForOneTenseBlock = /** @type {HTMLElement} */
                    (templateConjugationsForOneTenseBlock.cloneNode(true));
                str += this.fillConjugationsForOneTenseBlock(
                    newConjugationsForOneTenseBlock,
                    infinitive,
                    verbMixedConjugationList[infinitive][tense],
                    tense
                );
                verbBlock.append(newConjugationsForOneTenseBlock);
            }

            verbListBlock.append(verbBlock);
        } // for (let infinitive in verbsInPresentTense)

        document.getElementById("number-of-verbs").textContent = String(counter - 1);

        // console.log(str); // use Spell Checker to find spelling errors
    } // static buildForManyTenses()


    /**
     * 
     * @param {HTMLElement} newConjugationsForOneTenseBlock
     * @param {string} infinitive
     * @param {import("./VerbTenseResolver.mjs").ConjugationsForOneVerb} conjugationList
     * @param {string} tense
     */
    static fillConjugationsForOneTenseBlock(
        newConjugationsForOneTenseBlock,
        infinitive,
        conjugationList,
        tense
    ) {
        let str = ''; // for debugging
        newConjugationsForOneTenseBlock.classList.add(tense);

        let tenseElement = newConjugationsForOneTenseBlock.querySelector(".tense");
        tenseElement.textContent = VerbTenseResolver.getTenseByFolder(tense);

        let templateInputElement = /** @type {HTMLTemplateElement} */
            (document.getElementById("template-input"))
                .content.firstElementChild;

        for (let pronoun in conjugationList) {
            // while debugging to check if all congugations typed properly
            str += pronoun;
            if (pronoun.slice(-1) != "'") str += ' ';
            str += conjugationList[pronoun] + ".\n";

            let newInputBlock = /** @type {HTMLElement} */
                (templateInputElement.cloneNode(true));

            this.fillInputBlock(
                newInputBlock,
                infinitive,
                pronoun,
                conjugationList[pronoun],
                tense
            );

            newConjugationsForOneTenseBlock.append(newInputBlock);
        } // for (let pronoun in conjugationList)

        return str;
    }

    /**
     * @param {HTMLElement} newInputBlock
     * @param {string} infinitive
     * @param {string} pronoun
     * @param {string} verb
     * @param {string} fileFolder
     */
    static fillInputBlock(newInputBlock, infinitive, pronoun, verb, fileFolder) {
        let labelElement = /** @type {HTMLLabelElement} */
            (newInputBlock.querySelector(".pronoun"));
        labelElement.textContent = pronoun;
        labelElement.title = verb;

        let id = (pronoun + verb).replace(/\s+/g, '');

        labelElement.htmlFor = id;
        let inputElement = newInputBlock.querySelector("input");
        inputElement.id = id;
        inputElement.setAttribute('data-verb-tense', fileFolder);
        inputElement.pattern = verb;
        inputElement.onblur = (/** @type Event */event) => {
            const inputElement = /** @type {HTMLInputElement} */ (event.target);
            inputElement.value = inputElement.value.trim();
        }

        /** @type HTMLElement */
        let speakerPhoneElement = newInputBlock.querySelector(".speakerphone");
        let audioFullFileName = Resolver.AUDIO_BASE_PATH +
            Utils.getAudioFileUrl(infinitive, fileFolder, 'json');
        let jsonIndex = (pronoun + ' ' + verb).replace(/' /g, "'"); // compare: "J'aurai" vs "Tu aura"

        SpeakerPhone.init(speakerPhoneElement, fileFolder, audioFullFileName, jsonIndex);

        return newInputBlock;
    } // static fillInputBlock(newInputBlock, pronoun, verb)


    /**
     * @param {string} title
     */
    static getVerbTenseListFromTitleOrCheckboxes(title) {
        let verbTenseList = [];

        if (VerbTenseResolver.map[title] !== undefined) {
            // checkboxes are invisible so figure out tense from title 
            // (which is taken from query search string)
            verbTenseList.push(VerbTenseResolver.map[title].folder);
        } else {
            document.querySelectorAll('.verb-tense-checkbox').forEach((checkboxElement) => {
                if (!(checkboxElement instanceof HTMLInputElement)) {
                    console.error("Element with selector '.verb-tense-checkbox' must be of type HTMLInputElement but it's of type:");
                    console.error(Utils.getType(checkboxElement));
                } else if (checkboxElement.checked) {
                    verbTenseList.push(checkboxElement.getAttribute('name'));
                }
            });
        }

        return verbTenseList;
    }

}
