const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

const FORM = document.getElementById("complete-profile-form");
const RESPONSE_MESSAGE = document.getElementById("response-message");

async function getUserDetails() {
    console.log('getUserDetails')
    const response = await axios.get('http://localhost:6040/api/auth/me', {
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
        },
    });

    const result = await response.data.data.user;
    console.log('User Details:');
    console.log(result);
    return result;
}
getUserDetails().then(user => {
    console.log('Populating form with user details');
    // Populate form fields with user details
    document.querySelector('input[name="email"]').value = user.email;
    document.querySelector('input[name="phone"]').value = user.phone;
});

FORM.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(FORM);
    const data = Object.fromEntries(formData.entries());
    console.log('Form Data:', data);
    data._id = userId;
    data.address = {
        street: data.street,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
    };
    // Remove individual address fields from data
    delete data.street;
    delete data.city;
    delete data.state;
    delete data.pincode;

    try {
        const response = await axios.post(
            "http://localhost:6040/api/customers/complete-profile", data, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token,
            },
        }
        );

        const result = await response.data;

        if (result.success) {
            console.log('Profile completed successfully: ');
            console.log(result);
            RESPONSE_MESSAGE.textContent =
                "Profile completed successfully! Redirecting to dashboard...";
            RESPONSE_MESSAGE.style.color = "green";
            // alert('Profile completed successfully!');
            // window.location.href = "../dashboard/";
        } else {
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
        // alert('An error occurred. Please try again later.');
    }
});