const FORM = document.getElementById('register-form');

console.log('hello1')
FORM.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log('hello2')
    const formData = new FormData(FORM);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    // console.log(JSON.stringify(data));

    // try {
    //     const response = await fetch('/api/register', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(data),
    //     });

    //     const result = await response.json();

    //     if (response.ok) {
    //         alert('Registration successful! Please log in.');
    //         window.location.href = './login';
    //     } else {
    //         alert(`Registration failed: ${result.message}`);
    //     }
    // } catch (error) {
    //     console.error('Error during registration:', error);
    //     alert('An error occurred. Please try again later.');
    // }
});