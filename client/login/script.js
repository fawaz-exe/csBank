const FORM = document.getElementById('login-form');
const RESPONSE_MESSAGE = document.getElementById('response-message');

console.log('hello1')
FORM.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log('hello2')
    const formData = new FormData(FORM);
    const data = Object.fromEntries(formData.entries());
    // console.log(data);
    // console.log(JSON.stringify(data));

    try {
        const response = await axios.post('http://localhost:6040/api/auth/login', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const result = await response.data;
        console.log('response.data:');
        // console.log(result);
        console.log('response:')
        console.log(response);
        // console.log(response.data)

        if (result.success) {
            RESPONSE_MESSAGE.textContent = 'Login successful...';
            RESPONSE_MESSAGE.style.color = 'green';
            localStorage.setItem('token', response.data.data.jwtToken);
            localStorage.setItem('userId', response.data.data._id);
            localStorage.setItem('user', JSON.stringify(response.data.data));

            setTimeout(() => {
                loginSuccess();
            }, 2000);
            // alert('Login successful!');
            // window.location.href = '../dashboard/';
        } else {
            // alert(`Login failed: ${result.message}`);
            // console.log(result)
            RESPONSE_MESSAGE.textContent = result.message;
            RESPONSE_MESSAGE.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during Login:');
        console.error(error.response.data.message);
        RESPONSE_MESSAGE.textContent = error.response.data.message;
        RESPONSE_MESSAGE.style.color = 'red';
        // alert('An error occurred. Please try again later.');
    }
});

async function loginSuccess() {
    console.log('loginSuccess')
    const response = await axios.get('http://localhost:6040/api/auth/me', {
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
        },
    });

    const result = await response.data.data;
    console.log('User Details:');
    console.log(result);
    if (result.profileCompleted) {
        window.location.href = '../dashboard/';
    } else {
        window.location.href = '../complete-profile/';
    }
}
