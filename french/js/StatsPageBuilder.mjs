
// author: Vitaly Spirin

"use strict";

import { Config } from './Config.mjs';
import Utils from './Utils.mjs';

export class StatsPageBuilder {
    static stats = {};
    static dates;
    static earlestDates = {};

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

    static #fillTableRow(tableRowElement, formattedDate, statsForOneDate) {
        let duration = 0;

        for (const tdElement of tableRowElement.children) {
            let statsPageKey = tdElement.getAttribute('data-key');

            if (statsForOneDate.hasOwnProperty(statsPageKey)) {
                tdElement.innerText = Math.round(100 * statsForOneDate[statsPageKey]['result']) + '%';
                tdElement.title = statsForOneDate[statsPageKey]['errors'] + ' errors';
                duration += statsForOneDate[statsPageKey]['duration'];
            }

            if (this.earlestDates[statsPageKey] <= formattedDate) {
                tdElement.classList.add('done-earlier');
            }
        }

        const dateCell = tableRowElement.querySelector('[data-key="date"]');
        dateCell.innerText = formattedDate;
        dateCell.title = 'time spent: ' + Utils.timestampToTime(duration);
    }

    static #buildStatsObject() {
        const pagesKeys = Object.keys(localStorage);

        pagesKeys.forEach((pageKey) => {
            if (pageKey === Config.storageKey) return;

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

                this.#setEarlestDate(pageKey, formattedDate);
            });

        });

        this.dates = Object.keys(this.stats).sort().reverse();

    } // function buildStatsObject()

    static #setEarlestDate(pageKey, date) {
        if (!this.earlestDates.hasOwnProperty(pageKey)) {
            this.earlestDates[pageKey] = date;
        } else {
            if (date < this.earlestDates[pageKey]) {
                this.earlestDates[pageKey] = date;
            }
        }
    }
}
