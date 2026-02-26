const MS_PER_DAY = 86400000 // 1000 * 60 * 60 * 24
const ObjectId = require('mongodb').ObjectId

class Budget {
    constructor(db, userId) {
        this.db = db
        this.userId = userId
        this.collection = this.db.getClient().collection('budgets')
    }

    async addItem({name, amount, date, paymentsPerYear, isCredit, category, subcategory}) {
        const newItem = {
            userId: this.userId,
            name,
            amount,
            date: Budget.ensureDate(date),
            paymentsPerYear,
            isCredit: isCredit || false,
            // only include optional fields when they have a value
            ...(category != null && { category }),
            ...(subcategory != null && { subcategory }),
        }

        Budget.validate(newItem)

        newItem.index = Budget.getIndex(newItem.date, newItem.paymentsPerYear)

        const result = await this.collection.insertOne(newItem)
        return result.insertedId
    }

    async getItem(id) {
        let objectId = new ObjectId(id)
        const item = await this.collection.findOne({ _id: objectId, userId: this.userId })
        item.date = Budget.getYMD(item.date)
        return item
    }

    async editItem(id, name, amount, date, paymentsPerYear) {
        // Get the existing item from the db
        const existingItem = getItem(id)

        // TODO: Check that item exists

        // Set update object to only include fields that were provided in the request
        const updatedItem = {
            name: name || existingItem.name,
            amount: amount || existingItem.amount,
            date: date || existingItem.date,
            paymentsPerYear: paymentsPerYear || existingItem.paymentsPerYear
        }

        // TODO: Validate updated item

        const result = await this.collection.updateOne(
            { _id: id, userId: this.userId },
            { $set: updatedItem }
        )

        return result.modifiedCount > 0
    }

    async deleteItem(id) {
        let objectId = new ObjectId(id)
        const result = await this.collection.deleteOne({ _id: objectId, userId: this.userId })
        return result.deletedCount > 0
    }

    async getAllItems() {
        const items = await this.collection.find({ userId: this.userId }).toArray()
        items.forEach(item => {
            item.date = Budget.getYMD(item.date)
        })
        return items
    }

    static validate({name, amount, date, paymentsPerYear, isCredit, category, subcategory}) {
        if (typeof name !== 'string' || name.trim() === '') {
            throw new Error('Invalid name')
        }
        if (typeof amount !== 'number' || amount <= 0) {
            throw new Error('Invalid amount')
        }
        if (isNaN(Date.parse(date))) {
            throw new Error('Invalid date')
        }
        if (![12, 26, 52].includes(paymentsPerYear)) {
            throw new Error('Invalid paymentsPerYear')
        }
        if (typeof isCredit !== 'boolean') {
            throw new Error('Invalid isCredit')
        }
        if (category != null) {
            if (typeof category !== 'string' || category.trim() === '') {
                throw new Error('Invalid category')
            }
        }
        if (subcategory != null) {
            if (typeof subcategory !== 'string' || subcategory.trim() === '') {
                throw new Error('Invalid subcategory')
            }
        }
        return true
    }

    static ensureDate(dateValue, userTimezone = 'UTC') {
        if (typeof dateValue === 'string') {
            // Parse ISO string as UTC
            return new Date(dateValue + 'T00:00:00Z');
        }
        if (dateValue instanceof Date) {
            // Account for timezone offset
            const offset = userTimezone === 'UTC' ? 0 : getTimeZoneOffset(userTimezone);
            return new Date(dateValue.getTime() - (offset * 60 * 1000));
        }
        throw new Error('Invalid date');
    }

    static getYMD(date) {
        const d = Budget.ensureDate(date)
        const yyyy = d.getUTCFullYear()
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
        const dd = String(d.getUTCDate()).padStart(2, '0')
        return `${yyyy}-${mm}-${dd}`
    }

    static getIndex(date, paymentsPerYear) {
        switch (paymentsPerYear) {
            case 12:
                return Budget.monthlyIndex(date)
            case 52:
                return Budget.dailyIndex(date, 7)
            case 26:
                return Budget.dailyIndex(date, 14)
            default:
                throw new Error(`Unsupported paymentsPerYear ${paymentsPerYear}`)
        }
    }

    static monthlyIndex(date) {
        /**
         * Returns the calendar date of the month
         * or -1 if the end of the month.
         */

        let index;

        // add 24 hrs to check if month changes (indicates EO Month)

        let inputDate = Budget.ensureDate(date)
        let testDate = new Date(date)

        testDate.setUTCDate(testDate.getUTCDate() + 1)

        if (testDate.getUTCMonth() !== inputDate.getUTCMonth()) {
            index = -1;
        } else {
            index = inputDate.getUTCDate();
        }

        return index;
    }

    static dailyIndex(date, period) {
    /**
     * Return the position of `date` within a repeating cycle of
     * `period` days.  Result is an integer 0 ≤ index < period.
     *
     * `date` may be a Date or an ISO string; it is normalised to
     * UTC midnight first.
     */
        if (typeof period !== 'number' || period <= 0 || !Number.isInteger(period)) {
            throw new Error(`invalid period ${period}`);
        }

        const d = Budget.ensureDate(date);
        const dayCount = Math.floor(d.getTime() / MS_PER_DAY);    // UTC days since epoch
        return dayCount % period;
    }

    static nextPayment(from, index, paymentsPerYear) {
        let date = Budget.ensureDate(from)

        switch (paymentsPerYear) {
            case 12:
                return Budget.nextMonthlyPayment(index, date);
            case 26:
                return Budget.nextDailyPayment(index, date, 14);
            case 52:
                return Budget.nextDailyPayment(index, date, 7);
            default:
                throw new Error(`Unsupported paymentsPerYear ${paymentsPerYear}`)
        }
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

        return next
    }

    static nextDailyPayment(index, fromDate, period) {
        let from = Budget.ensureDate(fromDate)

        if (index < -1 || index > 31) {
            throw new Error(`Invalid index ${index}`)
        }

        let fromIndex = Budget.dailyIndex(from, period)
        let difference = index - fromIndex

        if (difference <= 0) {
            difference += period
        }

        let output = new Date(from.getTime())
        output.setUTCDate(output.getUTCDate() + difference)

        return output
    }

    static scheduleBetween(startDate, endDate, index, paymentsPerYear) {
        let schedule = []
        let nextPayment = Budget.nextPayment(startDate, index, paymentsPerYear)
        while (nextPayment <= endDate) {
            schedule.push(nextPayment)
            nextPayment = Budget.nextPayment(nextPayment, index, paymentsPerYear)
        }
        return schedule
    }
}

module.exports = Budget