// Author: Vitaly Spirin

"use strict";

export class ErrorCounter {
    static id;
    static numberOfCompleted = 0;
    static errorCounter = 0;
    static numberOfAllInputElements;

    static initialize() {
        const inputElementList = document.getElementsByTagName('input');

        for (const inputElement of inputElementList) {
            inputElement.addEventListener("focusout", this.focusOutEventHandler);
        }

        this.numberOfCompleted = 0;
        this.errorCounter = 0;
        this.numberOfAllInputElements = inputElementList.length;
        this.id = Date.now();

        setTimeout(this.showStats, 45); // wait till footer iframe is processed
    }

    static focusOutEventHandler(event) {
        if (!(event.target instanceof HTMLInputElement)) return;

        if (!event.target.checkValidity()) {
            ErrorCounter.errorCounter++;
            document.getElementById('number-of-errors').textContent = String(ErrorCounter.errorCounter);
            event.target.removeEventListener("focusout", ErrorCounter.focusOutEventHandler);
        } else if (event.target.value != '') {
            ErrorCounter.numberOfCompleted++;
        }

        if (ErrorCounter.numberOfCompleted + ErrorCounter.errorCounter >
            ErrorCounter.numberOfAllInputElements / 2
        ) {
            ErrorCounter.saveStats(ErrorCounter.errorCounter);
        }

        document.getElementById('result').textContent = String(
            Math.round(100 * ErrorCounter.numberOfCompleted / ErrorCounter.numberOfAllInputElements)
        );
    }

    static saveStats(errorCounter) {
        let stats = this.retrieveStats();
        stats[this.id] = {
            'timestamp': Date.now(),
            'result': ErrorCounter.numberOfCompleted / ErrorCounter.numberOfAllInputElements,
            'errors': errorCounter
        };
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

        if (!(template instanceof HTMLTemplateElement)) {
            console.log('HTML element with id "template-stats-line" has not been found.');
            return;
        }
        const statsLineElement = template.content.firstElementChild;

        const stats = ErrorCounter.retrieveStats();
        const keys = Object.keys(stats).reverse();

        keys.forEach((key) => {
            let newStateLineElement = statsLineElement.cloneNode();
            document.getElementById('stats').appendChild(newStateLineElement);
            let theDate = new Date(Number(stats[key]['timestamp']));

            let formattedDate = theDate.toLocaleString("en-CA", {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hourCycle: 'h24',
                hour: '2-digit',
                minute: '2-digit'
            });

            const result = Math.round(100 * Number(stats[key]['result']));
            newStateLineElement.textContent = formattedDate + ' - ' + result +
                '% (' + stats[key]['errors'] + ' erreurs)';
        });
    }

    static getStorageKey() {
        return window.location.pathname.split('/').pop() + window.location.search;
    }
}