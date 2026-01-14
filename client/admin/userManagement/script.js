const API_URL = "http://localhost:6040/api/admin";

const token = localStorage.getItem('token');

function handleRoleUIChange() {
  const role = document.getElementById("role").value;
  const empIdContainer = document.getElementById("empIdContainer");
  const dobContainer = document.getElementById("dobContainer");

  if (role === "customer") {
    empIdContainer.classList.add("d-none");
    dobContainer.classList.remove("d-none");
  } else {
    empIdContainer.classList.remove("d-none");
    dobContainer.classList.add("d-none");
  }
}

document.getElementById("createUserForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      password: document.getElementById("password").value,
      role: document.getElementById("role").value,
      firstName: document.getElementById("firstName").value,
      employeeId: document.getElementById("employeeId").value,
      dateOfBirth: document.getElementById("dateOfBirth").value,
    };

    try {
    
        const response = await axios.post(`${API_URL}/users/create`, payload, {
            headers: { "auth-token": token }
        });

        if (response.data.success) {
            alert("User created!");
            location.reload();
        }
    } catch (error) {
        alert("Error: " + error.response.data.message);
    }
});

async function deleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`, {
      headers: { "auth-token": token }
    });

    if (response.data.success) {
      alert(response.data.message);
      location.reload();
    }
  } catch (error) {
    alert("Action Failed: " + error.response.data.message);
  }
}

async function loadUsersIntoTable() {
  try {
    const response = await axios.get(`${API_URL}/all-users`, {
      headers: { "auth-token": token }
    });

    const result = response.data; 

    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";
    
    result.data.forEach((user) => {
      const row = `
                <tr class="align-middle">
                    <td class="ps-4">
                        <div class="fw-bold">${user.email}</div>
                        <div class="small text-muted">ID: ${user._id}</div>
                    </td>
                    <td><span class="badge bg-info">${user.role}</span></td>
                    <td>
                        <span class="badge ${user.isActive ? "bg-success" : "bg-danger"}">
                            ${user.isActive ? "Active" : "Inactive"}
                        </span>
                    </td>
                    <td class="text-end pe-4">
                        <button onclick="deleteUser('${user._id}')" class="btn btn-outline-danger btn-sm">
                             Delete
                        </button>
                    </td>
                </tr>
            `;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error("Failed to load users", err);
    document.getElementById("userTableBody").innerHTML = "<tr><td colspan='4' class='text-center text-danger'>Failed to load data from server.</td></tr>";
  }
}

// Initial call
loadUsersIntoTable();