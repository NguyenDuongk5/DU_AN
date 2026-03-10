let id = null; // id dự án hiện tại
let posts = []; // danh sách bài viết trong dự án
let projectOwnerId = null; // người tạo dự án
let currentUserId = null; // người dùng hiện tại
/**
 * Lấy thống tin người dùng hiện tại
 * @returns 
 */
function getCurrentUser() {
    const raw = localStorage.getItem("currentUser");

    if (!raw) return null;

    try {
        const data = JSON.parse(raw);
        return data.user || data;
    } 
    catch {
        return null;
    }

}
/**
 * Hàm kiểm tra admin
 * @returns 
 */
function isAdmin() {

    const user = getCurrentUser();

    if (!user) return false;

    return user.id_nguoi_dung === "11111111-1111-1121-1111-111111111111";
}
/**
 * Hàm kiểm tra người dùng
 * @returns 
 */
function isUser() {

    const user = getCurrentUser();

    if (!user) return false;

    return !isAdmin();

}
/**
 * Hàm gắn link sidebar theo id dự án
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
 * Hiển thị sidebar
 * @param {*} projectId 
 * @returns 
 */
function renderSidebar(projectId) {

    const sidebar = document.getElementById("sidebar");
    const createPostBtn = document.getElementById("createPostBtn");
    // nếu không tìm thấy sidebar
    if (!sidebar)  {
        console.error("Không tìm thấy sidebar");
        return;
    }
    // nếu là admin thi khóa tạo bài viết
    if (isAdmin()) {
        createPostBtn.style.display = "none";
        sidebar.innerHTML = `
            <h5 class="sidebar-title">Admin Panel</h5>

            <a href="../Trangchung/user.html">
                <i class="bi bi-house-door"></i> Trang chủ
            </a>

            <a href="../Admin/quanliduan.html">
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

        return;
    }
    // nội dung sidebar
    sidebar.innerHTML = `
        <h5 class="sidebar-title">Thông tin dự án</h5>

        <div class="sidebar-info">

            <p><b>Tên dự án:</b> <span id="tenDuAn"></span></p>

            <p><b>Người tạo:</b> <span id="nguoiTao"></span></p>

            <p><b>Ngày tạo:</b> <span id="ngayTao"></span></p>

            <p><b>Người đăng nhập:</b> <span id="nguoiDangNhap"></span></p>

            <a href="duan.html" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left"></i> Trở về dự án
            </a>

        </div>

        <hr>

        <a id="linkTrangChu">
            <i class="bi bi-house-door"></i> Trang chủ
        </a>

        <a id="linkBaiVietCuaToi">
            <i class="bi bi-journal-text"></i> Bài viết của tôi
        </a>

        <a id="linkDuyetBaiViet">
            <i class="bi bi-kanban"></i> Quản lí bài viết
        </a>

        <a id="linkThanhVien">
            <i class="bi bi-people"></i> Quản lí thành viên
        </a>

        <a id="linkChinhSua">
            <i class="bi bi-gear"></i> Cài đặt dự án
        </a>
    `;

    bindSidebar(projectId);
}
/**
 * Hàm chạy khi toàn bộ HTMl được load
 */
document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("id");
    // neu khong tim thay id du an
    if (!projectId) {
        alert("Không tìm thấy id dự án");
        return;
    }

    id = projectId;
    loadUserInfo();

    renderSidebar(projectId);
    // neu khong phai admin thi load thong tin du an
    if (!isAdmin()) {
        loadProjectDetail(projectId);
        
    }

    loadPosts(projectId);

    bindActions();

});
/**
 * Hàm lay thong tin nguoi dung hien tai
 * @returns 
 */
function loadUserInfo() {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return;

    const data = JSON.parse(raw);
    const user = data.user || data;

    document.getElementById("nguoiDangNhap").innerText =
        user.hoten || user.tendangnhap || "User";

    currentUserId = user.id_nguoi_dung;
}
/**
 * Hàm lấy thông tin dự án
 * @param {*} projectId 
 * @returns 
 */
async function loadProjectDetail(projectId) {

    try {

        const res = await fetch(
            `http://localhost:6025/api/project/${projectId}`
        );

        if (!res.ok) {

            alert("Không lấy được dữ liệu dự án");
            return;

        }

        const data = await res.json();

        const p = Array.isArray(data)
            ? data[0]
            : data;

        document.getElementById("tenDuAn").innerText =
            p.tieu_de;

        document.getElementById("nguoiTao").innerText =
            p.ten_nguoi_tao;

        document.getElementById("ngayTao").innerText =
            new Date(p.ngay_tao)
            .toLocaleDateString("vi-VN");

        const topTitle =
            document.querySelector(".topbar b");

        if (topTitle) {

            topTitle.innerText =
                "CHÀO MỪNG ĐẾN VỚI DỰ ÁN: "
                + p.tieu_de;

        }

        projectOwnerId = p.id_nguoi_tao;

        const linkDuyet = document.getElementById("linkDuyetBaiViet");

        // nếu không phải admin thi khong hien linkDuyet
        if (linkDuyet && currentUserId !== projectOwnerId && !isAdmin()) {
            linkDuyet.style.display = "none";
        }
    }
    catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }

}
/**
 * 
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
 * Hàm xóa dự án
 * @returns 
 */
async function deleteProject() {
    if (!confirm("Bạn có chắc muốn xóa dự án này không?")) return;

    try {
        const res = await fetch(`http://localhost:6025/api/project/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            alert("Xóa thất bại");
            return;
        }

        alert("Đã xóa dự án");
        window.location.href = "duan.html";

    } catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }
}
/**
 * Hàm cập nhật dự án
 * @returns 
 */
async function updateProject() {
    const newTitle = prompt("Nhập tên dự án mới:");
    if (!newTitle) return;

    const newDesc = prompt("Nhập mô tả:");

    try {
    const res = await fetch(`http://localhost:6025/api/project/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
                tieu_de: newTitle,
                mo_ta: newDesc
            })
        });

        if (!res.ok) {
            alert("Cập nhật thất bại");
            return;
        }

        alert("Đã cập nhật");
        loadProjectDetail(id);

    } catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }
}
/**
 * Hàm lấy danh sách bài viết
 * @param {*} projectId 
 */
async function loadPosts(projectId) {

    const res = await fetch(
        `http://localhost:6025/api/post/project/${projectId}`
    );

    posts = await res.json();

    const container =
        document.getElementById("postList");

    container.innerHTML = "";

    const raw = localStorage.getItem("currentUser");

    const currentUser = JSON.parse(raw).user || JSON.parse(raw);
    posts
    .filter(p => p.trang_thai == "1" || isAdmin())
    .forEach(p => {

        const isProjectOwner =
            currentUser.id_nguoi_dung === projectOwnerId || isAdmin();
        const isPostAuthor =
            currentUser.id_nguoi_dung === p.id_tac_gia;

        let actionButtons = "";
        // nếu là admin hoac người tạo dự án
        if (isProjectOwner) {

            actionButtons = `
            <div class="post-actions" style="display: flex; gap: 5px;">

                <button class="btn btn-danger btn-sm w-100 mt-2"
                    onclick="deletePost('${p.id_bai_dang}')">
                    <i class="bi bi-trash"></i> Xóa bài
                </button>

                <button class="btn btn-warning btn-sm w-100 mt-2"
                    onclick="editPost('${p.id_bai_dang}')">
                    <i class="bi bi-pencil"></i> Sửa bài
                </button>

            </div>
            `;

        }
        // nếu là người tạo bài viết
        else if (isPostAuthor) {

            actionButtons = `
            <div class="post-actions" style="display: flex; gap: 5px;">
                <button class="btn btn-sm btn-warning me-1"
                    onclick="editPost('${p.id_bai_dang}')">
                    <i class="bi bi-pencil"></i>
                </button>

                <button class="btn btn-sm btn-danger"
                    onclick="deletePost('${p.id_bai_dang}')">
                    <i class="bi bi-trash"></i>
                </button>

            </div>
            `;

        }
        
        const html = `
        <div class="post-card">
            <h5 class="post-author d-flex justify-content-between">
                <span>
                    ${p.tieu_de}
                    <span class="badge bg-success ms-2">Duyệt</span>
                </span> ${actionButtons}
            </h5>
            <p class="post-date">
                ${p.tac_gia} – ${new Date(p.ngay_tao).toLocaleDateString("vi-VN")}
            </p>
            <p class="post-content">
                ${p.noi_dung}
            </p>
             ${p.anh
                ? `<img  src="http://localhost:6025/Uploads/${p.anh}"
                    class="img-fluid rounded mb-2" style="max-width: 300px">`
                : ""}
            <h6 class="mt-3 fw-bold">Bình luận</h6>
            <div class="comments mt-2" id="comments-${p.id_bai_dang}">
                <p class="text-muted">Chưa có bình luận</p>
            </div>
            <form class="mt-2" onsubmit="submitComment(event,'${p.id_bai_dang}')">
                <div class="d-flex">
                    <input
                        class="form-control me-2"
                        placeholder="Nhập bình luận..."
                        required>
                    <button class="btn btn-primary">
                        <i class="bi bi-send"></i>
                    </button>
                </div>
            </form>
        </div>
        `;
        container.insertAdjacentHTML(
            "beforeend",
            html
        );

        loadComments(p.id_bai_dang);

    });

}

/**
 * Hàm sửa bài viết
 * @param {*} id 
 */
function editPost(id) {

    const post = posts.find(p => p.id_bai_dang === id);

    document.getElementById("editPostId").value = post.id_bai_dang;
    document.getElementById("editTitle").value = post.tieu_de;
    document.getElementById("editContent").value = post.noi_dung;

    const modal = new bootstrap.Modal(
        document.getElementById("editPostModal")
    );

    modal.show();
}
/**
 * Hàm cập nhật bài viết
 * @returns 
 */
async function saveEditPost() {

    const postId = document.getElementById("editPostId").value;

    const oldPost = posts.find(p => p.id_bai_dang === postId);

    const title = document.getElementById("editTitle").value;

    const content = document.getElementById("editContent").value;

    const fileInput = document.getElementById("editImage");

    let fileName = oldPost.anh;
    
    if (fileInput.files.length > 0)
    {
        const formData = new FormData();
        formData.append(
            "file",
            fileInput.files[0]
        );

        const uploadRes = await fetch( "http://localhost:6025/api/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const uploadData = await uploadRes.json();
        // nếu upload thành công thì lấy file name
        if (uploadData.success){
            fileName = uploadData.fileName;
        }
        else
        {
            alert("Upload ảnh thất bại");
            return;
        }
    }

    const data =
    {
        id_bai_dang: postId,
        id_du_an: oldPost.id_du_an,
        id_tac_gia: oldPost.id_tac_gia,
        tieu_de: title,
        noi_dung: content,
        anh: fileName,
        trang_thai: oldPost.trang_thai
    };

    const res =
        await fetch(`http://localhost:6025/api/post/${postId}`,
            {
                method: "PUT",
                headers:
                {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(data)
            }
        );
    if (res.ok)
    {
        alert("Cập nhật thành công");

        loadPosts(id);

        bootstrap.Modal
            .getInstance(
                document.getElementById("editPostModal")
            )
            .hide();
    }
    else
    {
        alert("Cập nhật thất bại");
    }
}
/**
 * Hàm xóa bài viết
 * @param {*} postId 
 * @returns 
 */
async function deletePost(postId) {

    if (!confirm("Bạn có chắc muốn xóa bài viết?"))
        return;

    try {

        const res = await fetch(
            `http://localhost:6025/api/post/${postId}`,
            {
                method: "DELETE"
            }
        );

        if (res.ok) {
            alert("Xóa thành công");
            loadPosts(id); // reload lại danh sách bài
        } 
        else {
            alert("Xóa thất bại");
        }
    } catch (err) {
        console.error(err);
        alert("Không thể kết nối server");

    }
}
/**
 * Hàm bình luận 
 * @param {*} e 
 * @param {*} postId 
 * @returns 
 */
async function submitComment(e, postId) {

    e.preventDefault();

    const input = e.target.querySelector("input");

    const noiDung = input.value.trim();

    if (!noiDung) return;

    // lấy user đang login
    const raw = localStorage.getItem("currentUser");

    if (!raw) {
        alert("Bạn chưa đăng nhập");
        return;
    }

    const dataUser = JSON.parse(raw);

    const user = dataUser.user || dataUser;

    const comment = {
        id_binh_luan: crypto.randomUUID(),
        id_bai_dang: postId,
        id_nguoi_dung: user.id_nguoi_dung,
        noi_dung: noiDung,
        ngay_binh_luan: new Date().toISOString(),
        trang_thai: 0
    };

    try {
        const res = await fetch(
            "http://localhost:6025/api/comment",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(comment)
            }
        );
        if (res.ok) {
            input.value = "";
            // reload comment
            loadComments(postId);
        }
        else {
            alert("Gửi comment thất bại");
        }
    }
    catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }

}
/**
 * Hàm tao bài viết
 * @returns 
 */
async function createPost() {
    const title = document.getElementById("postTitle").value;
    const content = document.getElementById("postContent").value;
    const fileInput = document.getElementById("postImage");

    let fileName = null;

    // nếu có chọn ảnh thì upload trước
    if (fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append(
            "file",
            fileInput.files[0]
        );
        const uploadRes = await fetch( "http://localhost:6025/api/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const uploadData = await uploadRes.json();
        // nếu upload thành cong thì lấy file name
        if (!uploadData.success) {
            alert("Upload ảnh thất bại");
            return;
        }
        fileName = uploadData.fileName;
    }

    const raw = localStorage.getItem( "currentUser");

    const user = JSON.parse(raw).user || JSON.parse(raw);

    const postData = { 
        id_du_an: id,
        id_tac_gia: user.id_nguoi_dung,
        tieu_de: title,
        noi_dung: content,
        anh: fileName,
        trang_thai: 0
    };

    const res = await fetch( "http://localhost:6025/api/post",
        {
            method: "POST",
            headers:
            {
                "Content-Type":
                "application/json"
            },
            body: JSON.stringify(postData)
}
    );

    if (res.ok)
    {
        alert("Đăng bài thành công");
        loadPosts(id);
        bootstrap.Modal.getInstance( document.getElementById("postModal")).hide();
    }
    else
    {
        alert("Đăng bài thất bại");
    }
}
/**
 * Hàm lấy bình luận theo bài viết
 * @param {*} postId 
 * @returns 
 */
async function loadComments(postId) {
    try {

        const res = await fetch(
            `http://localhost:6025/api/comment/${postId}/post`
        );

        if (!res.ok)
            throw new Error("Load comment fail");

        const comments = await res.json();

        const container = document.getElementById(`comments-${postId}`);

        container.innerHTML = "";

        if (!comments.length) {
            container.innerHTML = `<p class="text-muted">Chưa có bình luận</p>`;

            return;
        }

        const raw = localStorage.getItem("currentUser");
        const user = JSON.parse(raw).user || JSON.parse(raw);

        const post = posts.find(p => p.id_bai_dang === postId);

        comments.forEach(c => {
            const isAuthor = c.id_nguoi_dung === post.id_tac_gia;
            const isMe = c.id_nguoi_dung === user.id_nguoi_dung;
            const authorBadge = isAuthor
                ? `<span class="badge bg-primary ms-2">Tác giả</span>`
                : "";
            const actions = isMe
                ? `
                    <div>
                        <button class="btn btn-sm btn-warning me-1"
                            onclick="editComment('${c.id_binh_luan}','${postId}','${c.noi_dung}')">
                            <i class="bi bi-pencil"></i>
                        </button>

                        <button class="btn btn-sm btn-danger"
                            onclick="deleteComment('${c.id_binh_luan}','${postId}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `
                : "";

            const html = `
                <div class="comment-item border rounded p-2 mb-2">

                    <div class="d-flex justify-content-between">

                        <div>
                            <b>${c.nguoi_dung}</b>
                            ${authorBadge}
                        </div>

                        ${actions}

                    </div>

                    <small class="text-muted">
                        ${new Date(c.ngay_binh_luan)
                            .toLocaleString("vi-VN")}
                    </small>

                    <div id="comment-content-${c.id_binh_luan}">
                        ${c.noi_dung}
                    </div>

                </div>
            `;

            container.insertAdjacentHTML( "beforeend", html);
        });

    }
    catch (err) {
        console.error(err);
    }
}
/**
 * Hàm xóa bình luận
 * @param {*} commentId 
 * @param {*} postId 
 * @returns 
 */
async function deleteComment(commentId, postId) {

    if (!confirm("Xóa bình luận này?"))
        return;

    try {

        const res = await fetch(
            `http://localhost:6025/api/comment/${commentId}`,
            {
                method: "DELETE"
            }
        );

        if (res.ok) {
            loadComments(postId);
        }
        else {
            alert("Xóa thất bại");
        }
    }
    catch (err) {
        console.error(err);
    }

}
/**
 * Hàm sửa bình luận
 * @param {*} commentId 
 * @param {*} postId 
 * @param {*} oldContent 
 * @returns 
 */
async function editComment(commentId, postId, oldContent) {

    const newContent = prompt("Sửa bình luận:", oldContent);
    
    if (!newContent) return;

    const raw = localStorage.getItem("currentUser");

    const user = JSON.parse(raw).user || JSON.parse(raw);

    const data = {
        id_binh_luan: commentId,
        id_bai_dang: postId,
        id_nguoi_dung: user.id_nguoi_dung,
        noi_dung: newContent,
        ngay_binh_luan: new Date().toISOString(),
        trang_thai: 0
    };
    try {
        const res = await fetch( `http://localhost:6025/api/comment/${commentId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify(data)
            }
        );

        if (res.ok) {
            loadComments(postId);
        }
        else {
            alert("Sửa thất bại");
        }
    }
    catch (err) {
        console.error(err);
    }

}
