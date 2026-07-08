// Author: Vitaly Spirin

"use strict";

import { Resolver } from './Resolver.mjs';
import Types from './Types.mjs';
import Utils from './Utils.mjs';

export class SpeakerPhone {
    /**
     * @param {HTMLElement} speakerPhoneElement
     * @param {string} fullFileName
     * @param {string|null} jsonIndex
     */
    static init(speakerPhoneElement, fullFileName, jsonIndex = null) {
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
