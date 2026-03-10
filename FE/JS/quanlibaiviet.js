const POST_API = "http://localhost:6025/api/post/project";

let projectId = null; // id dự án hiện tại
let posts = []; // danh sách bài viết trong dự án
/**
 * Gắn link sidebar theo id dự án
 * @param {*} projectId 
 */
function bindSidebar(projectId) {
    document.getElementById("linkTrangChu").href =
        `/HTML/Trangchung/user.html?id=${projectId}`;

    document.getElementById("linkBaiVietCuaToi").href =
        `baivietcuatoi.html?id=${projectId}`;

    document.getElementById("linkDuyetBaiViet").href =
        `duyetbaiviet.html?id=${projectId}`;

    document.getElementById("linkThanhVien").href =
        `quanlithanhvien.html?id=${projectId}`;

    document.getElementById("linkChinhSua").href =
        `chinhsuaduan.html?id=${projectId}`;

}
/**
 * Hàm chạy khi toàn bộ HTMl được load
 */
document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    projectId = params.get("id");

    if (!projectId) {
        alert("Không tìm thấy projectId");
        return;
    }

    bindSidebar(projectId);
    await loadPosts();

    await loadProjectDetail(projectId);

    loadUserInfo();

});

/**
 * Lấy thống tin người dùng hiện tại
 * @returns 
 */
function loadUserInfo() {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return;

    const data = JSON.parse(raw);
    const user = data.user || data;

    document.getElementById("nguoiDangNhap").innerText =
        user.hoten || user.tendangnhap || "User";
}
/**
 * Lấy thống tin dự án
 * @param {*} projectId 
 * @returns 
 */
async function loadProjectDetail(projectId) {
    try {
        const res = await fetch(`http://localhost:6025/api/project/${projectId}`);

        if (!res.ok) {
            alert("Không lấy được dữ liệu dự án");
            return;
        }
        
        const data = await res.json();
        console.log("Project detail:", data);

        const p = Array.isArray(data) ? data[0] : data;

        document.getElementById("tenDuAn").innerText = p.tieu_de;
        document.getElementById("nguoiTao").innerText = p.ten_nguoi_tao;

        document.getElementById("ngayTao").innerText =
            new Date(p.ngay_tao).toLocaleDateString("vi-VN");

        const topTitle = document.querySelector(".topbar b");
        if (topTitle) {
            topTitle.innerText = "QUẢN LÍ BÀI ĐĂNG DỰ ÁN: " + p.tieu_de;
        }

    } catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }
}
/**
 * Gán hàm chính sửa, xóa dự án 
 */
function bindActions() {
    const btnXoa = document.getElementById("btnXoaDuAn");
    const btnSua = document.getElementById("btnSuaDuAn");

    if (btnXoa) btnXoa.onclick = deleteProject;
    if (btnSua) {
        btnSua.onclick = () => {
            window.location.href = `chinhsuaduan.html?id=${id}`;
        };
    }
}

/**
 * Lấy bài viết trong dự án
 */
async function loadPosts() {
    try {
        const res = await fetch(`${POST_API}/${projectId}`);
        if (!res.ok)
            throw new Error("Không thể tải bài viết");

        posts = await res.json();
        console.log("Posts:", posts);
        renderPosts(posts);

    }
    catch (err) {
        console.error(err);
        alert("Lỗi load bài viết");
    }
}
/**
 * Hàm render bài viết 
 * @param {*} posts 
 */
function renderPosts(posts) {

    const tbody = document.getElementById("postTableBody");

    tbody.innerHTML = "";

    posts.forEach((post, index) => {

        const statusBadge =
            post.trang_thai == 0
                ? `<span class="badge bg-warning text-dark">Chưa duyệt</span>`
                : `<span class="badge bg-success">Đã duyệt</span>`;

        const actionButtons =
            post.trang_thai == 0
                ? `
                <button class="btn btn-sm btn-info"
                    onclick="viewPost(${index})">
                    <i class="bi bi-eye"></i> Xem chi tiết
                </button>

                <button class="btn btn-sm btn-success ms-2"
                    onclick="approvePost('${post.id_bai_dang}')">
                    <i class="bi bi-check-circle"></i> Duyệt
                </button>

                <button class="btn btn-sm btn-outline-danger ms-2"
                    onclick="deletePost('${post.id_bai_dang}')">
                    <i class="bi bi-trash"></i> Xóa
                </button>
                `
                :
                `
                <button class="btn btn-sm btn-info"
                    onclick="viewPost(${index})">
                    <i class="bi bi-eye"></i> Xem chi tiết
                </button>
                <button class="btn btn-sm btn-outline-danger ms-2"
                    onclick="deletePost('${post.id_bai_dang}')">
                    <i class="bi bi-trash"></i> Xóa
                </button>
                `;

        const row = `
            <tr>
                <td>${post.tac_gia}</td>
                <td><strong>${post.tieu_de}</strong></td>
                <td>${statusBadge}</td>
                <td>${actionButtons}</td>
            </tr>
        `;

        tbody.innerHTML += row;

    });

}
/**
 * Hàm xem bài viết
 * @param {*} index 
 */
function viewPost(index) {

    const post = posts[index];

    const status =
        post.trang_thai == 0
            ? "Chưa duyệt"
            : "Đã duyệt";

    const html = `
        <p><strong>Tác giả:</strong> ${post.tac_gia}</p>
        <p><strong>Tiêu đề:</strong> ${post.tieu_de}</p>
        <p><strong>Nội dung:</strong><br>${post.noi_dung}</p>
        <p><strong>Trạng thái:</strong> ${status}</p>
        <p><strong>Ngày tạo:</strong> ${new Date(post.ngay_tao).toLocaleDateString("vi-VN")}</p>
    `;

    document.getElementById("postModalBody").innerHTML = html;

    const modal = new bootstrap.Modal(document.getElementById("postModal"));

    modal.show();

}
/**
 * Hàm duyệt bài viết
 * @param {*} postId 
 * @returns 
 */
async function approvePost(postId) {

    if (!confirm("Duyệt bài viết này?"))
        return;

    try {
        const res = await fetch(`http://localhost:6025/api/post/approve/${postId}`, {
            method: "PUT", // hoặc PATCH tùy backend
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!res.ok)
            throw new Error("Duyệt thất bại");

        alert("Đã duyệt bài viết");

        await loadPosts(); // reload lại danh sách

    }
    catch (err) {
        console.error(err);
        alert("Lỗi duyệt bài");
    }
}
/**
 * Hàm từ chối bài viết
 * @param {*} postId 
 * @returns 
 */
async function rejectPost(postId) {

    if (!confirm("Từ chối bài viết này?"))
        return;

    try {
        const res = await fetch(`http://localhost:6025/api/post/reject/${postId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!res.ok)
            throw new Error("Từ chối thất bại");

        alert("Đã từ chối bài viết");

        await loadPosts();

    }
    catch (err) {
        console.error(err);
        alert("Lỗi từ chối bài");
    }
}
/**
 * Hàm xóa bài viết
 * @param {*} postId 
 * @returns 
 */
async function deletePost(postId) {

    if (!confirm("Bạn có chắc muốn xóa bài viết này?"))
        return;

    try {
        const res = await fetch(`http://localhost:6025/api/post/${postId}`, {
            method: "DELETE"
        });

        if (!res.ok)
            throw new Error("Xóa thất bại");

        alert("Đã xóa bài viết");

        await loadPosts();
    }
    catch (err) {
        console.error(err);
        alert("Lỗi xóa bài viết");
    }

}

