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
        "noun-number.html": "pdf/noun-gender-number.pdf",
        "conjugations.html?Le%20pr%C3%A9sent": "pdf/present.pdf",
        "present.html": "pdf/present.pdf",
        "devoir-pouvoir-falloir-vouloir.html": "../pdf/devoir-pouvoir-falloir-vouloir.pdf",
        "meteo.html": "pdf/meteo.pdf",
        "calendar.html": "pdf/calendar.pdf",
        "mon-ton-son.html": "pdf/mon-ton-son.pdf",
        "de-du-des.html": "pdf/de-du-des.pdf",
        "ce-ces-cet.html": "pdf/ce-ces-cet.pdf",
        "quand-comment-combien.html": "pdf/quand-comment-combien.pdf",
        "conjugations.html?Le%20pass%C3%A9%20compos%C3%A9": "pdf/present-perfect.pdf",
        "present-perfect.html": "pdf/present-perfect.pdf",
        "qui-quel-quelle.html": "pdf/qui-quel-quelle.pdf",
        "au-en.html": "pdf/au-en.doc.html",

        // A2
        "aller-venir.html": "pdf/aller-venir.doc.html",
        "noun-gender.html": "pdf/noun-gender-number.pdf",
        "noun-gender-2.html": "pdf/noun-gender-2.pdf",
        "avoir-etre.html": "../pdf/avoir-etre.pdf",
        "adjective-position.html": "pdf/adjective-position.pdf",
        "adjective-gender.html": "pdf/adjective-gender-number.pdf",
        "adjective-number.html": "pdf/adjective-gender-number.pdf",
        "il-est.html": "pdf/il-est.pdf",
        "mien-sien.html": "pdf/mon-ton-son.pdf",
        "conjugations.html?L%27imparfait": "pdf/imperfect.pdf",
        "imperfect.html": "pdf/imperfect.pdf",
        "concordance.html": "pdf/concordance-2.pdf",
        "conjugations.html?Le%20futur%20simple": "pdf/future.pdf",
        "future.html": "pdf/future.pdf",
        "time-prepositions.html": "pdf/time-prepositions.pdf",
        "qui-que.html": "pdf/qui-que.pdf",
        "lui-leur.html": "pdf/lui-leur.pdf",
        "negation.html": "pdf/negation.pdf",
        "conjugations.html?L%27imp%C3%A9ratif": "pdf/imperative.pdf",
        "imperative.html": "pdf/imperative.pdf",

        // B1
        "negation-2.html": "pdf/negation.pdf",
        "ceci-cela-celui.html": "pdf/ce-ces-cet.pdf",
        "y-en.html": "pdf/y-en.pdf",
        "tout.html": "pdf/tout.pdf",
        "que-dont.html": "pdf/que-dont.pdf",
        "qui-que-dont-ou.html": "pdf/qui-que-dont-ou.pdf",
        "conjugations.html?Le%20plus-que-parfait": "pdf/plus-que-parfait.pdf",
        "past-perfect.html": "pdf/plus-que-parfait.pdf",
        "concordance-3.html": "pdf/concordance-3.pdf",
        "conjugations.html?Le%20conditionnel%20pr%C3%A9sent": "pdf/conditional-present.pdf",
        "conditional-present.html": "pdf/conditional-present.pdf",
        "savoir-connaitre.html": "pdf/savoir-connaitre.pdf",
        "amener-emmener.html": "pdf/amener-emmener.pdf",
        "verbs_and_prepositions.html": "pdf/verbs_and_prepositions.doc.html",
        "manquer-penser-servir-jouer.html": "pdf/verbs_and_prepositions.doc.html",
        "conjugations.html?Le%20subjonctif%20pr%C3%A9sent": "pdf/present-subjunctive.pdf",
        "present-subjunctive.html": "pdf/present-subjunctive.pdf",

        // B2
        "noun-gender-3.html": "pdf/noun-gender-2.pdf",
        "ce-qui-ce-que.html": "pdf/ce-qui-ce-que.pdf",
        "dont-duquel.html": "pdf/dont-duquel.pdf",
        "lequel-duquel-auquel.html": "pdf/lequel-duquel-auquel.pdf",
        "conjugations.html?Le%20subjonctif%20pass%C3%A9": "pdf/present-subjunctive.pdf",
        "present-perfect-subjunctive.html": "pdf/present-subjunctive.pdf",
        "conjugations.html?Le%20conditionnel%20pass%C3%A9": "pdf/conditional-perfect.pdf",
        "conditional-perfect.html": "pdf/conditional-perfect.pdf",
        "concordance-conditional.html": "pdf/concordance-conditional.pdf",
        "passive.html": "../pdf/passive.pdf",
        "conjugations.html?Le%20futur%20ant%C3%A9rieur": "pdf/future-perfect.pdf",
        "future-perfect.html": "pdf/future-perfect.pdf",
        "concordance-future.html": "pdf/concordance-future.pdf",
        "concordance-simultaneity-posteriority-anteriority.html": "pdf/concordance-simultaneity-posteriority-anteriority.pdf"
    };

    /**
     * @param {string} page
     * @return {string|undefined}
     */
    static getInfoLinkForPage(page) {
        if (!Object.hasOwn(this.infoForPages, page)) {
            console.error('There is no Info Link for page "' + page + '"');
        }

        return this.basePathForInfoLink + Resolver.infoForPages[page];
    }

    /**
     * @param {string?} folder
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
