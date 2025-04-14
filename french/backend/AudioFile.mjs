// Author: Vitaly Spirin

"use strict";

import * as fs from 'fs';


export class AudioFile {
    stringList = [];

    addString(str) {
        this.stringList.push(str);
    }

    async save(fileName) {
        let textForFile = "{\n";

        for (let i = 0; i < this.stringList.length; i++) {
            textForFile += '"' + this.stringList[i] + '": "';
            textForFile += await this.constructor.getAudioBase64(this.stringList[i]);
            textForFile += '"';

            if (i < this.stringList.length - 1) { // don't add for the last element
                textForFile += ',';
            }
        }

        textForFile += "\n}";

        this.constructor.writeToFile(textForFile, fileName);

    } // function save(fileName)


    static async getAudioBase64(str) {
        const result = fetch(this.getGoogleTranslateAudioUrl(str))
            .then((response) => {
                if (response.status === 200) {
                    return this.blobToBase64(response.blob(), response.headers.get("Content-Type"))
                } else {
                    throw new Error("Something went wrong on API server!");
                }
            })
            .catch((error) => {
                console.error(error);
            });

        return result;
    } // function getAudioBase64(text)


    static blobToBase64(blobPromise, contentType) {
        return blobPromise
            .then((blob) => blob.arrayBuffer())
            .then((arrayBuffer) =>
                'data:' + contentType + ';base64,' + Buffer.from(arrayBuffer).toString('base64')
            );
    }

    static writeToFile(str, fileName) {
        fs.writeFileSync(fileName, str);
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
    static getGoogleTranslateAudioUrl(
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

} // class AudioFile
