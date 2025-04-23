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


    static buildForManyTenses(verbMixedConjugationList, title, numberOfTensesPerVerb = 0) {
        document.title = title;
        document.getElementById("page-title").textContent = title;

        let verbListBlock = document.getElementById("verb-list");

        let templateVerbBlock = document.getElementById("template-verb-block")
            // @ts-ignore
            .content.firstElementChild;
        let templateConjugationsForOneTenseBlock = document.getElementById("template-conjugations-for-one-tense-block")
            // @ts-ignore
            .content.firstElementChild;

        let counter = 1;
        let str = ''; // for debugging

        for (let infinitive in verbMixedConjugationList) {

            if (Object.keys(verbMixedConjugationList[infinitive]).length < numberOfTensesPerVerb) continue;

            let verbBlock = templateVerbBlock.cloneNode(true);

            let infinitiveElement = verbBlock.querySelector(".infinitive");
            infinitiveElement.textContent = counter + ' - ' + infinitive;
            counter++;

            for (let tense in verbMixedConjugationList[infinitive]) {
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
