async function getLoginLogs() {
    
    const tbody = document.getElementById('logsTableBody');
    
   
    const API_URL = "http://localhost:6040/api/admin/login-logs";
    const token = localStorage.getItem('token'); // Get token from login

    try {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Loading logs...</td></tr>`;

      
        const response = await axios.get(API_URL, {
            headers: {
                'Content-Type': 'application/json',
            'auth-token': token,
            }
        });

        
        const result = response.data;

        if (result.success) {
            tbody.innerHTML = '';

            if (result.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No logs found.</td></tr>';
                return;
            }
            result.data.forEach(log => {
                
                const logDate = new Date(log.timestamp).toLocaleString();
                const statusBadge = log.status === 'success' ? 'bg-success' : 'bg-danger';

                const row = `
                    <tr>
                        <td class="ps-4">
                            <div class="fw-bold">${log.email}</div>
                        </td>
                        <td><span class="badge bg-info text-uppercase">${log.role}</span></td>
                        <td><code>${log.ipAddress}</code></td>
                        <td>${logDate}</td>
                        <td class="text-center">
                            <span class="badge ${statusBadge}">${log.status}</span>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }
    } catch (error) {
        console.error("API Error:", error);
        const errorMessage = error.response ? error.response.data.message : "Server connection failed";
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-4">${errorMessage}</td></tr>`;
    }
}

document.addEventListener('DOMContentLoaded', getLoginLogs);