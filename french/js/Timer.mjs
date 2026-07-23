// Author: Vitaly Spirin

"use strict";

import { ErrorCounter } from './ErrorCounter.mjs';

export default class Timer {

    /**
     * 
     * @param {string} verbTense 
     */
    static setDuration(verbTense) {
        const errorCounterObj = ErrorCounter.getErrorCounterObj(verbTense);

        if (ErrorCounter.isOneTimerOnly) {
            errorCounterObj.duration = Date.now() - ErrorCounter.startTimestamp;
        } else {
            const timeDiff = Date.now() - ErrorCounter.startTimestamp;
            errorCounterObj.duration += timeDiff;

            // to catch a bug when duration becomes huge
            if (timeDiff > 1000 * 60 * 60) {
                alert('time difference between "focus in" and "focus out" is ' + timeDiff + '. That is more than an hour.');
            }
        }

    }

}
