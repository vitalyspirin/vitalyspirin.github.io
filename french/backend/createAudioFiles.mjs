// Author: Vitaly Spirin
//
// run with command: node  --experimental-modules createAudioFiles.mjs

"use strict";

// @ts-ignore
import { exec } from 'child_process';

import Utils from '../js/Utils.mjs';
import AudioFile from './AudioFile.mjs';

import verbsInPresentTense from '../js/conjugations/verbsInPresentTense.mjs';
import verbsInFuturTense from '../js/conjugations/verbsInFutureTense.mjs';
import verbsInImperativeTense from '../js/conjugations/verbsInImperativeTense.mjs';
import verbsInImperfectTense from '../js/conjugations/verbsInImperfectTense.mjs';
import verbsInPresentPerfectTense from '../js/conjugations/verbsInPresentPerfectTense.mjs';
import verbsInConditionalPresentTense from '../js/conjugations/verbsInConditionalPresentTense.mjs';
import verbsInConditionalPerfectTense from '../js/conjugations/verbsInConditionalPerfectTense.mjs';
import verbsInPresentSubjunctiveTense from '../js/conjugations/verbsInPresentSubjunctiveTense.mjs';
import verbsInFuturePerfectTense from '../js/conjugations/verbsInFuturePerfectTense.mjs';

import { audioFileFolder as audioFileFolderForPresentTense } from '../js/conjugations/verbsInPresentTense.mjs';
import { audioFileFolder as audioFileFolderForFutureTense } from '../js/conjugations/verbsInFutureTense.mjs';
import { audioFileFolder as audioFileFolderForImperativeTense } from '../js/conjugations/verbsInImperativeTense.mjs';
import { audioFileFolder as audioFileFolderForImperfectTense } from '../js/conjugations/verbsInImperfectTense.mjs';
import { audioFileFolder as audioFileFolderForPresentPerfectTense } from '../js/conjugations/verbsInPresentPerfectTense.mjs';
import verbsInPastPerfectTense, { audioFileFolder as audioFileFolderForPastPerfectTense } from '../js/conjugations/verbsInPastPerfectTense.mjs';
import { audioFileFolder as audioFileFolderForConditionalPresentTense } from '../js/conjugations/verbsInConditionalPresentTense.mjs';
import { audioFileFolder as audioFileFolderForConditionalPerfectTense } from '../js/conjugations/verbsInConditionalPerfectTense.mjs';
import { audioFileFolder as audioFileFolderForPresentSubjunctiveTense } from '../js/conjugations/verbsInPresentSubjunctiveTense.mjs';
import { audioFileFolder as audioFileFolderForFuturePerfectTense } from '../js/conjugations/verbsInFuturePerfectTense.mjs';

//saveAudioFilesForVerbList(verbsInPresentTense, audioFileFolderForPresentTense);
//saveAudioFilesForVerbList(verbsInFuturTense, audioFileFolderForFutureTense);
//saveAudioFilesForVerbList(verbsInImperfectTense, audioFileFolderForImperfectTense);
//saveAudioFilesForVerbList(verbsInPresentPerfectTense, audioFileFolderForPresentPerfectTense);


//saveAudioFilesBase64ForVerbList(verbsInPresentTense, audioFileFolderForPresentTense);
//saveAudioFilesBase64ForVerbList(verbsInFuturTense, audioFileFolderForFutureTense);
// saveAudioFilesBase64ForVerbList(verbsInPastPerfectTense, audioFileFolderForPastPerfectTense);
//saveAudioFilesBase64ForVerbList(verbsInConditionalPresentTense, audioFileFolderForConditionalPresentTense);
//saveAudioFilesBase64ForVerbList(verbsInConditionalPerfectTense, audioFileFolderForConditionalPerfectTense);
//saveAudioFilesBase64ForVerbList(verbsInImperfectTense, audioFileFolderForImperfectTense);
//saveAudioFilesBase64ForVerbList(verbsInPresentPerfectTense, audioFileFolderForPresentPerfectTense);
// saveAudioFilesBase64ForVerbList(verbsInImperativeTense, audioFileFolderForImperativeTense);
// saveAudioFilesBase64ForVerbList(verbsInPresentSubjunctiveTense, audioFileFolderForPresentSubjunctiveTense);
// saveAudioFilesBase64ForVerbList(verbsInFuturePerfectTense, audioFileFolderForFuturePerfectTense);

saveAudioFilesBase64ForInfinitive("S'asseoir", verbsInPresentSubjunctiveTense["S'asseoir"], audioFileFolderForPresentSubjunctiveTense);

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

        saveAudioFilesBase64ForInfinitive(
            infinitive,
            verbList[infinitive],
            fileFolder
        );

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

        if (!(typeof conjugationList[pronoun] == "string")) {
            console.error('The following must be of type "string" but it is of type "' +
                Utils.getType(conjugationList[pronoun]) + '" :');
            console.error(conjugationList[pronoun]);
            console.error();
        } else {
            audioStr += conjugationList[pronoun];
            audioFile.addString(audioStr);
        }
    }

    const audioFileName = Utils.getAudioFileUrl(infinitive, fileFolder, 'json');
    audioFile.save(audioFileName);
    console.log(audioFileName);

    return audioFileName;
}

function saveAudioFileForStr(audioStr, fileFolder) {
    let url = getGoogleTranslateAudioUrl(audioStr);
    let audioFileName = Utils.getAudioFileUrl(audioStr, fileFolder);
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
