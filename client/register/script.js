const FORM = document.getElementById('register-form');
const RESPONSE_MESSAGE = document.getElementById('response-message');

// console.log('hello1')
FORM.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log('hello2')
    const formData = new FormData(FORM);
    const data = Object.fromEntries(formData.entries());
    // console.log(data);
    // console.log(JSON.stringify(data));

    if (data.password !== data.confirmPassword) {
        RESPONSE_MESSAGE.textContent = 'Passwords do not match!';
        RESPONSE_MESSAGE.style.color = 'red';
        return;
    }

    try {
        const response = await axios.post('http://localhost:6040/api/auth/register', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const result = await response.data;
        console.log('response.data:');
        // console.log(result);
        console.log('response:')
        // console.log(response);
        // console.log(response.data)

        if (result.success) {
            RESPONSE_MESSAGE.textContent = 'Registration successful Please check your email to verify your account...';
            RESPONSE_MESSAGE.style.color = 'green';
            // alert('Registration successful!');
            setTimeout(() => {
                window.location.href = '../login/';
            }, 2000);
            // window.location.href = '../login/';
        } else {
            // alert(`Login failed: ${result.message}`);
            // console.log(result)
            RESPONSE_MESSAGE.textContent = result.message;
            RESPONSE_MESSAGE.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during registration:');
        console.error(error.response.data);
        RESPONSE_MESSAGE.textContent = error.response.data.message[0].msg;
        RESPONSE_MESSAGE.style.color = 'red';
        // alert('An error occurred. Please try again later.');
    }
});