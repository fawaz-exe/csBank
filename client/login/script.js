const FORM = document.getElementById('login-form');

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
        console.log(result);
        console.log('response:')
        console.log(response);

        if (result.success) {
            alert('Login successful!');
            window.location.href = '../dashboard/';
        } else {
            // alert(`Login failed: ${result.message}`);
            console.log(result.message)
        }
    } catch (error) {
        console.error('Error during registration:');
        console.error(error);
        // alert('An error occurred. Please try again later.');
    }
});