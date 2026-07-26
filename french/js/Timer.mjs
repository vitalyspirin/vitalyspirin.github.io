// Author: Vitaly Spirin

"use strict";

import { ErrorCounter } from './ErrorCounter.mjs';
import ErrorCounterObj from './ErrorCounterObj.mjs';

export default class Timer {

    /** @type {number?} */
    static startTimestamp = null;

    /** @type {boolean} */
    static isOneTimerOnly = false;


    static restartIfNecessary() {
        if (this.startTimestamp === null || !this.isOneTimerOnly) {
            this.startTimestamp = Date.now();
        }
    }

    /**
     * 
     * @param {string} verbTense 
     */
    static setDuration(verbTense) {
        const errorCounterObj = ErrorCounterObj.getErrorCounterObj(verbTense);

        if (this.isOneTimerOnly) {
            errorCounterObj.duration = Date.now() - this.startTimestamp;
        } else {
            const timeDiff = Date.now() - this.startTimestamp;
            errorCounterObj.duration += timeDiff;

            // to catch a bug when duration becomes huge
            if (timeDiff > 1000 * 60 * 60) {
                alert('time difference between "focus in" and "focus out" is ' + timeDiff + '. That is more than an hour.');
            }
        }

    }

}
