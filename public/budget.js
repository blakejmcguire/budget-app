async function getData(userId) {
    let res = await fetch("/api/budget/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "userId": userId
        })
    })
    let json = await res.json()
    return json
}

async function getSingleItem(userId, itemId) {
    //let res = await fetch(`/api/budget/${userId}/${itemId}`)
    let res = await fetch("/api/budget/item", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "userId": userId,
            "itemId": itemId
        })

    })
    let json = await res.json()
    return json
}

function makeTable(data) {
    $('body').find('table').remove()

    $("body").append("<table>");
    $("table").addClass("table");

    $("table").append("<thead>");
    $("thead").html("<tr><th>Name</th><th>Amount</th><th>Frequency</th><th>Edit</th></tr>");
    $("thead th").attr("scope", "col")

    $("table").append("<tbody>");
    $("tbody").addClass("table-group-divider");

    data.forEach(datum => {
        let convertedAmount = Number(datum.amount).toFixed(2)
        $("tbody").append(`<tr id="${datum.id}">`)
        $("tbody>tr:last-child").html(`<td class="name-cell">${datum.name}</td><td class="amount-cell">$${convertedAmount}</td><td class="ppy-cell">${frequency(datum.paymentsPerYear)}</td><td class="edit-cell"><button class="btn btn-primary editButton" onClick="editMode($(this).closest('tr').attr('id'))">Edit</button>`)
    })
    $("table").append("<tfoot>");
}

async function editMode(itemId) {
    let item = await getSingleItem($('#userId').val(), itemId)

    $('#edit-id-field').val(item.id)
    $('#edit-name-field').val(item.name)
    $('#edit-amount-field').val(item.amount)
    $('#edit-frequency-field').val(item.paymentsPerYear).trigger('change')
    $('#edit-date-field').val(item.nextPayment)

    $('#editModal').modal('toggle')
}

async function editSubmit() {
    let userId = $('#userId').val()
    let item = {
        id: $('#edit-id-field').val(),
        name: $('#edit-name-field').val(),
        amount: $('#edit-amount-field').val(),
        date: $('#edit-date-field').val(),
        paymentsPerYear: $('#edit-frequency-field').val()
    }

    let res = await fetch(`/api/budget/item/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "userId": userId,
                "itemId": item.id,
                "name": item.name,
                "date": item.date,
                "amount": item.amount,
                "paymentsPerYear": item.paymentsPerYear
            })
        }
    )
    let json = await res.json()

    $('#editModal').modal('toggle')
    buildContent()
}

async function deleteSubmit() {
    let userId = $('#userId').val()
    let itemId = $('#edit-id-field').val()

    let res = await fetch(`/api/budget/item/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "userId": userId,
                "itemId": itemId,
            })
        })

    $('#editModal').modal('toggle')
    buildContent()
}

async function addSubmit() {
    let userId = $('#userId').val()

    let item = {
        name: $('#add-name-field').val(),
        amount: $('#add-amount-field').val(),
        date: $('#add-date-field').val(),
        paymentsPerYear: $('#add-frequency-field').val()
    }

    let res = await fetch(`/api/budget/item/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "userId": userId,
                "name": item.name,
                "amount": item.amount,
                "date": item.date,
                "paymentsPerYear": item.paymentsPerYear
            })
        })

    $('#addModal').modal('toggle')
    buildContent()
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

async function buildContent() {
    let userId = $('#userId').val()
    let data = await getData(userId)
    makeTable(data)
}

$( () => {
    buildContent()
    $('#userForm').on('submit', (e) => {
        e.preventDefault()
        buildContent()
    })
    $('#save-button').on('click', editSubmit)
    $('#delete-button').on('click', deleteSubmit)
    $('#add-button').on('click', addSubmit)
} )
