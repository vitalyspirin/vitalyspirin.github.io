// Author: Vitaly Spirin

"use strict";

import { Resolver } from './Resolver.mjs';
import { Utils } from './Utils.mjs';

export class PageBuilderForManyTenses {
    static getVerbList() {
        let verbMixedConjugationList = {};

        for (let tense in Resolver.map) {
            for (let infinitive in Resolver.map[tense].verbList) {

                if (!verbMixedConjugationList.hasOwnProperty(infinitive)) {
                    verbMixedConjugationList[infinitive] = {};
                }

                if (!verbMixedConjugationList[infinitive].hasOwnProperty(Resolver.map[tense].fileFolder)) {
                    verbMixedConjugationList[infinitive][Resolver.map[tense].folder] = {};
                }

                verbMixedConjugationList[infinitive][Resolver.map[tense].folder] =
                    Resolver.map[tense].verbList[infinitive];
            }
        }

        return verbMixedConjugationList;
    }


    static getVerbTenseList() {
        let verbTenseList = [];
        document.querySelectorAll('.verb-tense-checkbox').forEach((checkboxElement) => {
            if (!(checkboxElement instanceof HTMLInputElement)) {
                console.error("Element with selector '.verb-tense-checkbox' must be of type HTMLInputElement but it's of type:");
                console.error(Utils.getType(checkboxElement));
            } else if (checkboxElement.checked) {
                verbTenseList.push(checkboxElement.getAttribute('name'));
            }
        });

        return verbTenseList;
    }

    static buildForManyTenses(verbMixedConjugationList, title) {

        let tenseList = this.getVerbTenseList();

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

        let templateVerbBlock = document.getElementById("template-verb-block")
            // @ts-ignore
            .content.firstElementChild;
        let templateConjugationsForOneTenseBlock = document.getElementById("template-conjugations-for-one-tense-block")
            // @ts-ignore
            .content.firstElementChild;

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
                this.fillConjugationsForOneTenseBlock(
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

        //console.log(str); // use Spell Checker to find spelling errors
    } // static build()

    static fillConjugationsForOneTenseBlock(
        newConjugationsForOneTenseBlock,
        infinitive,
        conjugationList,
        tense
    ) {
        newConjugationsForOneTenseBlock.classList.add(tense);

        let tenseElement = newConjugationsForOneTenseBlock.querySelector(".tense");
        tenseElement.textContent = Resolver.getTenseByFolder(tense);

        let templateInputElement = document.getElementById("template-input")
            // @ts-ignore
            .content.firstElementChild;

        for (let pronoun in conjugationList) {
            let newInputBlock = templateInputElement.cloneNode(true);

            this.fillInputBlock(
                newInputBlock,
                infinitive,
                pronoun,
                conjugationList[pronoun],
                tense
            );

            newConjugationsForOneTenseBlock.append(newInputBlock);
        } // for (let pronoun in verbsInPresentTense[infinitive])

    }

    static fillInputBlock(newInputBlock, infinitive, pronoun, verb, fileFolder) {
        let labelElement = newInputBlock.querySelector(".pronoun");
        labelElement.textContent = pronoun;
        labelElement.title = verb;

        let id = (pronoun + verb).replace(/\s+/g, '');;

        labelElement.htmlFor = id;
        let inputElement = newInputBlock.querySelector("input");
        inputElement.id = id;
        inputElement.setAttribute('data-verb-tense', fileFolder);
        inputElement.pattern = verb;
        inputElement.onblur = function (event) {
            event.target.value = event.target.value.trim();
        }

        let speakerPhoneElement = newInputBlock.querySelector(".speakerphone");

        speakerPhoneElement.onclick = async function (event) {
            let audioElement = event.currentTarget.getElementsByTagName("audio")[0];

            if (audioElement.src == '') {
                let fullFileName = Utils.getAudioFileUrl(infinitive, fileFolder, 'json');

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

} // class Page
