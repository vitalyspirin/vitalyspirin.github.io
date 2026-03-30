// Author: Vitaly Spirin

"use strict";

export default class ViewModelBase {

    constructor() { }

    setFrom(formInput) {
        if (!(formInput instanceof HTMLCollection)) {
            console.error("'formInput' parameter must be of type HTMLCollection but it's of type " +
                Object.prototype.toString.apply(formInput));
        }

        Array.from(formInput).forEach((inputElement) => {
            const inputName = inputElement.name.trim();

            if (inputName.length === 0) {
                console.error("The following Html Element has an empty 'name' atribute: ");
                console.error(inputElement);
            } else {
                if (Object.hasOwn(this, inputName)) {
                    if (inputElement.type === 'checkbox') {
                        this[inputName] = inputElement.checked;
                    } else {
                        this[inputName] = inputElement.value;
                    }
                }
            }

        });

    }
}
