class CashflowItem {
    constructor (data) {
        this.name = data.name,
        this.amount = data.amount,
        this.date = data.date,
        this.fingerprint = this.name.concat(this.date).toLowerCase().replace(/\\s/g, '')
    }
}

module.exports = CashflowItem