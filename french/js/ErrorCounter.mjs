// Author: Vitaly Spirin

"use strict";

export class ErrorCounter {
    static timestamp;
    static numberOfCompleted = 0;
    static numberOfAllInputElements;

    static initialize() {
        const inputElementList = document.getElementsByTagName('input');

        for (const inputElement of inputElementList) {
            inputElement.addEventListener("focusout", this.focusOutEventHandler);
        }

        this.numberOfAllInputElements = inputElementList.length;
        this.timestamp = Date.now();

        this.showStats();
    }

    static focusOutEventHandler(event) {
        if (!(event.target instanceof HTMLInputElement)) return;

        if (!event.target.checkValidity()) {
            const errorCounterElement = document.getElementById('number-of-errors');
            let errorCounter = Number(errorCounterElement.innerText);
            errorCounter++;
            errorCounterElement.textContent = String(errorCounter);
            event.target.removeEventListener("focusout", ErrorCounter.focusOutEventHandler);

            if (ErrorCounter.numberOfCompleted > ErrorCounter.numberOfAllInputElements / 2) {
                ErrorCounter.saveCounter(errorCounter);
            }
        } else if (event.target.value != '') {
            ErrorCounter.numberOfCompleted++;
        }

    }

    static saveCounter(errorCounter) {
        let stats = this.retrieveStats();
        stats[this.timestamp] = errorCounter;
        localStorage.setItem(this.getStorageKey(), JSON.stringify(stats));
    }

    static retrieveStats() {
        let stats;

        const storageValue = localStorage.getItem(this.getStorageKey());
        if (storageValue == null) {
            stats = {};
        } else {
            stats = JSON.parse(storageValue);
        }

        return stats;
    }

    static showStats() {
        const template = document.getElementById('template-stats-line')

        if (!(template instanceof HTMLTemplateElement)) return;
        const statsLineElement = template.content.firstElementChild;

        const stats = this.retrieveStats();
        const keys = Object.keys(stats).reverse();

        keys.forEach((key) => {
            let newStateLineElement = statsLineElement.cloneNode();
            document.getElementById('stats').appendChild(newStateLineElement);
            let theDate = new Date(Number(key));

            let formattedDate = theDate.getFullYear() + '-' + theDate.getMonth() + '-' +
                theDate.getDate() + ' ' + theDate.getHours() + ':' + theDate.getMinutes();

            newStateLineElement.textContent = formattedDate + ': ' + stats[key];

        });
    }

    static getStorageKey() {
        return window.location.pathname.split('/').pop() + window.location.search;
    }
}