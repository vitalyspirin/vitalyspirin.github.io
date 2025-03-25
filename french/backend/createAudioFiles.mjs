// Author: Vitaly Spirin
//
// run with command: node  --experimental-modules createAudioFiles.mjs

"use strict";

import { exec } from 'child_process';

import { Page } from '../Page.mjs';
import verbsInPresentTense from '../verbsInPresentTense.mjs';
import verbsInFuturTense from '../verbsInFutureTense.mjs';
import verbsInImperfectTense from '../verbsInImperfectTense.mjs';
import verbsInPresentPerfectTense from '../verbsInPresentPerfectTense.mjs';

import { audioFileFolder as audioFileFolderForPresentTense } from '../verbsInPresentTense.mjs';
import { audioFileFolder as audioFileFolderForFutureTense } from '../verbsInFutureTense.mjs';
import { audioFileFolder as audioFileFolderForImperfectTense } from '../verbsInImperfectTense.mjs';
import { audioFileFolder as audioFileFolderForPresentPerfectTense } from '../verbsInPresentPerfectTense.mjs';



//saveAudioFilesForVerbList(verbsInPresentTense, audioFileFolderForPresentTense);

//saveAudioFilesForVerbList(verbsInFuturTense, audioFileFolderForFutureTense);

//saveAudioFilesForVerbList(verbsInImperfectTense, audioFileFolderForImperfectTense);

saveAudioFilesForVerbList(verbsInPresentPerfectTense, audioFileFolderForPresentPerfectTense);


function saveAudioFilesForVerbList(verbList, fileFolder) {
    for (let infinitive in verbList) {
        for (let pronoun in verbList[infinitive]) {
            let audioStr = pronoun + ' ' + verbList[infinitive][pronoun];
            let url = getGoogleTranslateAudioUrl(audioStr);
            let audioFileName = Page.getAudioFileUrl(audioStr, fileFolder);
            let cmdCommand = 'wget -q -U Mozilla -O ' + audioFileName + ' "' + url + '"';

            exec(cmdCommand, (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    return;
                }
                //console.log(`stdout: ${stdout}`);
            })
            //    return;
        }
    }
}




/**
 * Idea taken from https://github.com/zlargon/google-tts/blob/master/src/getAudioUrl.ts
 * 
* Generate "Google TTS" audio URL
*
* @param {string}   text         length should be less than 200 characters
* @param {string?}  lang  default is "fr"
* @param {string?}  host  default is "https://translate.google.com"
* @return {string} url
*/
function getGoogleTranslateAudioUrl(
    text,
    lang = 'fr',
    host = 'https://translate.google.com',
    slow = false
) {

    if (text.length > 200) {
        throw new RangeError(
            `text length (${text.length}) should be less than 200 characters.`
        );
    }

    let paramsObj = {
        ie: 'UTF-8',
        q: text,
        tl: lang,
        total: 1,
        idx: 0,
        textlen: text.length,
        client: 'tw-ob',
        prev: 'input',
        ttsspeed: slow ? 0.24 : 1,
    };
    let searchParams = new URLSearchParams(paramsObj);

    let url = host + '/translate_tts?' + searchParams.toString();

    return url;
};
