const token = localStorage.getItem('token');
// const email = localStorage.getItem('email');
const userId = localStorage.getItem('userId');

if (!token || !userId) {
    window.location.href = './login';
} else {
    window.location.href = './dashboard';
    // document.body.innerHTML = `<h1>Welcome, ${email}!</h1><button id="logoutBtn">Logout</button>`;
    
    // document.getElementById('logoutBtn').addEventListener('click', () => {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('email');
    //     localStorage.removeItem('userId');
    //     window.location.href = './login';
    // });
}