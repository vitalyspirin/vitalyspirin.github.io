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
import verbsInPresentPerfectSubjunctiveTense, { audioFileFolder as audioVerbsInPresentPerfectSubjunctiveTense } from './conjugations/verbsInPresentPerfectSubjunctiveTense.mjs';
import verbsInConditionalPerfectTense, { audioFileFolder as audioFileFolderForConditionalPerfectTense } from './conjugations/verbsInConditionalPerfectTense.mjs';
import verbsInFuturePerfectTense, { audioFileFolder as audioFileFolderForFuturePerfectTense } from './conjugations/verbsInFuturePerfectTense.mjs';


export class Resolver {
    static AUDIO_BASE_PATH = '../';

    /** @type Record<string, {folder: string, verbList: any}> */
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
        'Le futur antérieur': {
            folder: audioFileFolderForFuturePerfectTense,
            verbList: verbsInFuturePerfectTense
        },
        "Le subjonctif présent": {
            folder: audioVerbsInPresentSubjunctiveTense,
            verbList: verbsInPresentSubjunctiveTense
        },
        "Le subjonctif passé": {
            folder: audioVerbsInPresentPerfectSubjunctiveTense,
            verbList: verbsInPresentPerfectSubjunctiveTense
        },
        "L'impératif": {
            folder: audioFileFolderForImperativeTense,
            verbList: verbsInImperativeTense
        }
    };

    static basePathForInfoLink = '../../../';

    /** @type Record<string, string> */
    static infoForPages = {
        // A1
        "noun-number.html": this.basePathForInfoLink + "pdf/noun-gender-number.pdf",
        "conjugations.html?Le%20pr%C3%A9sent": this.basePathForInfoLink + "pdf/present.pdf",
        "present.html": this.basePathForInfoLink + "pdf/present.pdf",
        "devoir-pouvoir-falloir-vouloir.html": this.basePathForInfoLink + "../pdf/devoir-pouvoir-falloir-vouloir.pdf",
        "meteo.html": this.basePathForInfoLink + "pdf/meteo.pdf",
        "calendar.html": this.basePathForInfoLink + "pdf/calendar.pdf",
        "mon-ton-son.html": this.basePathForInfoLink + "pdf/mon-ton-son.pdf",
        "de-du-des.html": this.basePathForInfoLink + "pdf/de-du-des.pdf",
        "ce-ces-cet.html": this.basePathForInfoLink + "pdf/ce-ces-cet.pdf",
        "quand-comment-combien.html": this.basePathForInfoLink + "pdf/quand-comment-combien.pdf",
        "conjugations.html?Le%20pass%C3%A9%20compos%C3%A9": this.basePathForInfoLink + "pdf/present-perfect.pdf",
        "present-perfect.html": this.basePathForInfoLink + "pdf/present-perfect.pdf",
        "qui-quel-quelle.html": this.basePathForInfoLink + "pdf/qui-quel-quelle.pdf",

        // A2
        "noun-gender.html": this.basePathForInfoLink + "pdf/noun-gender-number.pdf",
        "noun-gender-2.html": this.basePathForInfoLink + "pdf/noun-gender-2.pdf",
        "avoir-etre.html": this.basePathForInfoLink + "../pdf/avoir-etre.pdf",
        "adjective-position.html": this.basePathForInfoLink + "pdf/adjective-position.pdf",
        "adjective-gender.html": this.basePathForInfoLink + "pdf/adjective-gender-number.pdf",
        "adjective-number.html": this.basePathForInfoLink + "pdf/adjective-gender-number.pdf",
        "il-est.html": this.basePathForInfoLink + "pdf/il-est.pdf",
        "mien-sien.html": this.basePathForInfoLink + "pdf/mon-ton-son.pdf",
        "conjugations.html?L%27imparfait": this.basePathForInfoLink + "pdf/imperfect.pdf",
        "imperfect.html": this.basePathForInfoLink + "pdf/imperfect.pdf",
        "concordance.html": this.basePathForInfoLink + "pdf/concordance-2.pdf",
        "conjugations.html?Le%20futur%20simple": this.basePathForInfoLink + "pdf/future.pdf",
        "future.html": this.basePathForInfoLink + "pdf/future.pdf",
        "time-prepositions.html": this.basePathForInfoLink + "pdf/time-prepositions.pdf",
        "qui-que.html": this.basePathForInfoLink + "pdf/qui-que.pdf",
        "lui-leur.html": this.basePathForInfoLink + "pdf/lui-leur.pdf",
        "negation.html": this.basePathForInfoLink + "pdf/negation.pdf",
        "conjugations.html?L%27imp%C3%A9ratif": this.basePathForInfoLink + "pdf/imperative.pdf",
        "imperative.html": this.basePathForInfoLink + "pdf/imperative.pdf",

        // B1
        "negation-2.html": this.basePathForInfoLink + "pdf/negation.pdf",
        "ceci-cela-celui.html": this.basePathForInfoLink + "pdf/ce-ces-cet.pdf",
        "y-en.html": this.basePathForInfoLink + "pdf/y-en.pdf",
        "tout.html": this.basePathForInfoLink + "pdf/tout.pdf",
        "que-dont.html": this.basePathForInfoLink + "pdf/que-dont.pdf",
        "qui-que-dont-ou.html": this.basePathForInfoLink + "pdf/qui-que-dont-ou.pdf",
        "conjugations.html?Le%20plus-que-parfait": this.basePathForInfoLink + "pdf/plus-que-parfait.pdf",
        "past-perfect.html": this.basePathForInfoLink + "pdf/plus-que-parfait.pdf",
        "concordance-3.html": this.basePathForInfoLink + "pdf/concordance-3.pdf",
        "conjugations.html?Le%20conditionnel%20pr%C3%A9sent": this.basePathForInfoLink + "pdf/conditional-present.pdf",
        "conditional-present.html": this.basePathForInfoLink + "pdf/conditional-present.pdf",
        "savoir-connaitre.html": this.basePathForInfoLink + "pdf/savoir-connaitre.pdf",
        "amener-emmener.html": this.basePathForInfoLink + "pdf/amener-emmener.pdf",
        "conjugations.html?Le%20subjonctif%20pr%C3%A9sent": this.basePathForInfoLink + "pdf/present-subjunctive.pdf",
        "present-subjunctive.html": this.basePathForInfoLink + "pdf/present-subjunctive.pdf",

        // B2
        "noun-gender-3.html": this.basePathForInfoLink + "pdf/noun-gender-2.pdf",
        "ce-qui-ce-que.html": this.basePathForInfoLink + "pdf/ce-qui-ce-que.pdf",
        "dont-duquel.html": this.basePathForInfoLink + "pdf/dont-duquel.pdf",
        "lequel-duquel-auquel.html": this.basePathForInfoLink + "pdf/lequel-duquel-auquel.pdf",
        "conjugations.html?Le%20subjonctif%20pass%C3%A9": this.basePathForInfoLink + "pdf/present-subjunctive.pdf",
        "present-perfect-subjunctive.html": this.basePathForInfoLink + "pdf/present-subjunctive.pdf",
        "conjugations.html?Le%20conditionnel%20pass%C3%A9": this.basePathForInfoLink + "pdf/conditional-perfect.pdf",
        "conditional-perfect.html": this.basePathForInfoLink + "pdf/conditional-perfect.pdf",
        "concordance-conditional.html": this.basePathForInfoLink + "pdf/concordance-conditional.pdf",
        "passive.html": this.basePathForInfoLink + "../pdf/passive.pdf",
        "conjugations.html?Le%20futur%20ant%C3%A9rieur": this.basePathForInfoLink + "pdf/future-perfect.pdf",
        "future-perfect.html": this.basePathForInfoLink + "pdf/future-perfect.pdf",
        "concordance-future.html": this.basePathForInfoLink + "pdf/concordance-future.pdf",
        "concordance-simultaneity-posteriority-anteriority.html": this.basePathForInfoLink + "pdf/concordance-simultaneity-posteriority-anteriority.pdf"
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

    /**
     * @param {string} folder
     * @return {string}
     */
    static getURLEncodedTenseByFolder(folder) {
        let result = encodeURIComponent(this.getTenseByFolder(folder)).replace(/'/g, '%27');

        return result;
    }

}
