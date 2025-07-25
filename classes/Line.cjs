const crypto = require('crypto')

class Line {
    constructor(data) {
        if (typeof data.index == "number") {
            this.index = data.index
        }
        else {
            this.index = Line.getIndex(data.paymentsPerYear, data.date);
        }

        if (typeof data.id == 'undefined') {
            Line.validate(data)

            this.id = Line.generateId({
                name: data.name,
                amount: data.amount,
                paymentsPerYear: data.paymentsPerYear
            })
        }
        else {
            this.id = data.id
        }

        this.name = data.name;
        this.amount = data.amount;
        this.paymentsPerYear = data.paymentsPerYear;

    }

    static generateId(data) {
        let name = String(data.name)
        let amount = String(data.amount)
        let paymentsPerYear = String(data.paymentsPerYear)
        let index = Line.getIndex(data.paymentsPerYear, data.date)

        let str = name + amount + paymentsPerYear + index

        str = str.toLowerCase().replaceAll(/\s|\./g, '')
        let hash = crypto.createHash('sha1')
        hash.update(str)
        let hex = hash.digest('hex')
        return hex
    }

    static validate(data) {
        /**
         * name
         * amount
         * paymentsPerYear
         * date
         */

        if (typeof data.name !== "string") {
            throw new Error(`Payment name must be a string. Received ${data.name}`)
        }

        if (isNaN(data.amount)) {
            throw new Error(`Cannot construct payment "${data.name}". Line amount ${data.amount} must be a number.`)
        }

        if (typeof data.index == "undefined") {
            if (!(data.date instanceof Date)) {
                if (/^([0-9]{4}-[0-9]{2}-[0-9]{2})$/.test(data.date)) {
                    let inputMonth = data.date.slice(5, 7);
                    let test = new Date(data.date);

                    if (test.getUTCMonth() + 1 !== parseInt(inputMonth)) {
                        throw new Error(`Date string ${data.date} is invalid. Converts to ${test.toISOString().slice(0, 10)} due to rollover.`);
                    }
                    data.date = test;
                } else {
                    throw new Error(`Payment example date ${data.date} is invalid. Must be a Date object or a string matching ISO format "yyyy-mm-dd"`);
                }
            }
        }


        if (typeof paymentsPerYear !== "number") {
            data.paymentsPerYear = parseInt(data.paymentsPerYear)
        }

        if (![12, 26, 52].includes(data.paymentsPerYear)) {
            throw new Error(`Cannot construct payment "${data.name}". Bad paymentsPerYear value: ${data.paymentsPerYear}.\nPossible values are:\n12 - Monthly\n26 - Biweekly\n52 - Weekly`);
        }
    }

    nextPayment(from) {
        let date = from || new Date();
        let output;
        switch (this.paymentsPerYear) {
            case 12:
                output = Line.nextMonthlyPayment(this.index, date);
                break;
            case 26:
                output = Line.nextDailyPayment(this.index, date, 14);
                break;
            case 52:
                output = Line.nextDailyPayment(this.index, date, 7);
                break;
        }

        return output;
    }

    scheduleBetween(startDate, endDate) {
        let arr = []
        let intermediate = new Date(startDate);
        let ed = new Date(endDate)
        while (intermediate < ed) {
            intermediate.setTime(this.nextPayment(intermediate).getTime());
            if (intermediate > ed) break;
            arr.push(intermediate.toISOString().slice(0, 10));
            intermediate.setTime(intermediate.getTime() + 86400000)
        }
        return arr;
    }

    static getIndex(paymentsPerYear, date) {
        let index;
        let d;
        if (!(date instanceof Date)) {
            d = new Date(d)
        }
        else if (date instanceof Date) {
            d = date
        }
        else {
            throw new Error('problem with dates in getIndex function')
        }

        switch (paymentsPerYear) {
            case 12: index = Line.getMonthlyIndex(d);
                break;
            case 52: index = Line.getDailyIndex(d, 7);
                break;
            case 26: index = Line.getDailyIndex(d, 14);
                break;
        }
        return index;
    }

    static getDailyIndex(date, period) {
        // Need to factor in time zone offset as getTime works based on UTC maybe?
        // Check if instance of js date
        // console.log(date, date instanceof Date)
        let ms = date.getTime();
        //ms = ms - date.getTimezoneOffset() * 60 * 1000;

        ms = ms - (ms % 86400000); // Strip h m and s from the date. "Clean" date.
        let index = (ms % (86400000 * period)) / 86400000;
        return index;
    }

    static getMonthlyIndex(date) {
        /**
         * Returns an index that is the date of the month, -1 to 30.
         * 
         * Regular dates are indexed 0-30.
         * 
         * -1 indicates end of the month.
         */

        let index;

        // add 24 hrs to check if month changes (indicates EO Month)

        let testDate = new Date(date.getTime() + 86400000)

        if (testDate.getUTCMonth() !== date.getUTCMonth()) {
            index = -1;
        } else {
            index = date.getUTCDate();
        }

        return index;
    }

    static nextDailyPayment(index, fromDate, period) {
        /**
         * Get ms from input date
         * Strip extraneous from period basis (gives last payment before input date)
         * Add one period back in
         */

        let fromDateIndex = Line.getDailyIndex(fromDate, period);
        let difference = index - fromDateIndex;

        if (difference < 0) {
            difference += period;
        }

        let output = new Date(fromDate.getTime() + (difference * 86400000))

        return output
    }

    static nextMonthlyPayment(index, fromDate) {
        let next = new Date(fromDate);
        if (index === -1) {
            next.setUTCMonth(next.getUTCMonth() + 1)
            next.setUTCDate(0);
            return next;
        }
        if (next.getUTCDate() > index) {
            next.setUTCDate(index)
            next.setUTCMonth(next.getUTCMonth() + 1);
        }
        else {
            next.setUTCDate(index)
        }

        return next;
    }
}

module.exports = Line