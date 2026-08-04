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
import verbsInPastHistoricTense, { audioFileFolder as audioFileFolderForPastHistoricTense } from './conjugations/verbsInPastHistoricTense.mjs';
import { Resolver } from './Resolver.mjs';

/** 
 * @typedef {Record<string, string>} ConjugationsForOneVerb
 * 
 * Example: {J': 'achèterais', Tu: 'achèterais', Il: 'achèterait', Nous: 'achèterions', Vous: 'achèteriez', …}
 */

export default class VerbTenseResolver {

    /**
     * @param {string[]} tenseList
     */
    static getVerbList(tenseList) {
        /** 
         * @type Record<string, Record<string, ConjugationsForOneVerb>> 
         * 
         * Example: 
         *  {Acheter: 
         *      conditionalpresent: {J': 'achèterais', Tu: 'achèterais', Il: 'achèterait', Nous: 'achèterions', Vous: 'achèteriez', …}
         *      future: {J': 'achèterai', Tu: 'achèteras', Il: 'achètera', Nous: 'achèterons', Vous: 'achèterez', …}
         *  Achever: 
         *      conditionalpresent: {J': 'achèverais', Tu: 'achèverais', Il: 'achèverait', Nous: 'achèverions', Vous: 'achèveriez', …}
         *      future: {J': 'achèverai', Tu: 'achèveras', Il: 'achèvera', Nous: 'achèverons', Vous: 'achèverez', …}
         */
        let verbMixedConjugationList = {};

        tenseList.forEach((tense) => {
            let tenseName = this.getTenseByFolder(tense);

            let folderVerbListObj = this.map[tenseName];
            for (let infinitive in folderVerbListObj.verbList) {

                if (!verbMixedConjugationList.hasOwnProperty(infinitive)) {
                    verbMixedConjugationList[infinitive] = {};
                }

                // if (!verbMixedConjugationList[infinitive].hasOwnProperty(folderVerbListObj.folder)) {
                //     verbMixedConjugationList[infinitive][folderVerbListObj.folder] = {};
                // }

                verbMixedConjugationList[infinitive][folderVerbListObj.folder] =
                    folderVerbListObj.verbList[infinitive];
            }
        });

        return verbMixedConjugationList;
    }

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
        },
        "Le passé simple": {
            folder: audioFileFolderForPastHistoricTense,
            verbList: verbsInPastHistoricTense
        }
    };

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
