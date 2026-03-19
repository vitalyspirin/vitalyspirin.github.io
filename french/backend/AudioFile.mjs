// Author: Vitaly Spirin

"use strict";

// @ts-ignore
import * as fs from 'fs';
import GoogleTranslateAudio from './GoogleTranslateAudio.mjs';


export default class AudioFile {
    stringList = [];

    addString(str) {
        this.stringList.push(str);
    }

    async save(fileName) {
        let textForFile = "{\n";

        for (let i = 0; i < this.stringList.length; i++) {
            textForFile += '"' + this.stringList[i] + '": "';
            // @ts-ignore
            textForFile += await GoogleTranslateAudio.getAudioBase64(this.stringList[i]);
            textForFile += '"';

            if (i < this.stringList.length - 1) { // don't add for the last element
                textForFile += ",\n";
            }
        }

        textForFile += "\n}";

        // @ts-ignore
        this.constructor.writeToFile(textForFile, fileName);

    } // function save(fileName)


    static writeToFile(str, fileName) {
        fs.writeFileSync(fileName, str);
    }

} // class AudioFile
