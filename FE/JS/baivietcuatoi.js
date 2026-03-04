let projectId = null;
let currentUserId = null;
let posts = [];
const API_POST = "http://localhost:6025/api/post";

let CURRENT_POST = null;
let CURRENT_PROJECT_ID = null;
let CURRENT_USER_ID = null;
function openEditPopup(post) {

    CURRENT_POST = post;

    document.getElementById("editTitle").value = post.tieu_de;
    document.getElementById("editContent").value = post.noi_dung;
    document.getElementById("editImage").value = post.link_anh || "";

}


document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);

    projectId = params.get("id");

    if (!projectId) {

        alert("Không tìm thấy id dự án");

        return;
    }
    CURRENT_PROJECT_ID = params.get("id");

    const user = JSON.parse(localStorage.getItem("currentUser"));

    CURRENT_USER_ID = user.id;

    loadProjectDetail(projectId);
    loadUserInfo();

    bindSidebar(projectId);

    loadCurrentUser();

    await loadMyPosts();
    

});



function loadCurrentUser() {

    const raw =
        localStorage.getItem("currentUser");

    if (!raw) {

        alert("Bạn chưa đăng nhập");

        return;
    }

    const data =
        JSON.parse(raw);

    const user =
        data.user || data;

    currentUserId =
        user.id_nguoi_dung;

}



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
function loadUserInfo() {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return;

    const data = JSON.parse(raw);
    const user = data.user || data;

    document.getElementById("nguoiDangNhap").innerText =
        user.hoten || user.tendangnhap || "User";

    currentUserId = user.id_nguoi_dung;

}

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
                "BÀI VIẾT CỦA TÔI TRONG DỰ ÁN: "
                + p.tieu_de;

        }

        projectOwnerId = p.id_nguoi_tao;


        const linkDuyet =
            document.getElementById("linkDuyetBaiViet");

        if (currentUserId !== projectOwnerId) {

            linkDuyet.style.display = "none";

        }
    }
    catch (err) {

        console.error(err);

        alert("Không thể kết nối server");

    }

}


async function loadMyPosts() {

    try {

        const res =
            await fetch(
                `http://localhost:6025/api/post/project/${projectId}`
            );

        if (!res.ok)
            throw new Error("Load fail");

        const data =
            await res.json();

        posts =
            data.filter(
                p => p.id_tac_gia === currentUserId
            );

        renderPosts();

    }
    catch (err) {

        console.error(err);

        alert("Không load được bài viết");

    }

}



function renderPosts() {

    const container =
        document.getElementById("content");

    container.innerHTML = "";

    if (!posts.length) {

        container.innerHTML =
            "<p>Chưa có bài viết</p>";

        return;
    }

    posts.forEach(p => {

        let statusClass = "";
        let statusText = "";

        if (p.trang_thai == 0) {

            statusClass = "pending";
            statusText = "Chờ duyệt";

        }
        else if (p.trang_thai == 1) {

            statusClass = "approved";
            statusText = "Đã duyệt";

        }
        else {

            statusClass = "rejected";
            statusText = "Từ chối";

        }

        const html = `
        <div class="post-card">

            <h5>${p.tieu_de}</h5>

            <p class="text-muted">
                Ngày tạo:
                ${new Date(p.ngay_tao)
                    .toLocaleDateString("vi-VN")}
            </p>

            <p>${p.noi_dung}</p>

            ${
                p.anh
                ?
                `<img src="http://localhost:6025/Uploads/${p.anh}"
                    class="post-image mb-2" style="max-width: 300px">`
                :
                ""
            }

            <p class="status ${statusClass}">
                Trạng thái: ${statusText}
            </p>

            <div class="post-actions">

                <button
                    class="btn btn-warning btn-sm"
                    onclick="editPost('${p.id_bai_dang}')">

                    <i class="bi bi-pencil"></i>
                    Chỉnh sửa

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deletePost('${p.id_bai_dang}')">

                    <i class="bi bi-trash"></i>
                    Xóa

                </button>

            </div>

        </div>
        `;

        container.insertAdjacentHTML(
            "beforeend",
            html
        );

    });

}

function editPost(postId)
{
    const post =
        posts.find(p => p.id_bai_dang === postId);

    if (!post)
    {
        alert("Không tìm thấy bài viết");
        return;
    }

    CURRENT_POST = post;

    document.getElementById("editTitle").value =
        post.tieu_de;

    document.getElementById("editContent").value =
        post.noi_dung;

    document.getElementById("editImage").value = "";

    const modal =
        new bootstrap.Modal(
            document.getElementById("editPostModal")
        );

    modal.show();
}


async function deletePost(postId) {

    if (!confirm("Bạn có chắc muốn xóa bài viết này?"))
        return;

    try {

        const res = await fetch(`${API_POST}/${postId}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            alert("Xóa thất bại");
            return;
        }

        alert("Xóa thành công");

        loadMyPosts();

    } catch (err) {

        console.error(err);
        alert("Không thể kết nối server");

    }

}


async function submitEditPost()
{
    if (!CURRENT_POST)
    {
        alert("Không có bài viết");
        return;
    }

    const title =
        document.getElementById("editTitle").value;

    const content =
        document.getElementById("editContent").value;

    const fileInput =
        document.getElementById("editImage");

    let image =
        CURRENT_POST.anh;

    // nếu có chọn ảnh mới → upload
    if (fileInput.files.length > 0)
    {
        const formData =
            new FormData();

        formData.append(
            "file",
            fileInput.files[0]
        );

        const uploadRes =
            await fetch(
                "http://localhost:6025/api/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

        const uploadData =
            await uploadRes.json();

        image =
            uploadData.fileName;
    }

    const payload =
    {
        id_bai_dang:
            CURRENT_POST.id_bai_dang,

        tieu_de:
            title,

        noi_dung:
            content,

        anh:
            image,

        id_du_an:
            CURRENT_POST.id_du_an,

        id_tac_gia:
            CURRENT_POST.id_tac_gia,

        trang_thai:
            CURRENT_POST.trang_thai
    };

    try
    {
        const res =
            await fetch(
                `http://localhost:6025/api/post/${CURRENT_POST.id_bai_dang}`,
                {
                    method: "PUT",
                    headers:
                    {
                        "Content-Type": "application/json"
                    },
                    body:
                        JSON.stringify(payload)
                }
            );

        if (res.ok)
        {
            alert("Cập nhật thành công");

            loadMyPosts();

            bootstrap.Modal.getInstance(
                document.getElementById("editPostModal")
            ).hide();
        }
        else
        {
            alert("Cập nhật thất bại");
        }
    }
    catch (err)
    {
        console.error(err);
        alert("Không thể kết nối server");
    }
}
