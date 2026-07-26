// Author: Vitaly Spirin

"use strict";

import Storage from './Storage.mjs';
import Types from './Types.mjs';
import Utils from './Utils.mjs';
import StatsForOnePage from './StatsFooter.mjs';

export class System {
    /** @type HTMLTextAreaElement */
    static textAreaHtmlElement;

    /**
     * 
     * @param {HTMLTextAreaElement} textAreaHtmlElement 
     * @param {HTMLAnchorElement} AHtmlElementForDownload 
     * @param {HTMLButtonElement} AHtmlElementForUpload 
     */
    static initialize(textAreaHtmlElement, AHtmlElementForDownload, AHtmlElementForUpload) {
        this.textAreaHtmlElement = textAreaHtmlElement;

        const statsObj = this.buildObjectWithStatsData();
        const jsonStr = JSON.stringify(statsObj, null, 2);

        textAreaHtmlElement.value = jsonStr;

        const blob = new Blob([jsonStr], { type: "application/json" });
        AHtmlElementForDownload.href = URL.createObjectURL(blob);

        const dateTimeStr = Utils.timestampToDateAndTimeSystemFormat(Date.now());
        AHtmlElementForDownload.download = AHtmlElementForDownload.download.replace(/(.*)\.(.*)/, "$1_" + dateTimeStr + ".$2");

        AHtmlElementForUpload.addEventListener("click", System.uploadButtonClickEventHandler);


    }

    static uploadButtonClickEventHandler() {
        const fileInput = Types.assertType(document.getElementById('file-input'), HTMLInputElement);

        fileInput.addEventListener('change', System.uploadFileEventHandler);

        fileInput?.click();

        fileInput.value = null; // to trigger 'change' event if the same file is reuploaded.
    }

    /**
     * 
     * @param {Event} event 
     */
    static uploadFileEventHandler(event) {
        // Get the first selected file
        const file = Types.assertType(event.target, HTMLInputElement).files[0];

        if (file) {
            const reader = new FileReader(); // Create a FileReader instance

            // Define what happens when the file is successfully read
            reader.onload = function (readerEvent) {
                const content = String(readerEvent.target.result); // The file content as a string
                System.textAreaHtmlElement.value = content; // Display the content
                Storage.replaceStatsData(content);
            };

            // Read the file content as text
            reader.readAsText(file, 'UTF-8'); // Use the readAsText method
        }
    };

    // we need json object (instead of raw json string) to format it nicely
    static buildObjectWithStatsData() {
        /** @type Record<string, StatsForOnePage> */
        const obj = {};

        Storage.getStatsKeyList().forEach((statsKey) => {
            obj[statsKey] = Storage.getStatsDataForKey(statsKey);
        });

        return obj;
    }

}
