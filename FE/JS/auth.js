/**
 * Hàm chạy khi toàn bộ HTMl được load
 */
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.querySelector(".btn-login");
    if (loginBtn) loginBtn.addEventListener("click", login);

    const registerForm = document.querySelector("#registerForm");
    if (registerForm) registerForm.addEventListener("submit", registerUser);
});

/**
 * Hàm đăng nhập
 * @returns 
 */
async function login() {
    // Lấy dữ liệu từ input 
    const username = document.getElementById("tendangnhap").value.trim();
    const password = document.getElementById("password").value.trim();
    // Kiem tra input
    if (!username || !password) {
        alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
        return;
    }

    try {
        const res = await fetch("http://localhost:6025/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tendangnhap: username,
                matkhau: password
            })
        });

        const text = await res.text();
        let result;

        try {
            result = JSON.parse(text);
        } catch {
            alert("Server lỗi: " + text);
            return;
        }

        if (!res.ok) {
            alert(result.message || "Đăng nhập thất bại");
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(result));

        alert("Đăng nhập thành công!");
        window.location.href = "/HTML/Trangchung/user.html";

    } catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }
}

/**
 * Hàm đăng ký
 * @param {*} e 
 * @returns 
 */
async function registerUser(e) {
    e.preventDefault(); // Chặn ng dung submit form

    // Lấy dữ liệu từ input
    const hoten = document.querySelector('[name="fullname"]').value.trim();
    const tendangnhap = document.querySelector('[name="tendangnhap"]').value.trim();
    const email = document.querySelector('[name="email"]').value.trim();
    const matkhau = document.querySelector('[name="password"]').value;
    const repassword = document.querySelector('[name="repassword"]').value;

    // Kiem tra dữ liệu
    if (!hoten || !tendangnhap || !email || !matkhau || !repassword) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }
    // Kiem tra độ dai mat khau
    if (matkhau.length < 6) {
        alert("Mật khẩu phải >= 6 ký tự");
        return;
    }
    // Kiem tra mat khau va mat khau nhap lai
    if (matkhau !== repassword) {
        alert("Mật khẩu nhập lại không khớp");
        return;
    }

    try {
        const res = await fetch("http://localhost:6025/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                hoten,
                tendangnhap,
                email,
                matkhau
            })
        });

        const text = await res.text();
        let result;

        try {
            result = JSON.parse(text);
        } catch {
            alert("Server lỗi: " + text);
            return;
        }

        if (!res.ok) {
            alert(result.message || "Đăng ký thất bại");
            return;
        }

        alert("Đăng ký thành công!");
        window.location.href = "/HTML/Trangchung/login.html";

    } catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }
}

/**
 * Hàm che mật khẩu (chỉ hiện 3 ký tự đầu)
 * @param {*} password 
 * @returns 
 */
function maskPassword(password) {

    if (!password) return "";

    const first3 = password.substring(0, 3);
    const masked = "*".repeat(password.length - 3);

    return first3 + masked;
}
/**
 * Gợi ý mật khẩu
 * @returns 
 */
async function goiYMatKhau() {

    const input = document.getElementById("inputAccount").value.trim();
    const alertBox = document.getElementById("alertBox");

    if (!input) {
        showAlert("Vui lòng nhập tên đăng nhập hoặc email!", "danger");
        return;
    }

    try {
        const res = await fetch("http://localhost:6025/api/users/all");

        if (!res.ok) {
            showAlert("Không thể kết nối server!", "danger");
            return;
        }

        const users = await res.json();

        // tìm user theo username hoặc email
        const user = users.find(u =>
            u.tendangnhap.toLowerCase() === input.toLowerCase() ||
            u.email.toLowerCase() === input.toLowerCase()
        );

        if (!user) {
            showAlert("Không tìm thấy tài khoản!", "danger");
            return;
        }

        // hiển thị gợi ý mật khẩu
        showAlert(
            `Gợi ý mật khẩu của bạn là: <strong>${maskPassword(user.matkhau)}</strong>`,
            "success"
        );

    } catch (error) {

        console.error("Fetch error:", error);
        showAlert("Có lỗi xảy ra!", "danger");

    }
}


/**
 * Hiển thị alert
 * @param {*} message 
 * @param {*} type 
 */
function showAlert(message, type) {

    const alertBox = document.getElementById("alertBox");

    alertBox.className = `alert alert-${type}`;
    alertBox.innerHTML = message;
    alertBox.classList.remove("d-none");

}
/**
 * Bảo vệ trang chính
 */
function protectPage() {
    const user = localStorage.getItem("currentUser");
    if (!user) {
        window.location.href = "/HTML/Trangchung/login.html";
    }
}

/**
 * Hàm đăng xuất
 */
async function logout() {
    const user = getCurrentUser(); 
    const userId = user?.id_nguoi_dung;

    if (userId) {
        try {
            await fetch(`http://localhost:6025/api/users/logout/${userId}`, { 
                method: "POST" 
            });
        } catch (err) {
            console.error("Lỗi ghi nhận nhật ký đăng xuất:", err);
        }
    }

    localStorage.removeItem("currentUser");
    sessionStorage.clear();
    window.location.href = "/HTML/Trangchung/login.html";
}
/**
 * Lấy user hiện tại
 * @returns 
 */
function getCurrentUser() {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    try {
        const data = JSON.parse(raw);
        return data.user || data;
    } catch {
        return null;
    }

}

/**
 * Kiem tra nguoi dung la admin
 * @returns 
 */
function isAdmin() {

    const user = getCurrentUser();

    if (!user) return false;

    return user.id_nguoi_dung === "11111111-1111-1121-1111-111111111111";

}

/**
 * Kiem tra nguoi dung la nguoi dung thuong
 * @returns 
 */
function isUser() {

    const user = getCurrentUser();

    if (!user) return false;

    return !isAdmin();

}
/**
 * Tạo sidebar  
 */
document.addEventListener("DOMContentLoaded", () => {

    if (isAdmin()) {

        const sidebar = document.getElementById("sidebarMenu");
        if (!sidebar) return;
        sidebar.innerHTML = `
            <a href="user.html">
                <i class="bi bi-house-door"></i> Trang chủ
            </a>

            <a href="../Admin/quanliduan.html" class="active">
                <i class="bi bi-kanban"></i> Quản lí dự án
            </a>

            <a href="../Admin/quanlinguoidung.html">
                <i class="bi bi-people"></i> Quản lí người dùng
            </a>

            <a href="../Admin/nhatkihoatdong.html">
                <i class="bi bi-journal-text"></i> Nhật ký hoạt động
            </a>

            <a href="../Admin/thongke.html">
                <i class="bi bi-shield-lock"></i> Thống kê
            </a>

            <a href="../Admin/chinhsuatk.html">
                <i class="bi bi-gear"></i> Cài đặt tài khoản
            </a>
        `;

    }

});
