// Author: Vitaly Spirin

"use strict";


export default class GoogleTranslateAudio {

    static async getAudioBase64(str) {

        // Google Translate reads words beginning with é as "E accent aigu" (unless
        // there is an apostrophe infront of it)
        str = str.replace(" é", "'é");

        const result = fetch(this.getAudioUrl(str))
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
                // @ts-ignore
                'data:' + contentType + ';base64,' + Buffer.from(arrayBuffer).toString('base64')
            );
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
    static getAudioUrl(
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
        // @ts-ignore
        let searchParams = new URLSearchParams(paramsObj);

        let url = host + '/translate_tts?' + searchParams.toString();

        return url;
    };

}
