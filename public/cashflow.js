$(async () => {
    // Set input fields to today and 2 weeks from today
    let d = new Date()
    let today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    d.setDate(d.getDate() + 14)
    let later = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    $("#from").val(today)
    $("#to").val(later)

    // Initial build of the data table
    makeTable(await getData());

    $("#from").on("change", update);
    $("#to").on("change", update);

    await getData()
})

async function update() {
    t = document.querySelector("table");
    if (t) 
        // Remove the existing table if it exists
        t.remove();
    makeTable(await getData())
}

async function getData() {
    let from = $("#from").val()
    let to = $("#to").val()
    let res = await fetch(`/api/schedule?from=${from}&to=${to}`)
    let data = await res.json()
    return data
}

function makeTable(data) {
    let $table = $('<table>')
    $table.attr('id', 'cashflow-table')
    $table.addClass("table")

    $table.append('<thead><tr><th scope="col">Date</th><th scope="col">Name</th><th scope="col">Amount</th></tr></thead>');
    $table.append('<tbody class="table-group-divider">')

    let total = 0;
    data.forEach(datum => {
        $table.children('tbody').append(`<tr><td>${datum.date}</td><td>${datum.name}</td><td>$${datum.amount.toFixed(2)}</td></tr>`)
        total += datum.amount
    })

    $table.append(`<tfoot class=""table-group-divider"><tr><th scope="row">Total</th><td></td><td>$${total.toFixed(2)}</td></tfoot>`)

    $('body').append($table);
}