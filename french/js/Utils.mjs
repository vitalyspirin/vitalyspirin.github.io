// Author: Vitaly Spirin

"use strict";

export default class Utils {
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
            minute: '2-digit',
            hour12: true
        });

        return formattedDate;
    }

    static timestampToTime(timestamp) {
        const timestampInSeconds = Math.floor(timestamp / 1000);

        const hours = Math.floor(timestampInSeconds / 3600);
        const minutes = Math.floor((timestampInSeconds - hours * 3600) / 60);
        const seconds = Math.floor(timestampInSeconds - hours * 3600 - minutes * 60);

        let formattedTime = '';
        if (hours > 0) {
            formattedTime = String(hours).padStart(2, '0') + ':';
        }
        formattedTime += String(minutes).padStart(2, '0') + ':';
        formattedTime += String(seconds).padStart(2, '0');

        return formattedTime;
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

    static getElementById(id) {
        const element = document.getElementById(id);

        if (!(element instanceof HTMLElement)) {
            console.error('HTML element with id "' + id + '" has not been found.');
        }

        return element;
    }
}