let CURRENT_PROJECT_ID = null;
let CURRENT_PROJECT = null;
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
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("id");

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

async function loadProjectDetail(id) {
    try {
        const res = await fetch(`http://localhost:6025/api/project/${id}`);

        console.log("Status:", res.status);

        if (!res.ok) {
            alert("Không lấy được dữ liệu dự án");
            return;
        }

        const p = await res.json();
        CURRENT_PROJECT = p;
        console.log("Project detail:", p);

        document.getElementById("ctTenDuAn").innerText = p.tieu_de;
        document.getElementById("ctNguoiTao").innerText = p.ten_nguoi_tao;
        document.getElementById("ctNgayTao").innerText =
            new Date(p.ngay_tao).toLocaleDateString("vi-VN");

        const title = document.querySelector(".topbar b");
        if (title) {
            title.innerText = "CHI TIẾT DỰ ÁN: " + p.tieu_de;
        }

        document.getElementById("TenDuAn").innerText = p.tieu_de;
        document.getElementById("sbNguoiTao").innerText = p.ten_nguoi_tao;
        document.getElementById("sbNgayTao").innerText =
            new Date(p.ngay_tao).toLocaleDateString("vi-VN");

        document.getElementById("inputTieuDe").value = p.tieu_de || "";
        document.getElementById("inputMoTa").value = p.mo_ta || "";
    } 
    catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }
}


function bindForm() {
    const form = document.querySelector("form");
    if (!form) return;
    form.addEventListener("submit", submitForm);
}


async function submitForm(e) {
    e.preventDefault();

    const title = document.getElementById("inputTieuDe").value;
    const desc = document.getElementById("inputMoTa").value;

    try {
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

        console.log("SEND:", payload);

        const res = await fetch(`http://localhost:6025/api/project/${CURRENT_PROJECT.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const txt = await res.text();
            console.log(txt);
            alert("Cập nhật thất bại");
            return;
        }

        alert("Cập nhật thành công");
        window.location.href = `chitietduan.html?id=${CURRENT_PROJECT.id}`;

    } catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }
}


async function deleteProject() {
    try {
        const res = await fetch(`http://localhost:6025/api/project/${CURRENT_PROJECT_ID}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            alert("Xóa thất bại");
            return;
        }

        alert("Xóa dự án thành công");
        window.location.href = "duan.html";

    } catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }
}
