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

    /** @type Record<string, string> */
    static infoForPages = {
        // A1
        "exercise_noun_number.html": "../pdf/noun-gender-number.pdf",
        "conjugations.html?Le%20pr%C3%A9sent": "../pdf/present.pdf",
        "exercise_present.html": "../pdf/present.pdf",
        "exercise_devoir_pouvoir_falloir_vouloir.html": "../../pdf/devoir-pouvoir-falloir-vouloir.pdf",
        "exercise_meteo.html": "../pdf/meteo.pdf",
        "exercise_calendar.html": "../pdf/calendar.pdf",
        "exercise_mon_ton_son.html": "../pdf/mon-ton-son.pdf",
        "exercise_de_du_des.html": "../pdf/de-du-des.pdf",
        "exercise_ce_ces_cet.html": "../pdf/ce-ces-cet.pdf",
        "exercise_quand_comment_combien.html": "../pdf/quand-comment-combien.pdf",
        "conjugations.html?Le%20pass%C3%A9%20compos%C3%A9": "../pdf/present-perfect.pdf",
        "exercise_presentperfect.html": "../pdf/present-perfect.pdf",
        "exercise_qui_quel_quelle.html": "../pdf/qui-quel-quelle.pdf",

        // A2
        "exercise_noun_gender.html": "../pdf/noun-gender-number.pdf",
        "exercise-noun-gender2.html": "../pdf/noun-gender-2.pdf",
        "exercise_avoir_etre.html": "../../pdf/avoir-etre.pdf",
        "exercise_adjective_position.html": "../pdf/adjective-position.pdf",
        "exercise_adjective_gender.html": "../pdf/adjective-gender-number.pdf",
        "exercise_adjective_number.html": "../pdf/adjective-gender-number.pdf",
        "exercise_il_est.html": "../pdf/il-est.pdf",
        "exercise_mien_sien.html": "../pdf/mon-ton-son.pdf",
        "conjugations.html?L%27imparfait": "../pdf/imperfect.pdf",
        "exercise_imperfect.html": "../pdf/imperfect.pdf",
        "exercise_concordance.html": "../pdf/concordance-2.pdf",
        "conjugations.html?Le%20futur%20simple": "../pdf/future.pdf",
        "exercise_future.html": "../pdf/future.pdf",
        "exercise_time_prepositions.html": "../pdf/time-prepositions.pdf",
        "exercise_qui_que.html": "../pdf/qui-que.pdf",
        "exercise_lui_leur.html": "../pdf/lui-leur.pdf",
        "exercise_negation.html": "../pdf/negation.pdf",
        "conjugations.html?L%27imp%C3%A9ratif": "../pdf/imperative.pdf",
        "exercise_imperative.html": "../pdf/imperative.pdf",

        // B1
        "exercise_negation2.html": "../pdf/negation.pdf",
        "exercise_ceci_cela_celui.html": "../pdf/ce-ces-cet.pdf",
        "exercise_y_en.html": "../pdf/y-en.pdf",
        "exercise_tout.html": "../pdf/tout.pdf",
        "exercise_que_dont.html": "../pdf/que-dont.pdf",
        "exercise_qui_que_dont_ou.html": "../pdf/qui-que-dont-ou.pdf",
        "conjugations.html?Le%20plus-que-parfait": "../pdf/plus-que-parfait.pdf",
        "exercise_pastperfect.html": "../pdf/plus-que-parfait.pdf",
        "exercise_concordance3.html": "../pdf/concordance-3.pdf",
        "conjugations.html?Le%20conditionnel%20pr%C3%A9sent": "../pdf/conditional-present.pdf",
        "exercise_conditionalpresent.html": "../pdf/conditional-present.pdf",
        "exercise_savoir_connaitre.html": "../pdf/savoir-connaitre.pdf",
        "exercise_amener_emmener.html": "../pdf/amener-emmener.pdf",
        "conjugations.html?Le%20subjonctif%20pr%C3%A9sent": "../pdf/present-subjunctive.pdf",
        "exercise_presentsubjunctive.html": "../pdf/present-subjunctive.pdf",

        // B2
        "exercise-noun-gender-3.html": "../pdf/noun-gender-2.pdf",
        "exercise_ce_qui_ce_que.html": "../pdf/ce-qui-ce-que.pdf",
        "exercise_dont_duquel.html": "../pdf/dont_duquel.pdf",
        "conjugations.html?Le%20subjonctif%20pass%C3%A9": "../pdf/present-subjunctive.pdf",
        "exercise_presentperfectsubjunctive.html": "../pdf/present-subjunctive.pdf",
        "conjugations.html?Le%20conditionnel%20pass%C3%A9": "../pdf/conditional-perfect.pdf",
        "exercise_conditionalperfect.html": "../pdf/conditional-perfect.pdf",
        "exercise_concordance_conditional.html": "../pdf/concordance-conditional.pdf",
        "exercise_passive.html": "../../pdf/passive.pdf",
        "conjugations.html?Le%20futur%20ant%C3%A9rieur": "../pdf/future-perfect.pdf",
        "exercise_futureperfect.html": "../pdf/future-perfect.pdf",
        "exercise_concordance_future.html": "../pdf/concordance-future.pdf",

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
