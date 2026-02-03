
// author: Vitaly Spirin

"use strict";

import { Config } from './Config.mjs';
import Utils from './Utils.mjs';

export class StatsPageBuilder {
    static stats = {};
    static dates;
    static earlestDates = {};
    static bestResults = {};

    static TD_ATTRIBUTE = 'data-key';
    static TD_ATTRIBUTE_DATE_VALUE = 'date';
    static RECENT_DATES_CLASS_NAME = 'recent-dates';
    static LEVEL_LIST = ['A1', 'A2', 'B1', 'B2', 'C1'];
    static NUMBER_OF_RECENT_DATES = 10;

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

        this.#ProcessRecentDates();
    }

    static #fillTableRow(tableRowElement, formattedDate, statsForOneDate) {
        let duration = 0;

        for (const tdElement of tableRowElement.children) {
            let statsPageKey = tdElement.getAttribute('data-key');

            if (statsForOneDate.hasOwnProperty(statsPageKey)) {
                tdElement.innerText = Math.round(100 * statsForOneDate[statsPageKey]['result']) + '%';
                tdElement.title = statsForOneDate[statsPageKey]['errors'] + ' errors';
                duration += statsForOneDate[statsPageKey]['duration'];

                if (this.bestResults[statsPageKey] == statsForOneDate[statsPageKey]['result']) {
                    tdElement.classList.add('best-result');
                }
            }

            if (this.earlestDates[statsPageKey] <= formattedDate) {
                tdElement.classList.add('done-earlier');
            }
        }

        const dateCell = tableRowElement.querySelector('[data-key="date"]');
        dateCell.innerText = formattedDate;
        const durationStr = Utils.timestampToTime(duration);
        dateCell.title = 'time spent: ' + durationStr;

        const durationCell = tableRowElement.querySelector('[data-key="duration"]');
        durationCell.innerText = durationStr;
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
                this.#setBestResults(pageKey, statsForPage[pageStatsKey]['result']);
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

    static #setBestResults(pageKey, result) {
        if (!this.bestResults.hasOwnProperty(pageKey)) {
            this.bestResults[pageKey] = result;
        } else {
            if (result > this.bestResults[pageKey]) {
                this.bestResults[pageKey] = result;
            }
        }
    }

    static #ProcessRecentDates() {
        let dateCounter = 0;

        let trElement = document.querySelector('tbody tr:first-of-type');

        do {
            let tdList = trElement?.querySelectorAll('[title]');
            tdList?.forEach((tdTopElement) => {
                if (tdTopElement.getAttribute(this.TD_ATTRIBUTE) != this.TD_ATTRIBUTE_DATE_VALUE) {

                    // add class to stats column (with percent value)
                    let cssStr = 'tbody td[' + this.TD_ATTRIBUTE + '="' +
                        tdTopElement.getAttribute(this.TD_ATTRIBUTE) + '"]';
                    const tdElementList = document.querySelectorAll(cssStr);
                    tdElementList.forEach((tdElement) => {
                        tdElement.classList.add(this.RECENT_DATES_CLASS_NAME);
                    });

                    // add class to level header cell (A1 or A2 or B1 ...)
                    let level = Array.from(tdTopElement.classList).filter(
                        value => this.LEVEL_LIST.includes(value)
                    )[0];
                    const thLevelElement = document.querySelector(
                        'thead th[' + this.TD_ATTRIBUTE + '="' + level + '"]');
                    thLevelElement?.classList.add(this.RECENT_DATES_CLASS_NAME);

                    // add class to link header cell ('texte')
                    const aElement = document.querySelector(
                        'thead a[href="' + tdTopElement.getAttribute(this.TD_ATTRIBUTE) + '"]');
                    aElement?.parentElement?.classList.add(this.RECENT_DATES_CLASS_NAME);

                    // add class to subject name header cell ('imparfait' or 'futur simple' etc)
                    cssStr = 'thead th[' + this.TD_ATTRIBUTE + '="' +
                        tdTopElement.getAttribute(this.TD_ATTRIBUTE) + '"]';
                    const thSubjectElement = document.querySelector(cssStr);
                    thSubjectElement?.classList.add(this.RECENT_DATES_CLASS_NAME);
                }
            });

            trElement = trElement?.nextSibling;
            dateCounter++;

        } while (dateCounter < this.NUMBER_OF_RECENT_DATES);
    }

    static showHideColumns() {
        document.querySelectorAll('#checkboxes input').forEach((checkboxElement) => {

            if (!(checkboxElement instanceof HTMLInputElement)) return;

            const element = document.getElementsByTagName('article')[0];

            if (checkboxElement.checked) {
                element.classList.add(checkboxElement.name);
            } else {
                element.classList.remove(checkboxElement.name);
            }
        });
    }
}
