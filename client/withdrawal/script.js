function validateLeftForm(){
    const accountNumber = document.getElementById("l_accountNumber").value
    const confirmAccountNumber = document.getElementById("l_confirmAccountNumber").value
    const name = document.getElementById("l_name").value
    const amount = document.getElementById("l_amount").value;
    const method = document.getElementById("l_withdrawal-method").value
    const description = document.getElementById("l_description").value;

    if(!accountNumber){
        alert("Please enter Account Number")
        return false;
    }
    if(!confirmAccountNumber){
        alert("Please provide the required field")
        return false;
    }
    if(!name){
        alert("Please enter Name")
        return false;
    }
    if(!amount || amount < 0){
        alert("Please enter valid Amount")
        return false;
    }
    if(!method){
        alert("Please select Withdrawal Method")
        return false;
    }
    if(accountNumber != confirmAccountNumber){
        alert("Account Number and Confirmation Account Number do not match");
        return false;
    }
        return true;
}

function validateRightForm(){
    const accountNumber = document.getElementById("r_accountNumber").value
    const confirmAccountNumber = document.getElementById("r_confirmAccountNumber").value
    const name = document.getElementById("r_name").value
    const amount = document.getElementById("r_amount").value;
    const method = document.getElementById("r_withdrawal-method").value
    const description = document.getElementById("r_description").value;

    if(!accountNumber){
        alert("Please enter Account Number")
        return false;
    }
    if(!confirmAccountNumber){
        alert("Please provide the required field")
        return false;
    }
    if(!name){
        alert("Please enter Name")
        return false;
    }
    if(!amount || amount < 0){
        alert("Please enter valid Amount")
        return false;
    }
    if(!method){
        alert("Please select Withdrawal Method")
        return false;
    }
    if(accountNumber != confirmAccountNumber){
        alert("Account Number and Confirmation Account Number do not match");
        return false;
    }
        return true;
}

const reviewBtn = document.getElementById("review-button")
const leftForm = document.getElementById("l_withdrawal-form")
const rightForm = document.getElementById("r_withdrawal-form")

reviewBtn.addEventListener("click", function(e){
    e.preventDefault(); 

    if(!validateLeftForm()) return;

    document.getElementById("r_accountNumber").value = document.getElementById("l_accountNumber").value
    document.getElementById("r_confirmAccountNumber").value = document.getElementById("l_confirmAccountNumber").value
    document.getElementById("r_name").value = document.getElementById("l_name").value
    document.getElementById("r_amount").value = document.getElementById("l_amount").value
    document.getElementById("r_withdrawal-method").value = document.getElementById("l_withdrawal-method").value
    document.getElementById("r_description").value = document.getElementById("l_description").value

    Array.from(leftForm.elements).forEach(ele => {
      ele.disabled = true;
    });
    rightForm.classList.remove("d-none");
})

//------------------------------------------------------------------------------

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

const RESPONSE_MESSAGE = document.getElementById("response-message");



rightForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if(!validateRightForm()) return;

    const formData = new FormData(rightForm);
    const data = Object.fromEntries(formData.entries());
    console.log("Form Data: ", data);
    data.amount = Number(data.amount);

    try {
        const response = await axios.post(
            "http://localhost:6040/api/transactions/withdraw", data, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
            }
        );

        const result = await response.data;
        if(result.success){
            console.log("Withdrawal successfull");
            console.log(result);

            RESPONSE_MESSAGE.textContent = "Withdrawal successfull"
            RESPONSE_MESSAGE.style.color = "green";
        }
        else {
            RESPONSE_MESSAGE.textContent = result.message;
            RESPONSE_MESSAGE.style.color = "red";
            console.log('Profile completion failed: ');
            console.log(result);
        }
    } catch (error) {
        console.error("Error during profile completion:");
        console.error(error);
        RESPONSE_MESSAGE.textContent = error.response.data.message;
        RESPONSE_MESSAGE.style.color = "red";
    }
});

//------------------------------------------------------------------------------

