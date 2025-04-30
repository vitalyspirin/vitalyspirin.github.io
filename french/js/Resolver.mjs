// Author: Vitaly Spirin

"use strict";

import verbsInPresentTense, { audioFileFolder as audioFileFolderForPresentTense } from './verbsInPresentTense.mjs';
import verbsInFutureTense, { audioFileFolder as audioFileFolderForFutureTense } from './verbsInFutureTense.mjs';
import verbsInImperfectTense, { audioFileFolder as audioFileFolderForImperfectTense } from './verbsInImperfectTense.mjs';
import verbsInPresentPerfectTense, { audioFileFolder as audioFileFolderForPresentPerfectTense } from './verbsInPresentPerfectTense.mjs';
import verbsInConditionalPresentTense, { audioFileFolder as audioFileFolderForConditionalPresentTense } from './verbsInConditionalPresentTense.mjs';
import verbsInConditionalPerfectTense, { audioFileFolder as audioFileFolderForConditionalPerfectTense } from './verbsInConditionalPerfectTense.mjs';


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
        'Le conditionnel présent': {
            folder: audioFileFolderForConditionalPresentTense,
            verbList: verbsInConditionalPresentTense
        },
        'Le conditionnel passé': {
            folder: audioFileFolderForConditionalPerfectTense,
            verbList: verbsInConditionalPerfectTense
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
}
