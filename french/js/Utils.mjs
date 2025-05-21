// Author: Vitaly Spirin

"use strict";

export class Utils {
    static getAudioFileUrl(str, fileFolder, extention = 'mp3') {
        let result;

        switch (extention) {
            case 'mp3':
                result = '../audio/' + fileFolder + '/' +
                    this.removeSpecialChars(str) + '.' + extention;
                break;

            case 'json':
                result = '../audio/' + fileFolder + '/' +
                    this.removeSpecialChars(str) + '_' + fileFolder + '.' + extention;
                break;

            default: throw new Error('Uknown extention: "' + extention + '"');
        }

        return result;
    };

    static removeSpecialChars(str) {
        return str.replace(/\s+|\'/g, '');
    }

}