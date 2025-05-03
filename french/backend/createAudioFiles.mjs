// Author: Vitaly Spirin
//
// run with command: node  --experimental-modules createAudioFiles.mjs

"use strict";

// @ts-ignore
import { exec } from 'child_process';

import { PageBuilder } from '../js/PageBuilder.mjs';
import { AudioFile } from './AudioFile.mjs';
import verbsInPresentTense from '../js/verbsInPresentTense.mjs';
import verbsInFuturTense from '../js/verbsInFutureTense.mjs';
import verbsInImperfectTense from '../js/verbsInImperfectTense.mjs';
import verbsInPresentPerfectTense from '../js/verbsInPresentPerfectTense.mjs';
import verbsInConditionalPresentTense from '../js/verbsInConditionalPresentTense.mjs';
import verbsInConditionalPerfectTense from '../js/verbsInConditionalPerfectTense.mjs';

import { audioFileFolder as audioFileFolderForPresentTense } from '../js/verbsInPresentTense.mjs';
import { audioFileFolder as audioFileFolderForFutureTense } from '../js/verbsInFutureTense.mjs';
import { audioFileFolder as audioFileFolderForImperfectTense } from '../js/verbsInImperfectTense.mjs';
import { audioFileFolder as audioFileFolderForPresentPerfectTense } from '../js/verbsInPresentPerfectTense.mjs';
import { audioFileFolder as audioFileFolderForConditionalPresentTense } from '../js/verbsInConditionalPresentTense.mjs';
import { audioFileFolder as audioFileFolderForConditionalPerfectTense } from '../js/verbsInConditionalPerfectTense.mjs';


//saveAudioFilesForVerbList(verbsInPresentTense, audioFileFolderForPresentTense);

//saveAudioFilesForVerbList(verbsInFuturTense, audioFileFolderForFutureTense);

//saveAudioFilesForVerbList(verbsInImperfectTense, audioFileFolderForImperfectTense);

//saveAudioFilesForVerbList(verbsInPresentPerfectTense, audioFileFolderForPresentPerfectTense);



//saveAudioFilesBase64ForVerbList(verbsInPresentTense, audioFileFolderForPresentTense);
//saveAudioFilesBase64ForVerbList(verbsInFuturTense, audioFileFolderForFutureTense);
//saveAudioFilesBase64ForVerbList(verbsInConditionalPresentTense, audioFileFolderForConditionalPresentTense);
saveAudioFilesBase64ForVerbList(verbsInConditionalPerfectTense, audioFileFolderForConditionalPerfectTense);
//saveAudioFilesBase64ForVerbList(verbsInImperfectTense, audioFileFolderForImperfectTense);
//saveAudioFilesBase64ForVerbList(verbsInPresentPerfectTense, audioFileFolderForPresentPerfectTense);


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

        let audioFileName = saveAudioFilesBase64ForInfinitive(
            infinitive,
            verbList[infinitive],
            fileFolder
        );

        console.log(audioFileName);
        counter++;
    }

    console.log("\n" + counter + ' files saved.');
}

function saveAudioFilesBase64ForInfinitive(infinitive, conjugationList, fileFolder) {
    const audioFile = new AudioFile();

    for (let pronoun in conjugationList) {
        let audioStr = pronoun;

        if (pronoun.slice(-1) != "'") {
            audioStr += ' '; // compare: "J'aurai" vs "Tu aura"
        }

        audioStr += conjugationList[pronoun];

        audioFile.addString(audioStr);
    }

    const audioFileName = '../' + PageBuilder.getAudioFileUrl(infinitive, fileFolder, 'json');

    audioFile.save(audioFileName);

    return audioFileName;
}

function saveAudioFileForStr(audioStr, fileFolder) {
    let url = getGoogleTranslateAudioUrl(audioStr);
    let audioFileName = '../' + PageBuilder.getAudioFileUrl(audioStr, fileFolder);
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
        total: '1',
        idx: '0',
        textlen: String(text.length),
        client: 'tw-ob',
        prev: 'input',
        ttsspeed: slow ? '0.24' : '1',
    };
    let searchParams = new URLSearchParams(paramsObj);

    let url = host + '/translate_tts?' + searchParams.toString();

    return url;
}
