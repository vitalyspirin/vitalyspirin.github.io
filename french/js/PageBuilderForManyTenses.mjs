// Author: Vitaly Spirin

"use strict";

import { Resolver } from './Resolver.mjs';
import Types from './Types.mjs';
import Utils from './Utils.mjs';

export class PageBuilderForManyTenses {
    /** 
     * @typedef {Record<string, string>} ConjugationsForOneVerb
     * 
     * Example: {J': 'achèterais', Tu: 'achèterais', Il: 'achèterait', Nous: 'achèterions', Vous: 'achèteriez', …}
     */

    /**
     * @param {string[]} tenseList
     */
    static getVerbList(tenseList) {
        /** 
         * @type Record<string, Record<string, ConjugationsForOneVerb>> 
         * 
         * Example: 
         *  {Acheter: 
         *      conditionalpresent: {J': 'achèterais', Tu: 'achèterais', Il: 'achèterait', Nous: 'achèterions', Vous: 'achèteriez', …}
         *      future: {J': 'achèterai', Tu: 'achèteras', Il: 'achètera', Nous: 'achèterons', Vous: 'achèterez', …}
         *  Achever: 
         *      conditionalpresent: {J': 'achèverais', Tu: 'achèverais', Il: 'achèverait', Nous: 'achèverions', Vous: 'achèveriez', …}
         *      future: {J': 'achèverai', Tu: 'achèveras', Il: 'achèvera', Nous: 'achèverons', Vous: 'achèverez', …}
         */
        let verbMixedConjugationList = {};

        tenseList.forEach((tense) => {
            let tenseName = Resolver.getTenseByFolder(tense);

            let folderVerbListObj = Resolver.map[tenseName];
            for (let infinitive in folderVerbListObj.verbList) {

                if (!verbMixedConjugationList.hasOwnProperty(infinitive)) {
                    verbMixedConjugationList[infinitive] = {};
                }

                // if (!verbMixedConjugationList[infinitive].hasOwnProperty(folderVerbListObj.folder)) {
                //     verbMixedConjugationList[infinitive][folderVerbListObj.folder] = {};
                // }

                verbMixedConjugationList[infinitive][folderVerbListObj.folder] =
                    folderVerbListObj.verbList[infinitive];
            }
        });

        return verbMixedConjugationList;
    }

    /**
     * @param {string} title
     */
    static getVerbTenseList(title) {
        let verbTenseList = [];

        if (Resolver.map[title] !== undefined) {
            // checkboxes are invisible so figure out tense from title 
            // (which is taken from query search string)
            verbTenseList.push(Resolver.map[title].folder);
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

    /**
     * @param {string} title
     */
    static buildForManyTenses(title) {
        const tenseList = this.getVerbTenseList(title);
        const verbMixedConjugationList = this.getVerbList(tenseList);

        let verbListBlock = document.getElementById("verb-list");
        verbListBlock.textContent = '';
        if (tenseList.length === 1) {
            verbListBlock.className = 'one-tense-only';
            title = Resolver.getTenseByFolder(tenseList[0]);
        } else {
            verbListBlock.className = '';
        }

        document.title = title;
        document.getElementById("page-title").textContent = title;

        let templateVerbBlock = Types.assertType(
            document.getElementById("template-verb-block"),
            HTMLTemplateElement
        ).content.firstElementChild;

        let templateConjugationsForOneTenseBlock = Types.assertType(
            document.getElementById("template-conjugations-for-one-tense-block"),
            HTMLTemplateElement
        ).content.firstElementChild;

        let counter = 1;
        let str = ''; // for debugging

        for (let infinitive in verbMixedConjugationList) {

            let infinitiveHasAllTensesInTheList = tenseList.every(tense =>
                Object.keys(verbMixedConjugationList[infinitive]).includes(tense)
            );

            if (!infinitiveHasAllTensesInTheList) continue;

            let verbBlock = templateVerbBlock.cloneNode(true);

            let infinitiveElement = verbBlock.querySelector(".infinitive");
            infinitiveElement.textContent = counter + ' - ' + infinitive;
            counter++;

            for (let tense in verbMixedConjugationList[infinitive]) {
                if (!tenseList.includes(tense)) continue;

                let newConjugationsForOneTenseBlock = templateConjugationsForOneTenseBlock.cloneNode(true);
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
     * @param {HTMLElement} newConjugationsForOneTenseBlock
     * @param {string} infinitive
     * @param {ConjugationsForOneVerb} conjugationList
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
        tenseElement.textContent = Resolver.getTenseByFolder(tense);

        let templateInputElement = Types.assertType(
            document.getElementById("template-input"),
            HTMLTemplateElement
        ).content.firstElementChild;

        for (let pronoun in conjugationList) {
            // while debugging to check if all congugations typed properly
            str += pronoun;
            if (pronoun.slice(-1) != "'") str += ' ';
            str += conjugationList[pronoun] + ".\n";

            let newInputBlock = templateInputElement.cloneNode(true);

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
        let labelElement = Types.assertType(
            newInputBlock.querySelector(".pronoun"), HTMLLabelElement);
        labelElement.textContent = pronoun;
        labelElement.title = verb;

        let id = (pronoun + verb).replace(/\s+/g, '');;

        labelElement.htmlFor = id;
        let inputElement = newInputBlock.querySelector("input");
        inputElement.id = id;
        inputElement.setAttribute('data-verb-tense', fileFolder);
        inputElement.pattern = verb;
        inputElement.onblur = (/** @type Event */event) => {
            const inputElement = Types.assertType(event.target, HTMLInputElement);
            inputElement.value = inputElement.value.trim();
        }

        /** @type HTMLElement */
        let speakerPhoneElement = newInputBlock.querySelector(".speakerphone");

        speakerPhoneElement.onclick = async (/** @type Event */event) => {
            let audioElement = Types.assertType(event.currentTarget, HTMLElement)
                .getElementsByTagName("audio")[0];

            if (audioElement.src == '') {
                let fullFileName = Resolver.AUDIO_BASE_PATH + Utils.getAudioFileUrl(infinitive, fileFolder, 'json');

                const response = await fetch(fullFileName)
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const json = await response.json();

                let ind = pronoun;
                if (ind.slice(-1) != "'") {
                    ind += ' '; // compare: "J'aurai" vs "Tu aura"
                }
                ind += verb;

                audioElement.src = json[ind];
            }

            audioElement.play();
        }

        return newInputBlock;
    } // static fillInputBlock(newInputBlock, pronoun, verb)

}
