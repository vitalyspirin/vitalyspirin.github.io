// Author: Vitaly Spirin

"use strict";

import { Utils } from './Utils.mjs';

export class PageBuilder {

    static buildForOneTense(verbList, fileFolder, title) {
        document.title = title;
        document.getElementById("page-title").textContent = title;

        document.getElementById("number-of-verbs").textContent =
            String(Object.keys(verbList).length);

        let verbListBlock = document.getElementById("verb-list");

        let templateVerbBlock = document.getElementById("template-verb-block")
            // @ts-ignore
            .content.firstElementChild;
        let templateInputElement = document.getElementById("template-input")
            // @ts-ignore
            .content.firstElementChild;


        let counter = 1;
        let str = ''; // for debugging

        for (let infinitive in verbList) {
            let verbBlock = templateVerbBlock.cloneNode(true);

            let infinitiveElement = verbBlock.querySelector(".infinitive");
            infinitiveElement.textContent = counter + ' - ' + infinitive;
            counter++;

            for (let pronoun in verbList[infinitive]) {
                // while debugging to check if all congugations typed properly
                str += pronoun;
                if (pronoun.slice(-1) != "'") str += ' ';
                str += verbList[infinitive][pronoun] + ".\n";

                let newInputBlock = templateInputElement.cloneNode(true);

                this.fillInputBlock(
                    newInputBlock,
                    infinitive,
                    pronoun,
                    verbList[infinitive][pronoun],
                    fileFolder
                );

                verbBlock.append(newInputBlock);
            } // for (let pronoun in verbsInPresentTense[infinitive])
            verbListBlock.append(verbBlock);
        } // for (let infinitive in verbsInPresentTense)

        //console.log(str); // use Spell Checker to find spelling errors
    } // static build()

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
