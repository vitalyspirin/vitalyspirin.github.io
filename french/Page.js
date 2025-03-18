// Author: Vitaly Spirin

"use strict";

import verbsInPresentTense from './verbsInPresentTense.js';
import verbsInFuturTense from './verbsInFutureTense.js';
import verbsInImperfectTense from './verbsInImperfectTense.js';

export class Page {
    static getVerbList(param) {
        let verbList;

        switch (param) {
            case '?L%27imparfait':
                verbList = verbsInImperfectTense;
                break;

            case '?Le%20futur%20simple':
                verbList = verbsInFuturTense;
                break;

            case '?Le%20pr%C3%A9sent':
            default:
                verbList = verbsInPresentTense;
        }

        return verbList;
    }


    static build(verbList, title) {
        document.getElementById("page-title").textContent = title;

        document.getElementById("number-of-verbs").textContent =
            Object.keys(verbList).length;

        let verbListBlock = document.getElementById("verb-list");

        let templateVerbBlock = document.getElementById("template-verb-block")
            .content.firstElementChild;
        let templateInputElement = document.getElementById("template-input")
            .content.firstElementChild;


        let counter = 1;
        let str = ''; // for debugging

        for (let infinitive in verbList) {
            let verbBlock = templateVerbBlock.cloneNode(true);

            let infinitiveElement = verbBlock.querySelector(".infinitive");
            infinitiveElement.textContent = counter + ' - ' + infinitive;
            counter++;

            for (let pronoun in verbList[infinitive]) {

                let newInputBlock = templateInputElement.cloneNode(true);
                let labelElement = newInputBlock.querySelector(".pronoun");
                labelElement.textContent = pronoun;
                labelElement.title = verbList[infinitive][pronoun];

                // while debugging to check if all congugations typed properly
                str += pronoun;
                if (pronoun.slice(-1) != "'") str += ' ';
                str += verbList[infinitive][pronoun] + ".\n";

                let id = (pronoun +
                    verbList[infinitive][pronoun]).replace(/\s+/g, '');;

                labelElement.htmlFor = id;
                let inputElement = newInputBlock.querySelector("input");
                inputElement.id = id;
                inputElement.pattern = verbList[infinitive][pronoun];
                inputElement.onblur = function (event) {
                    event.target.value = event.target.value.trim();
                }

                verbBlock.append(newInputBlock);
            } // for (let pronoun in verbsInPresentTense[infinitive])
            verbListBlock.append(verbBlock);
        } // for (let infinitive in verbsInPresentTense)

        //console.log(str);
    } // static build()

} // class Page
