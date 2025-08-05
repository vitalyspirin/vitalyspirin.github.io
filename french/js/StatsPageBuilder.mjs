
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
            if (!(newTableRowElement instanceof Element)) return;

            this.#fillTableRow(newTableRowElement, date, this.stats[date]);

            if (Utils.getWeek(date) % 2 == 0) {
                newTableRowElement.classList.add('even-week');
            } else {
                newTableRowElement.classList.add('odd-week');
            }

            tbodyElement.append(newTableRowElement);
        });
    }

    static #fillTableRow(tableRowElement, date, statsForOneDate) {
        const dateCell = tableRowElement.getElementsByClassName('date')[0];
        dateCell.innerText = date;

        let duration = 0;
        for (const statsPageKey in statsForOneDate) {
            let tableCell = tableRowElement.getElementsByClassName(statsPageKey)[0];

            if (!(tableCell instanceof HTMLTableCellElement)) {
                console.error('HTML element of class "' + statsPageKey + '" has not been found.');
                continue;
            }

            tableCell.innerText = Math.round(100 * statsForOneDate[statsPageKey]['result']) + '%';
            tableCell.title = statsForOneDate[statsPageKey]['errors'] + ' errors';
            duration += statsForOneDate[statsPageKey]['duration'];
        }
        dateCell.title = 'time spent: ' + Utils.timestampToTime(duration);
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
                this.stats[formattedDate][pageKey] = {
                    result: statsForPage[pageStatsKey]['result'],
                    errors: statsForPage[pageStatsKey]['errors']
                };

                if (statsForPage[pageStatsKey]['duration']) {
                    this.stats[formattedDate][pageKey]['duration'] = statsForPage[pageStatsKey]['duration'];
                } else {
                    this.stats[formattedDate][pageKey]['duration'] = 0;
                }
            });

        });

        this.dates = Object.keys(this.stats).sort().reverse();

    } // function buildStatsObject()

}
