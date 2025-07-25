async function getData() {
    let res = await fetch('/api/budget?userId=test')
    let json = await res.json()
    return json
}

function makeTable(data) {

    $("body").append("<table>");
    $("table").addClass("table");

    $("table").append("<thead>");
    $("thead").html("<tr><th>Name</th><th>Amount</th><th>Frequency</th></tr>");
    $("thead th").attr("scope", "col")

    $("table").append("<tbody>");
    $("tbody").addClass("table-group-divider");

    data.forEach(datum => {
        console.log(datum)
        $("tbody").append(`<tr>`)
        $("tbody>tr:last-child").html(`<td>${datum.name}</td><td>$${datum.amount.toFixed(2)}</td><td>${frequency(datum.paymentsPerYear)}</td>`)


    })
    $("table").append("<tfoot>");

}

function frequency(paymentsPerYear) {
    switch (parseInt(paymentsPerYear)) {
        case 12:
            return "Monthly"
            break
        case 24:
            return "Semimonthly"
            break
        case 26:
            return "Biweekly"
            break
        case 52:
            return "Weekly"
            break
        default:
            return "Other"
    }
}

$( main() )

async function main() {
    let data = await getData()
    console.log(data)
    makeTable(data)
}

