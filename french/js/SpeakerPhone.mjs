// Author: Vitaly Spirin

"use strict";

import { ErrorCounter } from './ErrorCounter.mjs';
import { Resolver } from './Resolver.mjs';
import Timer from './Timer.mjs';
import Types from './Types.mjs';
import Utils from './Utils.mjs';

export class SpeakerPhone {
    /**
     * @param {HTMLElement} speakerPhoneElement
     * @param {string} fileFolder
     * @param {string} fullFileName
     * @param {string|null} jsonIndex
     */
    static init(speakerPhoneElement, fileFolder, fullFileName, jsonIndex = null) {

        speakerPhoneElement.onfocus = () => {
            ErrorCounter.startTimestamp = Date.now();
        }

        speakerPhoneElement.onblur = () => {
            Timer.setDuration(fileFolder);
        }

        speakerPhoneElement.onclick = async (/** @type Event */event) => {
            let audioElement = Types.assertType(event.currentTarget, HTMLElement)
                .getElementsByTagName("audio")[0];

            if (audioElement.src == '') {
                const response = await fetch(fullFileName)
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                if (jsonIndex != null) {
                    const json = await response.json();
                    audioElement.src = json[jsonIndex];
                } else {
                    const blob = await response.blob();
                    audioElement.src = URL.createObjectURL(blob);
                }
            }

            audioElement.play();
        }

    }
}
