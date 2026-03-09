/**
 * Hàm chạy khi toàn bộ HTMl được load
 */
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id') || "";
    bindAdminSidebar(projectId);

    if (document.getElementById("projectTableBody")) loadProjects();
    if (document.getElementById("userTableBody")) loadUsers();
    
    if (document.getElementById("activityTableBody")) {
        loadUsersForSelect(); 
        loadActivities();     
    }
});
/**
 * Gắn link sidebar theo id dự án
 * @param {*} projectId 
 */
function bindAdminSidebar(projectId) {
    const links = {
        "linkTrangChu": `../Trangchung/user.html?id=${projectId}`,
        "linkQuanLiDuAn": `quanliduan.html?id=${projectId}`,
        "linkQuanLiNguoiDung": `quanlinguoidung.html?id=${projectId}`,
        "LinkThongKe": `thongke.html?id=${projectId}`,
        "linkNhatKy": `nhatkihoatdong.html?id=${projectId}`,
        "linkCaiDat": `chinhsuatk.html?id=${projectId}`
    };
    // Gắn href cho từng link
    for (let id in links) {
        const el = document.getElementById(id);
        if (el) el.href = links[id];
    }
}

/**
 * Lấy danh sách dự án từ API
 */
async function loadProjects() {
    try {
        const res = await fetch("http://localhost:6025/api/project/all");
        if (res.ok) {
            const projects = await res.json();
            renderProjects(projects);
        }
    } catch (err) { console.error("Lỗi tải dự án:", err); }
}
/**
 * Render danh sách dự án vào bảng
 * @param {*} list 
 * @returns 
 */
function renderProjects(list) {
    const tbody = document.getElementById("projectTableBody");
    if (!tbody) return;
    tbody.innerHTML = list.map(p => `
        <tr>
            <td>${p.tieu_de}</td>
            <td>${p.mo_ta}</td>
            <td>${new Date(p.ngay_tao).toLocaleDateString("vi-VN")}</td>
            <td>
                <a href="../Nguoidung/chitietduan.html?id=${p.id}" class="btn btn-info btn-sm">
                    <i class="bi bi-eye"></i> Xem
                </a>
                <button class="btn btn-danger btn-sm" onclick="adminDeleteProject('${p.id}')">
                    <i class="bi bi-trash"></i> Xóa
                </button>
            </td>
        </tr>
    `).join('');
}
/**
 * Admin xóa dự án
 * @param {*} projectId 
 * @returns 
 */
async function adminDeleteProject(projectId) {
    if (!confirm("Bạn chắc chắn muốn xóa dự án này?")) return;
    try {
        const res = await fetch(`http://localhost:6025/api/project/${projectId}`, { method: "DELETE" });
        if (res.ok) { 
            alert("Xóa dự án thành công"); 
            loadProjects(); 
        }
    } 
    catch (err) { 
        alert("Lỗi kết nối server"); 
    }
}

/**
 * Lấy danh sách người dùng từ API
 */
async function loadUsers() {
    try {
        const res = await fetch("http://localhost:6025/api/users/all");
        if (res.ok) {
            const users = await res.json();
            renderUsers(users);
        }
    } catch (err) { console.error("Lỗi tải người dùng:", err); }
}
/**
 * Hiển thị danh sách user vào bảng
 * @param {*} list 
 * @returns 
 */
function renderUsers(list) {
    const tbody = document.getElementById("userTableBody");
    if (!tbody) return;
    tbody.innerHTML = list.map(u => {
        // Hiển thị role
        const roleText = u.loai_tai_khoan == 2 ? "Admin" : "Người dùng";
        // Hiển thị trang thai
        const statusBadge = u.trang_thai === 1 
            ? '<span class="badge bg-success">Hoạt động</span>' 
            : '<span class="badge bg-danger">Đã khóa</span>';
        // Hiển thị button lock
        const lockBtnClass = u.trang_thai === 1 ? 'btn-warning' : 'btn-success';
        const lockIcon = u.trang_thai === 1 ? 'bi-lock' : 'bi-unlock';

        return `
        <tr>
            <td>${u.hoten}</td>
            <td>${u.tendangnhap}</td>
            <td>${u.email}</td>
            <td>${roleText}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn ${lockBtnClass} btn-sm" onclick="adminToggleLock('${u.id_nguoi_dung}', ${u.trang_thai})">
                    <i class="bi ${lockIcon}"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="adminDeleteUser('${u.id_nguoi_dung}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>`;
    }).join('');
}

/**
 * Khóa hoặc mở khóa tài khoản
 * @param {*} userId 
 * @param {*} currentStatus 
 * @returns 
 */
async function adminToggleLock(userId, currentStatus) {
    const actionText = currentStatus === 1 ? "khóa" : "mở khóa";
    if (!confirm(`Bạn muốn ${actionText} người dùng này?`)) return;
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
        const res = await fetch(`http://localhost:6025/api/users/status/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            // Gửi trạng thái mới
            body: JSON.stringify({ trang_thai: newStatus }) 
        });
        if (res.ok) {
            alert(`Đã ${actionText} thành công!`); 
            loadUsers(); 
        }
    } catch (err) { 
        alert("Lỗi kết nối"); 
    }
}
/**
 * Admin xóa người dùng
 * @param {*} userId 
 * @returns 
 */
async function adminDeleteUser(userId) {
    if (!confirm("Xóa người dùng này?")) return;

    try {
        const res = await fetch(
            `http://localhost:6025/api/users/delete-user/${userId}`,
            { method: "DELETE" }
        );

        if (!res.ok) {
            const errorText = await res.text();
            alert("Lỗi: " + errorText);
            return;
        }

        alert("Xóa thành công");
        loadUsers();
    } catch (err) {
        alert("Lỗi kết nối: " + err.message);
    }
}
/**
 * Load danh sách user vào dropdown filter
 */
async function loadUsersForSelect() {
    try {
        const res = await fetch("http://localhost:6025/api/users/all");
        const userList = await res.json();

        const select = document.getElementById("userFilterSelect");

        select.innerHTML = `
            <option value="">-- Tất cả --</option>
            ${userList.map(u =>
                `<option value="${u.id_nguoi_dung}">${u.hoten}</option>`
            ).join("")}
        `;

    } catch (err) {
        console.error(err);
    }
}
/**
 * Lấy nhật ký hoạt động từ server
 * @returns 
 */
async function loadActivities() {
    const userId = document.getElementById("userFilterSelect")?.value;

    let url = "http://localhost:6025/Activity/filter";

    if (userId && userId.trim() !== "") {
        url += `?userId=${userId}`;
    }

    try {
        const res = await fetch(url);

        if (!res.ok) {
            console.error("Server error:", res.status);
            return;
        }

        const data = await res.json();
        renderActivities(data);

    } catch (err) {
        console.error(err);
    }
}
/**
 * Hiển thị nhật ký hoạt động
 * @param {*} list 
 * @returns 
 */
function renderActivities(list) {
    const tbody = document.getElementById("activityTableBody");
    if (!tbody) return;
    tbody.innerHTML = list.map((act, index) => {
        // Tự động tô đỏ nếu hành động là đăng xuất
        const isLogout = act.hanh_dong.toLowerCase().includes("xuất");
        return `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${act.hoten || "N/A"}</strong></td>
            <td>${act.email || "N/A"}</td>
            <td><span class="badge ${isLogout ? 'bg-danger' : 'bg-primary'}">${act.hanh_dong}</span></td>
            <td>${new Date(act.thoi_gian).toLocaleString("vi-VN")}</td>
        </tr>`;
    }).join('');
}

/**
 * Đăng xuất hệ thống
 * @returns
 */
async function logout() {
    const raw = localStorage.getItem("currentUser");
    if (raw) {
        try {
            const data = JSON.parse(raw);
            const userId = data.id_nguoi_dung || (data.user && data.user.id_nguoi_dung);

            if (userId) {
                await fetch(`http://localhost:6025/api/users/logout/${userId}`, { 
                    method: "POST" 
                });
            }
        } catch (err) {
            console.error("Lỗi khi ghi log logout:", err);
        }
    }
    // Xóa session
    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "../Trangchung/login.html";
}
// Cho phép gọi logout từ HTML
window.logout = logout;