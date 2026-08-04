// Author: Vitaly Spirin

"use strict";


export class Resolver {
    static AUDIO_BASE_PATH = '../../';
    static AUDIO_SUBFOLDER_FOR_CONJUGATIONS = 'conjugations';


    static basePathForInfoLink = '../../../';

    /** @type Record<string, string> */
    static infoForPages = {
        // A1
        "noun-number.html": "pdf/noun-gender-number.pdf",
        "conjugations.html?Le%20pr%C3%A9sent": "pdf/present.pdf",
        "present.html": "pdf/present.pdf",
        "devoir-pouvoir-falloir-vouloir.html": "../pdf/devoir-pouvoir-falloir-vouloir.pdf",
        "meteo.html": "pdf/meteo.pdf",
        "calendar.html": "pdf/calendar.pdf",
        "mon-ton-son.html": "pdf/mon-ton-son.pdf",
        "de-du-des.html": "pdf/de-du-des.pdf",
        "ce-ces-cet.html": "pdf/ce-ces-cet.pdf",
        "quand-comment-combien.html": "pdf/quand-comment-combien.pdf",
        "conjugations.html?Le%20pass%C3%A9%20compos%C3%A9": "pdf/present-perfect.pdf",
        "present-perfect.html": "pdf/present-perfect.pdf",
        "qui-quel-quelle.html": "pdf/qui-quel-quelle.pdf",
        "au-en.html": "pdf/au-en.doc.html",

        // A2
        "noun-gender.html": "pdf/noun-gender-number.pdf",
        "noun-gender-2.html?A1&A2&title=2": "pdf/noun-gender-2.pdf",
        "avoir-etre.html": "../pdf/avoir-etre.pdf",
        "adjective-position.html": "pdf/adjective-position.pdf",
        "adjective-gender.html": "pdf/adjective-gender-number.pdf",
        "adjective-number.html": "pdf/adjective-gender-number.pdf",
        "il-est.html": "pdf/il-est.pdf",
        "h-muet.html?A1&A2": "pdf/h-muet.doc.html",
        "mien-sien.html": "pdf/mon-ton-son.pdf",
        "conjugations.html?L%27imparfait": "pdf/imperfect.pdf",
        "imperfect.html": "pdf/imperfect.pdf",
        "concordance.html": "pdf/concordance-2.pdf",
        "conjugations.html?Le%20futur%20simple": "pdf/future.pdf",
        "future.html": "pdf/future.pdf",
        "time-prepositions.html": "pdf/time-prepositions.pdf",
        "qui-que.html": "pdf/qui-que.pdf",
        "lui-leur.html": "pdf/lui-leur.pdf",
        "negation.html": "pdf/negation.pdf",
        "verbs-and-prepositions.html?A1&A2&title=1": "pdf/verbs-and-prepositions.doc.html",
        "conjugations.html?L%27imp%C3%A9ratif": "pdf/imperative.pdf",
        "imperative.html": "pdf/imperative.pdf",

        // B1
        "negation-2.html": "pdf/negation.pdf",
        "ceci-cela-celui.html": "pdf/ce-ces-cet.pdf",
        "y-en.html": "pdf/y-en.pdf",
        "tout.html": "pdf/tout.pdf",
        "que-dont.html": "pdf/que-dont.pdf",
        "qui-que-dont-ou.html": "pdf/qui-que-dont-ou.pdf",
        "conjugations.html?Le%20plus-que-parfait": "pdf/plus-que-parfait.pdf",
        "past-perfect.html": "pdf/plus-que-parfait.pdf",
        "concordance-3.html": "pdf/concordance-3.pdf",
        "conjugations.html?Le%20conditionnel%20pr%C3%A9sent": "pdf/conditional-present.pdf",
        "conditional-present.html": "pdf/conditional-present.pdf",
        "savoir-connaitre.html": "pdf/savoir-connaitre.pdf",
        "amener-emmener.html": "pdf/amener-emmener.pdf",
        "geographical-prepositions.html?part-1": "pdf/geographical-prepositions.doc.html",
        "geographical-prepositions.html?part-2&title=2": "pdf/geographical-prepositions.doc.html",
        "geographical-prepositions.html?part-3&title=3": "pdf/geographical-prepositions.doc.html",
        "geographical-prepositions.html?part-4&title=4": "pdf/geographical-prepositions.doc.html",
        "verbs-and-prepositions.html?B1&title=2": "pdf/verbs-and-prepositions.doc.html",
        "manquer-penser-servir-jouer.html": "pdf/verbs-and-prepositions.doc.html",
        "verbs-and-prepositions.html?manquer&penser&servir&jouer&apprendre&demander&parler": "pdf/verbs-and-prepositions.doc.html",
        "conjugations.html?Le%20subjonctif%20pr%C3%A9sent": "pdf/present-subjunctive.pdf",
        "present-subjunctive.html": "pdf/present-subjunctive.pdf",

        // B2
        "noun-gender-2.html?B1&B2&title=3": "pdf/noun-gender-2.pdf",
        "h-muet.html?B1&B2&C1&title=2": "pdf/h-muet.doc.html",
        "ce-qui-ce-que.html": "pdf/ce-qui-ce-que.pdf",
        "dont-duquel.html": "pdf/dont-duquel.pdf",
        "lequel-duquel-auquel.html": "pdf/lequel-duquel-auquel.pdf",
        "verbs-and-prepositions.html?B2&title=3": "pdf/verbs-and-prepositions.doc.html",
        "verbs-and-prepositions.html?revision&title=4": "pdf/verbs-and-prepositions.doc.html",
        "conjugations.html?Le%20subjonctif%20pass%C3%A9": "pdf/present-subjunctive.pdf",
        "present-perfect-subjunctive.html": "pdf/present-subjunctive.pdf",
        "conjugations.html?Le%20conditionnel%20pass%C3%A9": "pdf/conditional-perfect.pdf",
        "conditional-perfect.html": "pdf/conditional-perfect.pdf",
        "concordance-conditional.html": "pdf/concordance-conditional.pdf",
        "passive.html": "../pdf/passive.pdf",
        "conjugations.html?Le%20futur%20ant%C3%A9rieur": "pdf/future-perfect.pdf",
        "future-perfect.html": "pdf/future-perfect.pdf",
        "concordance-future.html": "pdf/concordance-future.pdf",
        "concordance-simultaneity-posteriority-anteriority.html": "pdf/concordance-simultaneity-posteriority-anteriority.pdf",

        // C1
        "conjugations.html?Le%20pass%C3%A9%20simple": "pdf/past-historic.pdf",
        "past-historic.html": "pdf/past-historic.pdf",

        "conjugations.html?Conjugaisons%20m%C3%A9lang%C3%A9es": "#",

        // full files (which parts are used for different levels)
        "noun-gender-2.html": "pdf/noun-gender-2.pdf",
        "h-muet.html": "pdf/h-muet.doc.html",
        "geographical-prepositions.html": "pdf/geographical-prepositions.doc.html",
        "verbs-and-prepositions.html": "pdf/verbs-and-prepositions.doc.html"
    };

    /**
     * @param {string} page
     * @return {string|undefined}
     */
    static getInfoLinkForPage(page) {
        if (!Object.hasOwn(this.infoForPages, page)) {
            console.error('There is no Info Link for page "' + page + '"');
        }

        return this.basePathForInfoLink + Resolver.infoForPages[page];
    }


}
