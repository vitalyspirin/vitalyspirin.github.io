// Author: Vitaly Spirin

"use strict";

import verbsInPresentTense, { audioFileFolder } from './verbsInPresentTense.mjs';
import verbsInFuturTense from './verbsInFutureTense.mjs';
import verbsInImperfectTense from './verbsInImperfectTense.mjs';
import verbsInPresentPerfectTense from './verbsInPresentPerfectTense.mjs';

import { audioFileFolder as audioFileFolderForPresentTense } from './verbsInPresentTense.mjs';
import { audioFileFolder as audioFileFolderForFutureTense } from './verbsInFutureTense.mjs';
import { audioFileFolder as audioFileFolderForImperfectTense } from './verbsInImperfectTense.mjs';
import { audioFileFolder as audioFileFolderForPresentPerfectTense } from './verbsInPresentPerfectTense.mjs';

export class Page {
    static getVerbList(param) {
        let verbList;
        let fileFolder;

        switch (param) {
            case '?Le%20pass%C3%A9%20compos%C3%A9':
                verbList = verbsInPresentPerfectTense;
                fileFolder = audioFileFolderForPresentPerfectTense;
                break;

            case '?L%27imparfait':
                verbList = verbsInImperfectTense;
                fileFolder = audioFileFolderForImperfectTense;
                break;

            case '?Le%20futur%20simple':
                verbList = verbsInFuturTense;
                fileFolder = audioFileFolderForFutureTense;
                break;

            case '?Le%20pr%C3%A9sent':
            default:
                verbList = verbsInPresentTense;
                fileFolder = audioFileFolderForPresentTense;
        }

        const result = { verbList: verbList, fileFolder: fileFolder };

        return result;
    }


    static build(verbList, fileFolder, title) {
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
                // while debugging to check if all congugations typed properly
                str += pronoun;
                if (pronoun.slice(-1) != "'") str += ' ';
                str += verbList[infinitive][pronoun] + ".\n";

                let newInputBlock = templateInputElement.cloneNode(true);

                this.fillInputBlock(
                    newInputBlock,
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

    static fillInputBlock(newInputBlock, pronoun, verb, fileFolder) {
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

        speakerPhoneElement.onclick = function (event) {
            let audioElement = event.currentTarget.getElementsByTagName("audio")[0];
            audioElement.src = Page.getAudioFileUrl(pronoun + ' ' + verb, fileFolder);

            audioElement.play();
        }

        return newInputBlock;
    } // static fillInputBlock(newInputBlock, pronoun, verb)


    static getAudioFileUrl(str, fileFolder) {
        const path = '../audio/' + fileFolder + '/';
        return path + this.removeSpecialChars(str) + '.mp3';
    };

    static removeSpecialChars(str) {
        return str.replace(/\s+|\'/g, '');
    }
} // class Page
