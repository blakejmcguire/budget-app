$(async () => {
    let today = new Date();
    let later = new Date();
    later.setDate(later.getDate() + 90);
    $("#from").val(today.toISOString().split('T')[0])
    $("#to").val(later.toISOString().split('T')[0])

    // Initial build of the data table
    update()

    $("#from").on("change", update);
    $("#to").on("change", update);
})

function setDates() {
    let d = new Date()
    let today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    d.setDate(d.getDate() + 14)
    let later = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    $("#from").val(today)
    $("#to").val(later)
}

async function update() {
    let data = await getData()
    makeTable(data)
}

async function getData() {
    let from = $("#from").val()
    let to = $("#to").val()

    let res = await fetch(`/api/cashflow/getTemp?from=${from}&to=${to}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "userId": "blake"
        })
    })
    let data = await res.json()
    data.sort((a, b) => {
        let aNumber = parseInt(a.date.replaceAll(/-/g, ''))
        let bNumber = parseInt(b.date.replaceAll(/-/g, ''))
        let result = aNumber - bNumber
        return result
    })
    return data
}

function makeTable(data) {
    $('#cashflow-table').remove()

    let $table = $('<table>')
    $table.attr('id', 'cashflow-table')
    $table.addClass("table")

    $table.append('<thead><tr><th scope="col">Date</th><th scope="col">Name</th><th scope="col">Amount</th></tr></thead>');
    $table.append('<tbody class="table-group-divider">')

    let total = 0;
    data.forEach(datum => {
        $table.children('tbody').append(`<tr><td>${datum.date}</td><td>${datum.name}</td><td>$${Number(datum.amount).toFixed(2)}</td></tr>`)
        total += Number(datum.amount)
    })

    $table.append(`<tfoot class=""table-group-divider"><tr><th scope="row">Total</th><td></td><td>$${total.toFixed(2)}</td></tfoot>`)

    $('body').append($table);
}