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

    static timestampToTime(timestamp) {
        let theDate = new Date(timestamp);

        let formattedDate = theDate.toLocaleString("en-CA", {
            minute: '2-digit',
            second: '2-digit'
        });

        return formattedDate;
    }

    static getWeek(dateStr) {
        const date = new Date(dateStr);

        const a = new Date(date.getFullYear(), 0, 1);
        const b = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const millisec = Number(b) - Number(a);

        return Math.ceil((millisec / 86400000 + 1 + a.getDay()) / 7);
    }

    static getType(object) {
        return Object.prototype.toString.apply(object);
    }
}