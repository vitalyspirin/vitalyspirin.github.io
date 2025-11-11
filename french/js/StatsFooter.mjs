// Author: Vitaly Spirin

"use strict";

import ErrorCounterLine from './ErrorCounterLine.mjs';
import { Resolver } from './Resolver.mjs';
import { ErrorCounter, ErrorCounterObj } from './ErrorCounter.mjs';
import Utils from './Utils.mjs';

export default class StatsFooter {
    /**
     * @param {ErrorCounterObj} errorCounter
     * @param {boolean} verbTense
     */
    static saveStats(statsId, errorCounter, verbTense) {
        let stats = this.retrieveStats(verbTense);

        stats[statsId] = {
            'timestamp': Date.now(),
            'result': errorCounter.numberOfCompleted /
                errorCounter.numberOfAllInputElements,
            'errors': errorCounter.numberOfErrors,
            'correct': errorCounter.numberOfCompleted,
            'total': errorCounter.numberOfAllInputElements,
            'duration': errorCounter.duration
        };
        localStorage.setItem(this.getStorageKey(verbTense), JSON.stringify(stats));

    }

    static retrieveStats(verbTense) {
        let stats;

        const storageValue = localStorage.getItem(this.getStorageKey(verbTense));
        if (storageValue == null) {
            stats = {};
        } else {
            stats = JSON.parse(storageValue);
        }

        return stats;
    }

    static showStats(verbTense = null) {
        document.getElementById('stats-title').style.display = 'block';
        document.getElementById('stats').textContent = '';

        const template = document.getElementById('template-stats-line')

        if (!(template instanceof HTMLTemplateElement)) {
            console.error('HTML element with id "template-stats-line" has not been found.');
            return;
        }
        const statsLineElement = template.content.firstElementChild;

        const stats = StatsFooter.retrieveStats(verbTense);
        const bestResult = this.getBestResult(stats);

        Object.values(stats).forEach((statsLine) => {
            let newStatsLineElement = statsLineElement.cloneNode();

            if (!(newStatsLineElement instanceof HTMLElement)) { // typecast for .innerHTML
                console.error('newStateLineElement must be instanceof HTMLElement.');
                return;
            }

            if (statsLine['result'] == bestResult) {
                newStatsLineElement.classList.add('best-result');
            }

            let formattedDate = Utils.timestampToDateAndTime(Number(statsLine['timestamp']));
            const result = Math.round(100 * Number(statsLine['result']));

            newStatsLineElement.innerHTML = '&nbsp;' + formattedDate; // += because template can have something
            if (Object.hasOwn(statsLine, 'duration')) {
                newStatsLineElement.innerHTML += ' (durée: ' +
                    Utils.timestampToTime(statsLine['duration']) + ')';
            }
            newStatsLineElement.innerHTML += ' &nbsp; - &nbsp; ' + result +
                '% (' + statsLine['errors'] + ' erreurs)';

            document.getElementById('stats').appendChild(newStatsLineElement);
        });
    }

    static hideStats() {
        document.getElementById('stats-title').style.display = 'none';
        document.getElementById('stats').textContent = '';
    }

    static getStorageKey(verbTense) {
        let storageKey;

        if (verbTense === null) {
            storageKey = window.location.pathname.split('/').pop() + window.location.search;
        } else {
            storageKey = 'conjugations.html?' + Resolver.getURLEncodedTenseByFolder(verbTense);
        }

        return storageKey;
    }

    static getBestResult(stats) {
        let bestResult = 0;

        Object.values(stats).forEach((statsLine) => {
            if (statsLine.result > bestResult) {
                bestResult = statsLine.result;
            }
        });

        return bestResult;
    }
}
