// Author: Vitaly Spirin

"use strict";

import verbsInPresentTense, { audioFileFolder as audioFileFolderForPresentTense } from './conjugations/verbsInPresentTense.mjs';
import verbsInPresentPerfectTense, { audioFileFolder as audioFileFolderForPresentPerfectTense } from './conjugations/verbsInPresentPerfectTense.mjs';
import verbsInImperfectTense, { audioFileFolder as audioFileFolderForImperfectTense } from './conjugations/verbsInImperfectTense.mjs';
import verbsInFutureTense, { audioFileFolder as audioFileFolderForFutureTense } from './conjugations/verbsInFutureTense.mjs';
import verbsInImperativeTense, { audioFileFolder as audioFileFolderForImperativeTense } from './conjugations/verbsInImperativeTense.mjs';
import verbsInPastPerfectTense, { audioFileFolder as audioFileFolderForPastPerfectTense } from './conjugations/verbsInPastPerfectTense.mjs';
import verbsInConditionalPresentTense, { audioFileFolder as audioFileFolderForConditionalPresentTense } from './conjugations/verbsInConditionalPresentTense.mjs';
import verbsInPresentSubjunctiveTense, { audioFileFolder as audioVerbsInPresentSubjunctiveTense } from './conjugations/verbsInPresentSubjunctiveTense.mjs';
import verbsInConditionalPerfectTense, { audioFileFolder as audioFileFolderForConditionalPerfectTense } from './conjugations/verbsInConditionalPerfectTense.mjs';


export class Resolver {
    static map = {
        'Le présent': {
            folder: audioFileFolderForPresentTense,
            verbList: verbsInPresentTense
        },
        'Le passé composé': {
            folder: audioFileFolderForPresentPerfectTense,
            verbList: verbsInPresentPerfectTense
        },
        "L'imparfait": {
            folder: audioFileFolderForImperfectTense,
            verbList: verbsInImperfectTense
        },
        'Le futur simple': {
            folder: audioFileFolderForFutureTense,
            verbList: verbsInFutureTense
        },
        'Le plus-que-parfait': {
            folder: audioFileFolderForPastPerfectTense,
            verbList: verbsInPastPerfectTense
        },
        'Le conditionnel présent': {
            folder: audioFileFolderForConditionalPresentTense,
            verbList: verbsInConditionalPresentTense
        },
        'Le conditionnel passé': {
            folder: audioFileFolderForConditionalPerfectTense,
            verbList: verbsInConditionalPerfectTense
        },
        "Le subjonctif présent": {
            folder: audioVerbsInPresentSubjunctiveTense,
            verbList: verbsInPresentSubjunctiveTense
        },
        "L'impératif": {
            folder: audioFileFolderForImperativeTense,
            verbList: verbsInImperativeTense
        }
    };

    /**
     * @param {string} folder
     */
    static getTenseByFolder(folder) {
        let result = null;

        for (let tense in this.map) {
            if (this.map[tense].folder == folder) {
                result = tense;
                break;
            }
        }

        return result;
    }

    static getURLEncodedTenseByFolder(folder) {
        let result = encodeURIComponent(this.getTenseByFolder(folder)).replace(/'/g, '%27');

        return result;
    }

}
