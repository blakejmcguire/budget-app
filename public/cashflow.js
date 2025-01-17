document.addEventListener("DOMContentLoaded", async () => {
    // Set input fields to today and 2 weeks from today
    let d = new Date()
    let today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    d.setDate(d.getDate() + 14)
    let later = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    document.querySelector("#from").value = today
    document.querySelector("#to").value = later

    // Initial build of the data table
    makeTable(await getData());

    document.querySelector("#from").addEventListener("change", update);
    document.querySelector("#to").addEventListener("change", update);

    await getData()
})

async function update() {
    document.querySelector("table").remove();
    makeTable(getPayments(await getData()))
}

async function getData() {
    let from = document.querySelector("#from").value
    let to = document.querySelector("#to").value
    let res = await fetch(`/api/schedule?from=${from}&to=${to}`)
    let data = await res.json()
    return data
}

function makeTable(data) {
    $("body").append("<table>");
    $("table").addClass("table");

    $("table").append("<thead>");
    $("thead").html("<tr><th>Date</th><th>Name</th><th>Amount</th></tr>");
    $("thead th").attr("scope", "col")

    $("table").append("<tbody>");
    $("tbody").addClass("table-group-divider");

    let total = 0;

    data.forEach(datum => {
        $("tbody").append(`<tr>`)
        $("tbody>tr:last-child").html(`<td>${datum.date}</td><td>${datum.name}</td><td>$${datum.amount.toFixed(2)}</td>`)

        total += datum.amount;

    })

    $("table").append("<tfoot>");
    $("tfoot").addClass("table-group-divider");
    $("tfoot").html(`<tr><th scope="row">Total</th><td></td><td>$${total.toFixed(2)}</td>`)

}