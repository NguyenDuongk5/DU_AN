let CURRENT_PROJECT_ID = null; // id dự án hien tại
let CURRENT_PROJECT = null; // tt dự án hien tại
/**
 * Gán link sidebar theo id dự án
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
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("id");
    // nếu không tìm thấy id dự án
    if (!projectId) {
        alert("Không tìm thấy id dự án");
        return;
    }

    CURRENT_PROJECT_ID = projectId;

    const link = document.getElementById("linkChinhSua");
    if (link) {
        link.href = `chinhsuaduan.html?id=${projectId}`;
    }

    bindSidebar(projectId);

    loadProjectDetail(projectId);
    bindForm();

    const btnDelete = document.getElementById("btnDelete");
    if (btnDelete) {
        btnDelete.addEventListener("click", deleteProject);
    }
});
/**
 * Hàm lấy thông tin dự án theo id
 * @param {*} id 
 * @returns 
 */
async function loadProjectDetail(id) {
    try {
        const res = await fetch(`http://localhost:6025/api/project/${id}`);

        console.log("Status:", res.status);
        // nếu không lấy dữ liệu dự án
        if (!res.ok) {
            alert("Không lấy được dữ liệu dự án");
            return;
        }

        const p = await res.json();
        CURRENT_PROJECT = p;
        console.log("Project detail:", p);
        // hiển thị thống tin dự án
        document.getElementById("ctTenDuAn").innerText = p.tieu_de;
        document.getElementById("ctNguoiTao").innerText = p.ten_nguoi_tao;
        document.getElementById("ctNgayTao").innerText =
            new Date(p.ngay_tao).toLocaleDateString("vi-VN");

        // hiển thị thống tin trên topbar
        const title = document.querySelector(".topbar b");
        if (title) {
            title.innerText = "CHI TIẾT DỰ ÁN: " + p.tieu_de;
        }

        // hiển thị thống tin trên sidebar
        document.getElementById("TenDuAn").innerText = p.tieu_de;
        document.getElementById("sbNguoiTao").innerText = p.ten_nguoi_tao;
        document.getElementById("sbNgayTao").innerText =
            new Date(p.ngay_tao).toLocaleDateString("vi-VN");

        // hiển thị thống tin trên form
        document.getElementById("inputTieuDe").value = p.tieu_de || "";
        document.getElementById("inputMoTa").value = p.mo_ta || "";
    } 
    catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }
}

/**
 * Gắn sự kiện submit form
 * @returns 
 */
function bindForm() {
    const form = document.querySelector("form");
    if (!form) return;
    form.addEventListener("submit", submitForm);
}

/**
 * Hàm xử lý khi submit form chinh sửa dự án
 * @param {*} e 
 * @returns 
 */
async function submitForm(e) {
    e.preventDefault(); // ngăn reload trang

    const title = document.getElementById("inputTieuDe").value;
    const desc = document.getElementById("inputMoTa").value;

    try {
        // tạo object gửi lên server
        const payload = {
            id: CURRENT_PROJECT.id,
            tieu_de: title,
            mo_ta: desc,
            mau: CURRENT_PROJECT.mau || "#ffffff",
            ten_nguoi_tao: CURRENT_PROJECT.ten_nguoi_tao,
            id_nguoi_tao: CURRENT_PROJECT.id_nguoi_tao,
            ngay_tao: CURRENT_PROJECT.ngay_tao,
            ngay_cap_nhat: new Date().toISOString()
        };

        const res = await fetch(`http://localhost:6025/api/project/${CURRENT_PROJECT.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        // nếu cập nhật thất bại
        if (!res.ok) {
            const txt = await res.text();
            console.log(txt);
            alert("Cập nhật thất bại");
            return;
        }

        // cập nhật thành công
        alert("Cập nhật thành công");
        window.location.href = `chitietduan.html?id=${CURRENT_PROJECT.id}`;

    } catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }
}

/**
 * Hàm xóa dự án
 * @returns 
 */
async function deleteProject() {
    try {
        const res = await fetch(`http://localhost:6025/api/project/${CURRENT_PROJECT_ID}`, {
            method: "DELETE"
        });
        // nếu xóa thất bại
        if (!res.ok) {
            alert("Xóa thất bại");
            return;
        }
        // xóa dự án thành công
        alert("Xóa dự án thành công");
        window.location.href = "duan.html";

    } catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }
}
