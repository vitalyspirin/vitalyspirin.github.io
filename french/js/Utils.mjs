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

    static timestampToDate(timestamp) {
        let theDate = new Date(timestamp);

        let formattedDate = theDate.toLocaleString("en-CA", {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });

        return formattedDate;
    }

    static timestampToDateAndTime(timestamp) {
        let theDate = new Date(timestamp);

        let formattedDate = theDate.toLocaleString("en-CA", {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hourCycle: 'h24',
            hour: '2-digit',
            minute: '2-digit'
        });

        return formattedDate;

    }
}