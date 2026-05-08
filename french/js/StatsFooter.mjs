// Author: Vitaly Spirin

"use strict";

import { Resolver } from './Resolver.mjs';
import { ErrorCounter, ErrorCounterObj } from './ErrorCounter.mjs';
import Utils from './Utils.mjs';
import Storage from './Storage.mjs';

export default class StatsFooter {

    /**
     * @typedef {Record<string, {timestamp: number, result: number, errors: number, correct: number, total: number, duration: number}>} StatsForOnePage
     * 
     * Example:
     *  1773192410882:
     *      correct: 44
     *      duration: 343758
     *      errors: 16
     *      result: 0.7333333333333333
     *      timestamp: 1773192765458
     *      total: 60
     *  1773273856909: 
     *      correct: 52
     *      duration: 303006
     *      errors: 8
     *      result: 0.8666666666666667
     *      timestamp: 1773274177794
     *      total: 60
     */


    /**
     * @param {number} statsId
     * @param {ErrorCounterObj} errorCounter
     * @param {string?} verbTense
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
        Storage.saveStatsDataForKey(this.getStorageKey(verbTense), JSON.stringify(stats));
    }

    /**
     * @param {string?} verbTense
     * @return {StatsForOnePage}
     */
    static retrieveStats(verbTense) {
        let stats;

        const storageValue = Storage.getStatsDataForKey(this.getStorageKey(verbTense));
        if (storageValue == null) {
            stats = {};
        } else {
            stats = JSON.parse(storageValue);
        }

        return stats;
    }

    /**
     * @param {string?} verbTense
     */
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

    /**
     * @param {string?} verbTense
     * @return {string}
     */
    static getStorageKey(verbTense) {
        let storageKey;

        if (verbTense === null) {
            storageKey = window.location.pathname.split('/').pop() + window.location.search;
        } else {
            storageKey = 'conjugations.html?' + Resolver.getURLEncodedTenseByFolder(verbTense);
        }

        return storageKey;
    }

    /**
     * @param {StatsForOnePage} stats
     * @return {number}
     */
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
