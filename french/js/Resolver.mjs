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


    static infoForPages = {
        "conjugations.html?Le%20pr%C3%A9sent": "pdf/present.pdf",
        "exercise_present.html": "pdf/present.pdf",

        "exercise_devoir_pouvoir_falloir_vouloir.html": "pdf/devoir_pouvoir_falloir_vouloir.pdf",

        "exercise_mon_ton_son.html": "pdf/mon_ton_son.pdf",
        "exercise_mien_sien.html": "pdf/mon_ton_son.pdf",
        "exercise_de_du_des.html": "pdf/de_du_des.pdf",
        "exercise_ce_ces_cet.html": "pdf/ce_ces_cet.pdf",

        "exercise_qui_quel_quelle.html": "pdf/qui_quel_quelle.pdf",

        "exercise_quand_comment_combien.html": "pdf/quand_comment_combien.pdf",

        "conjugations.html?Le%20pass%C3%A9%20compos%C3%A9": "pdf/presentperfect.pdf",
        "exercise_presentperfect.html": "pdf/presentperfect.pdf",

        "conjugations.html?L%27imparfait": "pdf/imperfect.pdf",
        "exercise_imperfect.html": "pdf/imperfect.pdf",

        "conjugations.html?Le%20futur%20simple": "pdf/future.pdf",
        "exercise_future.html": "pdf/future.pdf",

        "conjugations.html?L%27imp%C3%A9ratif": "pdf/imperative.pdf",
        "exercise_imperative.html": "pdf/imperative.pdf",

        "exercise_avoir_etre.html": "pdf/avoir_etre.pdf",
        "conjugations.html?Le%20plus-que-parfait": "pdf/plus-que-parfait.pdf",
        "exercise_pastperfect.html": "pdf/plus-que-parfait.pdf",

        "conjugations.html?Le%20conditionnel%20pr%C3%A9sent": "pdf/conditionalpresent.pdf",
        "exercise_conditionalpresent.html": "pdf/conditionalpresent.pdf",

        "conjugations.html?Le%20subjonctif%20pr%C3%A9sent": "pdf/presentsubjunctive.pdf",
        "exercise_presentsubjunctive.html": "pdf/presentsubjunctive.pdf",
        "conjugations.html?Le%20subjonctif%20pass%C3%A9": "pdf/presentsubjunctive.pdf",
        "exercise_presentperfectsubjunctive.html": "../pdf/presentsubjunctive.pdf",

        "conjugations.html?Le%20conditionnel%20pass%C3%A9": "pdf/conditionalperfect.pdf",
        "exercise_conditionalperfect.html": "pdf/conditionalperfect.pdf",

        "conjugations.html?Le%20futur%20ant%C3%A9rieur": "pdf/futureperfect.pdf",
        "exercise_futureperfect.html": "pdf/futureperfect.pdf",

        "exercise_concordance.html": "pdf/concordance2.pdf",
        "exercise_concordance3.html": "pdf/concordance3.pdf",
        "exercise_passive.html": "pdf/passive.pdf",
        "exercise_concordance_conditional.html": "pdf/concordance_conditional.pdf",
        "exercise_concordance_future.html": "pdf/concordance_future.pdf",

        "exercise_genre.html": "../pdf/genre_nombre.pdf",
        "exercise_nombre.html": "../pdf/genre_nombre.pdf",
        "exercise_adjectives.html": "../pdf/adjectives.pdf",
        "exercise_il_est.html": "../pdf/il_est.pdf",
        "exercise_time_prepositions.html": "pdf/time_prepositions.pdf",
        "exercise_y_en.html": "pdf/y_en.pdf",
        "exercise_qui_que.html": "pdf/qui_que.pdf",
        "exercise_ceci_cela_celui.html": "pdf/ce_ces_cet.pdf",
        "exercise_lui_leur.html": "pdf/lui_leur.pdf",
        "exercise_negation.html": "pdf/negation.pdf",
        "exercise_tout.html": "../pdf/tout.pdf",
        "exercise_que_dont.html": "pdf/que_dont.pdf",
        "exercise_qui_que_dont_ou.html": "pdf/qui_que_dont_ou.pdf",
        "exercise_savoir_connaitre.html": "../pdf/savoir_connaitre.pdf",
        "exercise_amener_emmener.html": "../pdf/amener_emmener.pdf"
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
