// Author: Vitaly Spirin
//
// run with command: node  --experimental-modules createAudioFiles.mjs

"use strict";

import { exec } from 'child_process';

import { Page } from '../js/Page.mjs';
import { AudioFile } from './AudioFile.mjs';
import verbsInPresentTense from '../js/verbsInPresentTense.mjs';
import verbsInFuturTense from '../js/verbsInFutureTense.mjs';
import verbsInImperfectTense from '../js/verbsInImperfectTense.mjs';
import verbsInPresentPerfectTense from '../js/verbsInPresentPerfectTense.mjs';
import verbsInConditionalPresentTense from '../js/verbsInConditionalPresentTense.mjs';

import { audioFileFolder as audioFileFolderForPresentTense } from '../js/verbsInPresentTense.mjs';
import { audioFileFolder as audioFileFolderForFutureTense } from '../js/verbsInFutureTense.mjs';
import { audioFileFolder as audioFileFolderForImperfectTense } from '../js/verbsInImperfectTense.mjs';
import { audioFileFolder as audioFileFolderForPresentPerfectTense } from '../js/verbsInPresentPerfectTense.mjs';
import { audioFileFolder as audioFileFolderForConditionalPresentTense } from '../js/verbsInConditionalPresentTense.mjs';


//saveAudioFilesForVerbList(verbsInPresentTense, audioFileFolderForPresentTense);

//saveAudioFilesForVerbList(verbsInFuturTense, audioFileFolderForFutureTense);

//saveAudioFilesForVerbList(verbsInImperfectTense, audioFileFolderForImperfectTense);

//saveAudioFilesForVerbList(verbsInPresentPerfectTense, audioFileFolderForPresentPerfectTense);

//saveAudioFilesBase64ForVerbList(verbsInConditionalPresentTense, audioFileFolderForConditionalPresentTense);

saveAudioFilesBase64ForVerbList(verbsInPresentTense, audioFileFolderForPresentTense);

//saveAudioFilesBase64ForVerbList(verbsInFuturTense, audioFileFolderForFutureTense);


function saveAudioFilesForVerbList(verbList, fileFolder) {
    for (let infinitive in verbList) {
        for (let pronoun in verbList[infinitive]) {
            let audioStr = pronoun;

            if (pronoun.slice(-1) != "'") {
                audioStr += ' '; // compare: "J'aurai" vs "Tu aura"
            }

            audioStr += verbList[infinitive][pronoun];

            saveAudioFileForStr(audioStr, fileFolder);
        }
    }
}

function saveAudioFilesBase64ForVerbList(verbList, fileFolder) {
    let counter = 0;
    for (let infinitive in verbList) {
        let audioFile = new AudioFile();

        for (let pronoun in verbList[infinitive]) {
            let audioStr = pronoun;

            if (pronoun.slice(-1) != "'") {
                audioStr += ' '; // compare: "J'aurai" vs "Tu aura"
            }

            audioStr += verbList[infinitive][pronoun];

            audioFile.addString(audioStr);
        }

        let audioFileName = '../' + Page.getAudioFileUrl(infinitive, fileFolder, 'json');

        console.log(audioFileName);
        audioFile.save(audioFileName);
        counter++;
    }

    console.log("\n" + counter + ' files saved.');
}

function saveAudioFileForStr(audioStr, fileFolder) {
    let url = getGoogleTranslateAudioUrl(audioStr);
    let audioFileName = '../' + Page.getAudioFileUrl(audioStr, fileFolder);
    let cmdCommand = 'wget -q -U Mozilla -O ' + audioFileName + ' "' + url + '"';

    exec(cmdCommand, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(audioFileName);
        //console.log(`stdout: ${stdout}`);
    })
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
}
