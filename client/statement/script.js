const statementData = {
    customer: {
        firstName: "Omerr",
        accountNumber: "9870 5080 1234"
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
        },
        {
            amount: 500,
            type: "Debit",
            date: "2025-01-02",
            description: "Mobile Recharge"
        }
    ]
};

function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) {
        el.innerText = value;
    }
}

function formatCurrency(amount) {
    return amount.toLocaleString("en-IN");
}

function fillHeader(data) {
    setText("nav-customer-name", data.customer.firstName);
    setText("account-number", data.customer.accountNumber);
}

function fillStatement(transactions) {
    const tableBody = document.getElementById("statement-table");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (transactions.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    No transactions available
                </td>
            </tr>
        `;
        return;
    }

    transactions.forEach(transx => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="${transx.type === "Credit" ? "text-success" : "text-danger"}"><span>${transx.type === "Credit" ? "+" : "-"}</span> ₹${formatCurrency(transx.amount)}</td>
            <td class="${transx.type === "Credit" ? "text-success" : "text-danger"}">
                ${transx.type}
            </td>
            <td>${transx.date}</td>
            <td>${transx.description}</td>
        `;

        tableBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fillHeader(statementData);
    fillStatement(statementData.transactions);
});
