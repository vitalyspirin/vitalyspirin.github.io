
// author: Vitaly Spirin

"use strict";

import { Utils } from './Utils.mjs';

export class StatsPageBuilder {
    static stats = {};
    static dates;

    static buildPage() {
        this.#buildStatsObject();

        const templateElement = document.getElementById('template-table-row');
        if (!(templateElement instanceof HTMLTemplateElement)) return;

        const templateTableRow = templateElement.content.firstElementChild;
        const tbodyElement = document.getElementsByTagName('tbody')[0];

        this.dates.forEach((date) => {
            let newTableRowElement = templateTableRow.cloneNode(true);

            this.#fillTableRow(newTableRowElement, date, this.stats[date]);
            tbodyElement.append(newTableRowElement);
        });
    }

    static #fillTableRow(tableRowElement, date, statsForOneDate) {
        const dateCell = tableRowElement.getElementsByClassName('date')[0];
        dateCell.innerText = date;

        for (const statsPageKey in statsForOneDate) {
            let tableCell = tableRowElement.getElementsByClassName(statsPageKey)[0];

            if (!(tableCell instanceof HTMLTableCellElement)) {
                console.error('HTML element of class "' + statsPageKey + '" has not been found.');
                continue;
            }

            tableCell.innerText = Math.round(100 * statsForOneDate[statsPageKey]) + '%';
        }
    }

    static #buildStatsObject() {
        const pagesKeys = Object.keys(localStorage);

        pagesKeys.forEach((pageKey) => {
            const statsForPage = JSON.parse(localStorage.getItem(pageKey));
            const pageStatsKeys = Object.keys(statsForPage);

            pageStatsKeys.forEach((pageStatsKey) => {
                const formattedDate = Utils.timestampToDate(Number(statsForPage[pageStatsKey]['timestamp']));

                if (!this.stats.hasOwnProperty(formattedDate)) {
                    this.stats[formattedDate] = {};
                }
                this.stats[formattedDate][pageKey] = statsForPage[pageStatsKey]['result'];
            });

        });

        this.dates = Object.keys(this.stats).sort().reverse();

    } // function buildStatsObject()

}
