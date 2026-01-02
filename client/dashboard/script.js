const dashboardData = {
    customer: {
        firstName: "Omerr",
        accountNumber: "9870 5080 1234",
        accountType: "Savings",
        balance: 25000
    },
    transactions: [
        {
            amount: 2000,
            type: "Debit",
            date: "2025-01-10",
            description: "ATM Withdrawal"
        },
        {
            amount: 30000,
            type: "Credit",
            date: "2025-01-08",
            description: "Salary Credit"
        },
        {
            amount: 1500,
            type: "Debit",
            date: "2025-01-05",
            description: "UPI Transfer"
        }
    ]
}


function setData(id, value) {
    const el = document.getElementById(id);
    el.innerText = value;
}

function formatCurrency(amount) {
    return amount.toLocaleString("en-IN");
}

function fillData(data) {
    setData("nav-customer-name", data.customer.firstName);
    setData("page-customer-name", data.customer.firstName);
    setData("account-number", data.customer.accountNumber);
    setData("account-type", data.customer.accountType);
    setData("balance", (data.customer.balance).toLocaleString("en-IN"));
}

function fillProfile(transactions) {
    const tableBody = document.getElementById("transactions-table");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (transactions.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">No transactions found</td>
            </tr>
        `;
        return;
    }

    transactions.forEach(tranx => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>₹${formatCurrency(tranx.amount)}</td>
            <td class="${tranx.type === "Credit" ? "text-success" : "text-danger"}">
                ${tranx.type}
            </td>
            <td>${tranx.date}</td>
            <td>${tranx.description}</td>
        `;

        tableBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fillData(dashboardData);
    fillProfile(dashboardData.transactions);
});
