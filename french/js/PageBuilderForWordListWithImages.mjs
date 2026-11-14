// Author: Vitaly Spirin

"use strict";

import HtmlHelper from './HtmlHelper.mjs';
import { Resolver } from './Resolver.mjs';
import { SpeakerPhone } from './SpeakerPhone.mjs';
import Utils from './Utils.mjs';

export default class PageBuilderForWordListWithImages {

    /**
     * @param {Record<string, {article: string, category: string, scale?: number}>} wordListObject 
     * @param {string} wordListRootElementClassName 
     * @param {string} imageFileFolder 
     * @param {string} audiofileFolder 
     */
    static build(
        wordListObject,
        wordListRootElementClassName,
        imageFileFolder,
        audiofileFolder
    ) {
        const wordListRootElement = document.querySelector(`.${wordListRootElementClassName}`);

        let templateBlock = /** @type {HTMLTemplateElement} */ (
            document.getElementById('template-li-for-one-word')
        ).content.firstElementChild;

        for (let word in wordListObject) {
            if (wordListObject[word].category !== wordListRootElementClassName) continue;

            let worldLiBlock = /** @type {HTMLElement} */ (templateBlock.cloneNode(true));

            worldLiBlock.classList.add(wordListObject[word].category);

            let imageElement = /** @type {HTMLImageElement} */ (worldLiBlock.querySelector('img'));
            let wordInputElement = /** @type {HTMLInputElement} */ (worldLiBlock.querySelector('input[type="text"]'));

            let titleHint;
            if (wordListObject[word].article.slice(-1) === "'") {
                titleHint = wordListObject[word].article + word;
            } else {
                titleHint = wordListObject[word].article + ' ' + word;
            }
            wordInputElement.pattern = titleHint;

            imageElement.setAttribute('title', titleHint);
            imageElement.setAttribute('alt', word);
            imageElement.setAttribute('src', Resolver.IMAGE_BASE_PATH + imageFileFolder + '/' + word + '.svg');
            if (Object.hasOwn(wordListObject[word], 'scale')) {
                imageElement.style.transform = `scale(${wordListObject[word].scale})`;
            }

            /** @type HTMLElement */
            let speakerPhoneElement = worldLiBlock.querySelector(".speakerphone");
            let audioFullFileName = Resolver.AUDIO_BASE_PATH +
                Utils.getAudioFileUrl(word, audiofileFolder, 'mp3');

            SpeakerPhone.init(
                speakerPhoneElement,
                '', // for ErrorCounter.getErrorCounterObj('')
                audioFullFileName
            );

            wordListRootElement.append(worldLiBlock);
        };
    }

}
