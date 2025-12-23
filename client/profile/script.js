const ctmProfile = {
    firstName: "Omerr",
    lastName: "Quadri",
    dob: "2002-05-14",
    email: "omer@code.in",
    mobile: "+91 8080808080",
    street: "MG Road",
    city: "Hyderabad",
    pincode: "500001",
    accountNumber: "XXXX XXXX 1234",
    accountType: "Savings",
    branch: "Hyderabad Main"
};

function setValues(id, value) {
    const el = document.getElementById(id);
    el.innerText = value;
}

function setProfileData(data) {
    setValues("first-name", data.firstName);
    setValues("last-name", data.lastName);
    setValues("dob", data.dob);

    setValues("email", data.email);
    setValues("mobile", data.mobile);

    setValues("street", data.street);
    setValues("city", data.city);
    setValues("pincode", data.pincode);

    setValues("account-number", data.accountNumber);
    setValues("account-type", data.accountType);
    setValues("branch", data.branch);

    setValues("customer-name", data.firstName);
}

document.addEventListener("DOMContentLoaded", () => {
    setProfileData(ctmProfile);
});
