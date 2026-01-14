const token = localStorage.getItem('token');
// const email = localStorage.getItem('email');
const userId = localStorage.getItem('userId');
const role = localStorage.getItem('role')


if (!token || !userId) {
    window.location.href = './login';
} else {
    if(role === 'admin'){
        window.location.href = './admin/userManagemet/index.html'
    }else{
        window.location.href = './dashboard';
    }
    // document.body.innerHTML = `<h1>Welcome, ${email}!</h1><button id="logoutBtn">Logout</button>`;
    
    // document.getElementById('logoutBtn').addEventListener('click', () => {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('email');
    //     localStorage.removeItem('userId');
    //     window.location.href = './login';
    // });
}