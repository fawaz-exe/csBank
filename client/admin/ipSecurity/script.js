const API_URL = "http://localhost:6040/api/admin";
const token = localStorage.getItem('token');

async function loadPolicies() {
    try {
        const response = await axios.get(`${API_URL}/ip-policies`, {
            headers: { "auth-token": token }
        });
        if (response.data.success) {
            renderTable(response.data.data); // result.data.data is the ipPolicies array
        }
    } catch (error) {
        console.error("Load Error:", error);
    }
}

document.getElementById('ipPolicyForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const allowedRoles = Array.from(document.querySelectorAll('.allow-role:checked'))
                              .map(cb => cb.value);
    const blockedRoles = Array.from(document.querySelectorAll('.block-role:checked'))
                              .map(cb => cb.value);

    const payload = {
        ipAddress: document.getElementById('ipAddress').value,
        maxUsers: parseInt(document.getElementById('maxUsers').value) || 5,
        isTrusted: document.getElementById('isTrusted').checked,
        description: document.getElementById('description').value,
        allowedRoles: allowedRoles,
        blockedRoles: blockedRoles
    };

    try {
        const response = await axios.post(`${API_URL}/ip-policies`, payload, {
            headers: { 
                "auth-token": token 
            }
        });

        if (response.data.success) {
            alert("IP Policy saved successfully!");
          
            renderPoliciesTable(response.data.data);
            document.getElementById('ipPolicyForm').reset();
        }
    } catch (error) {
        console.error("Policy Error:", error);
        const msg = error.response?.data?.message || "Failed to save policy";
        alert("Error: " + msg);
    }
});

function renderPoliciesTable(policies) {
    const tbody = document.getElementById('policyTableBody');
    if (!tbody) return;

    if (!policies || policies.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">No policies configured.</td></tr>';
        return;
    }

    tbody.innerHTML = policies.map(p => {
        // Create badges for allowed roles
        const allowedBadges = p.allowedRoles.map(role => 
            `<span class="badge bg-info-light text-info border me-1">${role}</span>`
        ).join('');

        return `
            <tr class="align-middle">
                <td class="ps-4">
                    <div class="fw-bold"><code>${p.ipAddress}</code></div>
                    <div class="small text-muted">${p.description || 'No description'}</div>
                </td>
                <td>
                    ${p.isTrusted ? 
                        '<span class="badge bg-success">TRUSTED</span>' : 
                        '<span class="badge bg-light text-dark border">STANDARD</span>'}
                </td>
                <td>${allowedBadges || '<span class="text-muted small">None</span>'}</td>
                <td><span class="fw-bold">${p.maxUsers}</span></td>
                <td class="text-end pe-4">
                    <span class="badge rounded-pill ${p.isActive ? 'bg-success' : 'bg-danger'}">
                        ${p.isActive ? 'Active' : 'Disabled'}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}




async function loadInitialData() {
    try {
        const response = await axios.get(`http://localhost:6040/api/auth/me`, {
            headers: { "auth-token": token }
        });
        const adminData = response.data.data.adminProfile;
        if (adminData && adminData.ipPolicies) {
            renderPoliciesTable(adminData.ipPolicies);
        }
    } catch (error) {
        console.error("Load Policies Error:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadInitialData);