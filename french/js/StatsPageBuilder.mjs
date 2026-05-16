
// author: Vitaly Spirin

"use strict";

import Storage from './Storage.mjs';
import Utils from './Utils.mjs';
import Types from './Types.mjs';

export default class StatsPageBuilder {

    /**
     * @typedef {Record<string, {result: number, errors: number, duration: number}>} StatsForOneDate
     */

    /** 
     * @type Record< string, StatsForOneDate> > 
     * 
     * Example: 
     *  2025-05-23: 
     *      exercise_concordance.html: {result: 0.8878504672897196, errors: 14, duration: 0}
     *      exercise_future.html: {result: 0.8481012658227848, errors: 12, duration: 0}
     *  2025-05-24: 
     *      conjugations_mixed.html?Conjugaisons%20m%C3%A9lang%C3%A9es: {result: 0.9431524547803618, errors: 39, duration: 0}
     */
    static stats = {};

    /** @type string[] */
    static dates;

    /** 
     * @type Record<string, string> 
     * 
     * Example:
     *  exercise_avoir_etre.html: "2026-01-12"
     *  exercise_ce_ces_cet.html: "2026-01-26"
     */
    static earlestDates = {};

    /** 
     * @type Record<string, Record<string, number>> 
     * 
     * Example:
     *  exercise_de_du_des.html: 
     *      2026-01-21: 1
     *      2026-01-22: 2
     *      2026-01-23: 3
     *  exercise_future.html: 
     *      2025-05-23: 1
     *      2025-05-24: 2
     */
    static datesForPage = {};

    /** 
     * @type Record<string, number> 
     * 
     * Example:
     *  exercise_il_est.html: 0.9772727272727273
     *  exercise_imperative.html: 1
     */
    static bestResults = {};

    static TD_ATTRIBUTE = 'data-key';
    static TD_ATTRIBUTE_DATE_VALUE = 'date';
    static RECENT_DATES_CLASS_NAME = 'recent-dates';
    static LEVEL_LIST = ['A1', 'A2', 'B1', 'B2', 'C1'];
    static BREAK_LENGTH = 10; // number of days without doing exercises

    static buildPage() {
        this.#buildStatsObject();

        const templateElement = Types.assertType(
            document.getElementById('template-table-row'),
            HTMLTemplateElement
        );

        const templateTableRow = Types.assertType(
            templateElement.content.firstElementChild,
            HTMLTableRowElement
        );

        const tbodyElement = document.getElementsByTagName('tbody')[0];

        this.dates.forEach((date, index) => {
            let newTableRowElement = templateTableRow.cloneNode(true);
            if (!(newTableRowElement instanceof HTMLTableRowElement)) return;

            this.#fillTableRow(newTableRowElement, date, this.stats[date]);

            if (Utils.getWeek(date) % 2 == 0) {
                newTableRowElement.classList.add('even-week');
            } else {
                newTableRowElement.classList.add('odd-week');
            }

            if ((index < this.dates.length - 1) 
                && Utils.subtractDates(date, this.dates[index+1]) > this.BREAK_LENGTH
            ) {
                newTableRowElement.classList.add('long-break');
            }

            tbodyElement.append(newTableRowElement);
        });

        const numberOfRecentDays = Types.assertType(
            document.getElementsByName('number-of-days').item(0),
            HTMLInputElement
        ).value;
        this.#ProcessRecentDates(numberOfRecentDays);

        Types.assertType(document.querySelector('a.info-icon'), HTMLElement)
            .style.visibility = 'visible';
    }

    /**
     * @param {HTMLTableRowElement} tableRowElement
     * @param {string} formattedDate
     * @param {StatsForOneDate} statsForOneDate
     */
    static #fillTableRow(tableRowElement, formattedDate, statsForOneDate) {
        let duration = 0;

        for (const tdElement of tableRowElement.children) {
            if (!(tdElement instanceof HTMLTableCellElement)) continue;

            let statsPageKey = Types.assertNotNull(tdElement.getAttribute('data-key'));

            if (statsForOneDate.hasOwnProperty(statsPageKey)) {
                tdElement.title = this.datesForPage[statsPageKey][formattedDate] + ' fois: ';
                tdElement.textContent = Math.round(100 * statsForOneDate[statsPageKey]['result']) + '%';
                tdElement.title += statsForOneDate[statsPageKey]['errors'] + ' erreurs';
                tdElement.title += ', ' + Utils.timestampToTime(statsForOneDate[statsPageKey]['duration']);
                duration += statsForOneDate[statsPageKey]['duration'];

                if (this.bestResults[statsPageKey] == statsForOneDate[statsPageKey]['result']) {
                    tdElement.classList.add('best-result');
                }
            }

            if (this.earlestDates[statsPageKey] <= formattedDate) {
                tdElement.classList.add('done-earlier');
            }
        }

        const dateCell = Types.assertType(
            tableRowElement.querySelector('[data-key="date"]'),
            HTMLElement
        );
        dateCell.innerText = formattedDate;
        const durationStr = Utils.timestampToTime(duration);
        dateCell.title = 'time spent: ' + durationStr;

        const durationCell = Types.assertType(
            tableRowElement.querySelector('[data-key="duration"]'),
            HTMLElement
        );
        durationCell.innerText = durationStr;
    }

    static #buildStatsObject() {
        const pagesKeys = Storage.getStatsKeyList();

        pagesKeys.forEach((pageKey) => {
            const statsForPage = JSON.parse(Storage.getStatsDataForKey(pageKey));
            const pageStatsKeys = Object.keys(statsForPage).sort();

            pageStatsKeys.forEach((pageStatsKey) => {
                const formattedDate = Utils.timestampToDate(Number(statsForPage[pageStatsKey]['timestamp']));

                if (!this.stats.hasOwnProperty(formattedDate)) {
                    this.stats[formattedDate] = {};
                }
                this.stats[formattedDate][pageKey] = {
                    result: statsForPage[pageStatsKey]['result'],
                    errors: statsForPage[pageStatsKey]['errors'],
                    duration: 0
                };

                if (statsForPage[pageStatsKey]['duration']) {
                    this.stats[formattedDate][pageKey]['duration'] = statsForPage[pageStatsKey]['duration'];
                }

                this.#setEarlestDate(pageKey, formattedDate);
                this.#setDatesForPage(pageKey, formattedDate);
                this.#setBestResults(pageKey, statsForPage[pageStatsKey]['result']);
            });

        });

        this.dates = Object.keys(this.stats).sort().reverse();

        if (this.dates.length == 0) {
            // if no stats then show one empty line with current date
            const formattedDate = Utils.timestampToDate(Date.now());
            this.dates.push(formattedDate);
            this.stats[formattedDate] = {};
        }
    } // function buildStatsObject()

    /**
     * @param {string} pageKey
     * @param {string} date
     */
    static #setEarlestDate(pageKey, date) {
        if (!this.earlestDates.hasOwnProperty(pageKey)) {
            this.earlestDates[pageKey] = date;
        } else {
            if (date < this.earlestDates[pageKey]) {
                this.earlestDates[pageKey] = date;
            }
        }
    }

    /**
     * @param {string} pageKey
     * @param {string} date
     */
    static #setDatesForPage(pageKey, date) {
        if (!this.datesForPage.hasOwnProperty(pageKey)) {
            this.datesForPage[pageKey] = {};
        }

        if (!this.datesForPage[pageKey].hasOwnProperty(date)) {
            this.datesForPage[pageKey][date] =
                Object.keys(this.datesForPage[pageKey]).length + 1;
        }
    }

    /**
     * @param {string} pageKey
     * @param {number} result
     */
    static #setBestResults(pageKey, result) {
        if (!this.bestResults.hasOwnProperty(pageKey)) {
            this.bestResults[pageKey] = result;
        } else {
            if (result > this.bestResults[pageKey]) {
                this.bestResults[pageKey] = result;
            }
        }
    }

    /**
     * @param {number} numberOfRecentDays
     */
    static #ProcessRecentDates(numberOfRecentDays) {
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
                        'thead a[href*="' + tdTopElement.getAttribute(this.TD_ATTRIBUTE) + '"]');
                    aElement?.parentElement?.classList.add(this.RECENT_DATES_CLASS_NAME);

                    // add class to subject name header cell ('imparfait' or 'futur simple' etc)
                    cssStr = 'thead th[' + this.TD_ATTRIBUTE + '*="' +
                        tdTopElement.getAttribute(this.TD_ATTRIBUTE) + '"]';
                    const thSubjectElement = document.querySelector(cssStr);
                    thSubjectElement?.classList.add(this.RECENT_DATES_CLASS_NAME);
                }
            });

            trElement = trElement?.nextElementSibling;

            dateCounter++;

        } while (dateCounter < numberOfRecentDays);
    }
}
