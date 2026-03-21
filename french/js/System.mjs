// Author: Vitaly Spirin

"use strict";

import Storage from './Storage.mjs';
import Utils from './Utils.mjs';

export class System {
    static textAreaHtmlElement;

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
        const fileInput = document.getElementById('file-input');
        fileInput.addEventListener('change', System.uploadFileEventHandler);

        fileInput?.click();

        fileInput.value = null; // to trigger 'change' event if the same file is reuploaded.
    }

    static uploadFileEventHandler(event) {
        const file = event.target.files[0]; // Get the first selected file

        if (file) {
            const reader = new FileReader(); // Create a FileReader instance

            // Define what happens when the file is successfully read
            reader.onload = function (readerEvent) {
                const content = readerEvent.target.result; // The file content as a string
                System.textAreaHtmlElement.value = content; // Display the content
                Storage.replaceStatsData(content);
            };

            // Read the file content as text
            reader.readAsText(file, 'UTF-8'); // Use the readAsText method
        }
    };

    // we need json object (instead of raw json string) to format it nicely
    static buildObjectWithStatsData() {
        const obj = {};

        Storage.getStatsKeyList().forEach((statsKey) => {
            obj[statsKey] = Storage.getStatsDataForKey(statsKey);
        });

        return obj;
    }

}
