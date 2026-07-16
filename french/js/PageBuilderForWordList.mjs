// Author: Vitaly Spirin

"use strict";

import HtmlHelper from './HtmlHelper.mjs';
import { Resolver } from './Resolver.mjs';
import { SpeakerPhone } from './SpeakerPhone.mjs';
import Types from './Types.mjs';
import Utils from './Utils.mjs';

export default class PageBuilderForWordList {

    /**
     * @param {Record<string, {article: string, level: string}>} wordListStructure 
     * @param {string} fileFolder 
     */
    static build(wordListStructure, fileFolder) {
        const wordList = document.getElementById('word-list');

        let templateBlock = Types.assertType(
            document.getElementById('template-li-for-one-word'),
            HTMLTemplateElement
        ).content.firstElementChild;

        for (let word in wordListStructure) {
            let worldLiBlock = templateBlock.cloneNode(true);

            worldLiBlock.classList.add(wordListStructure[word].level);

            let wordElement = worldLiBlock.querySelector('[title="article"]');
            wordElement.textContent = word;
            wordElement.setAttribute('title', wordListStructure[word].article);

            worldLiBlock.querySelectorAll('input')
                .forEach((/** @type {HTMLInputElement} */ inputElement) => {
                    inputElement.setAttribute('name', word);
                    if (inputElement.value === wordListStructure[word].article) {
                        inputElement.setAttribute('required', 'required');
                    }
                });

            /** @type HTMLElement */
            let speakerPhoneElement = worldLiBlock.querySelector(".speakerphone");
            let audioFullFileName = Resolver.AUDIO_BASE_PATH +
                Utils.getAudioFileUrl(word, fileFolder, 'mp3');

            SpeakerPhone.init(speakerPhoneElement, audioFullFileName);

            wordList.append(worldLiBlock);
        };

        HtmlHelper.randomizeLiList(wordList);
    }

}
