const FORM = document.getElementById("create-account-form");
const RESPONSE_MESSAGE = document.getElementById("response-message");

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

FORM.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(FORM);
    const data = Object.fromEntries(formData.entries());

    // Attach user id
    data._id = userId;

    console.log("Create Account Payload:", data);

    try {
        const response = await axios.post(
            "http://localhost:6040/api/accounts/create-account",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
            }
        );

        const result = response.data;

        if (result.success) {
            RESPONSE_MESSAGE.textContent =
                "Account created successfully! Redirecting to dashboard...";
            RESPONSE_MESSAGE.style.color = "green";

            console.log("Account created:", result);

            setTimeout(() => {
                window.location.href = "../dashboard/";
            }, 1500);
        } else {
            RESPONSE_MESSAGE.textContent = result.message;
            RESPONSE_MESSAGE.style.color = "red";
        }
    } catch (error) {
        console.error("Account creation error:", error);

        RESPONSE_MESSAGE.textContent =
            error.response?.data?.message || "Something went wrong";
        RESPONSE_MESSAGE.style.color = "red";
    }
});
