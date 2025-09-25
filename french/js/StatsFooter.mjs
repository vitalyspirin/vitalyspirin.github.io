// Author: Vitaly Spirin

"use strict";

import ErrorCounterLine from './ErrorCounterLine.mjs';
import { Resolver } from './Resolver.mjs';
import {ErrorCounter, ErrorCounterObj} from './ErrorCounter.mjs';
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
        const keys = Object.keys(stats);

        keys.forEach((key) => {
            let newStatsLineElement = statsLineElement.cloneNode();

            if (!(newStatsLineElement instanceof HTMLElement)) { // typecast for .innerHTML
                console.error('newStateLineElement must be instanceof HTMLElement.');
                return;
            }

            let formattedDate = Utils.timestampToDateAndTime(Number(stats[key]['timestamp']));
            const result = Math.round(100 * Number(stats[key]['result']));

            newStatsLineElement.innerHTML = '&nbsp;' + formattedDate; // += because template can have something
            if (Object.hasOwn(stats[key], 'duration')) {
                newStatsLineElement.innerHTML += ' (durée: ' +
                    Utils.timestampToTime(stats[key]['duration']) + ')';
            }
            newStatsLineElement.innerHTML += ' &nbsp; - &nbsp; ' + result +
                '% (' + stats[key]['errors'] + ' erreurs)';

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

}
