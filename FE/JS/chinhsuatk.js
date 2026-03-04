const API_URL = "http://localhost:6025/api/users";

let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {

    const raw = localStorage.getItem("currentUser");

    if (!raw) {
        window.location.href = "login.html";
        return;
    }

    const data = JSON.parse(raw);
    currentUser = data.user || data;

    const topbar = document.querySelector(".topbar div");
if (topbar) {
    topbar.innerHTML =
        `<i class="bi bi-person-circle"></i> Xin chào, ${currentUser.hoten}`;
}
    document.getElementById("fullName").value = currentUser.hoten || "";
    document.getElementById("email").value = currentUser.email || "";
});


async function handleSave(e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!fullName || !email) {
        showAlert("Vui lòng nhập đầy đủ họ tên và email", "danger");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${currentUser.id_nguoi_dung}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                hoten: fullName,
                email: email
            })
        });



        if (!res.ok) {
            const err = await res.json();
            showAlert(err.message || "Cập nhật thất bại", "danger");
            return;
        }

        currentUser.hoten = fullName;
        currentUser.email = email;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));


        if (currentPassword || newPassword || confirmPassword) {

            if (!currentPassword || !newPassword || !confirmPassword) {
                showAlert("Vui lòng nhập đầy đủ thông tin đổi mật khẩu", "danger");
                return;
            }

            if (newPassword !== confirmPassword) {
                showAlert("Mật khẩu xác nhận không khớp", "danger");
                return;
            }

            const passRes = await fetch(`${API_URL}/forgot-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: currentUser.id_nguoi_dung,
                    matkhaucu: currentPassword,
                    matkhaumoi: newPassword
                })
            });

            const passResult = await passRes.json();

            if (!passRes.ok) {
                showAlert(passResult.message || "Đổi mật khẩu thất bại", "danger");
                return;
            }

            // Bắt đăng nhập lại
            alert("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
            localStorage.removeItem("currentUser");
            window.location.href = "../Trangchung/login.html";
            return;
        }


    } catch (error) {
        console.error(error);
        showAlert("Không kết nối được server", "danger");
    }
    
}


function showAlert(message, type) {

    const oldAlert = document.querySelector(".custom-alert");
    if (oldAlert) oldAlert.remove();

    const alert = document.createElement("div");
    alert.className = `alert alert-${type} alert-dismissible fade show mt-3 custom-alert`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.querySelector(".card-body").prepend(alert);
}
