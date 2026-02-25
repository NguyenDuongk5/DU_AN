const API_URL = "http://localhost:6025/api/project/member";
let CURRENT_USER_ID = null;
let IS_OWNER = false;

let projectId = null;
let members = []; // danh sách tất cả thành viên
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
document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    projectId = params.get("id");

    if (!projectId)
    {
        alert("Không tìm thấy projectId");
        return;
    }

    bindSidebar(projectId);

    loadUserInfo();

    await loadMembers();

    await loadProjectDetail(projectId);

});






let projectOwnerId = null;
let currentUserId = localStorage.getItem("currentUserId"); // hoặc lấy từ session

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

        const p = Array.isArray(data) ? data[0] : data;

        // Hiển thị thông tin dự án
        document.getElementById("tenDuAn").innerText = p.tieu_de;
        document.getElementById("nguoiTao").innerText = p.ten_nguoi_tao;

        document.getElementById("ngayTao").innerText =
            new Date(p.ngay_tao).toLocaleDateString("vi-VN");

        // Tiêu đề topbar
        const topTitle = document.querySelector(".topbar b");
        if (topTitle) {
            topTitle.innerText =
                "BÀI VIẾT CỦA TÔI TRONG DỰ ÁN: " + p.tieu_de;
        }

        // Lưu id chủ dự án
        projectOwnerId = p.id_nguoi_tao;

        // Xử lý sidebar
        const linkDuyet = document.getElementById("linkDuyetBaiViet");

        if (linkDuyet) {
            if (currentUserId !== projectOwnerId) {
                linkDuyet.style.display = "none";
            } else {
                linkDuyet.style.display = "block";
            }
        }

    }
    catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }
}

function loadUserInfo()
{
    const raw = localStorage.getItem("currentUser");

    if (!raw)
    {
        alert("Chưa đăng nhập");
        return;
    }

    const data = JSON.parse(raw);

    console.log("currentUser raw:", data);

    const user = data.user || data;

    CURRENT_USER_ID =
        user.id_nguoi_dung ||
        user.id ||
        null;

    console.log("CURRENT_USER_ID:", CURRENT_USER_ID);

    // sửa đúng field name
    document.getElementById("nguoiDangNhap").innerText =
        user.hoten ||
        user.tendangnhap ||
        "User";
}
async function loadMembers()
{
    try
    {
        const res =
            await fetch(`${API_URL}/${projectId}`);

        if (!res.ok)
            throw new Error("Không thể tải members");

        members = await res.json();

        console.log("MEMBERS:", members);
        console.log("CURRENT_USER_ID:", CURRENT_USER_ID);

        // ép string để tránh lệch kiểu
        IS_OWNER =
            members.some(m =>
                String(m.id_nguoi_dung).trim() === String(CURRENT_USER_ID).trim()
                && Number(m.vai_tro) === 1
            );

        console.log("IS_OWNER:", IS_OWNER);

        members.sort((a, b) => b.vai_tro - a.vai_tro);

        renderMembers(members);
    }
    catch (err)
    {
        console.error(err);
    }
}


async function approveMember(userId) {

    if (!confirm("Duyệt thành viên này?"))
        return;

    try {

        const url =
            `http://localhost:6025/api/users/approve` +
            `?idNguoiDung=${userId}` +
            `&idDuAn=${projectId}`;

        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "accept": "*/*"
            }
        });

        if (!res.ok)
            throw new Error("Duyệt thất bại");

        const data = await res.json();

        alert(data.message || "Đã duyệt thành viên");

        await loadMembers();

    }
    catch (err) {

        console.error(err);
        alert("Lỗi duyệt");

    }

}

function renderMembers(members)
{
    const tbody =
        document.getElementById("memberTableBody");

    const header =
        document.getElementById("actionHeader");

    // show / hide header
    header.style.display =
        IS_OWNER ? "" : "none";

    tbody.innerHTML = "";

    members.forEach(member =>
    {
        const roleBadge =
            member.vai_tro == 1
                ? `<span class="badge bg-danger">Chủ sở hữu</span>`
                : `<span class="badge bg-success">Thành viên</span>`;

        const statusBadge =
            member.trang_thai == 1
                ? `<span class="badge bg-success">Đã duyệt</span>`
                : `<span class="badge bg-warning text-dark">Chưa duyệt</span>`;

        let action = "";

        if (member.vai_tro == 1)
        {
            action =
                `<span class="text-muted fst-italic">
                    Chủ sở hữu
                </span>`;
        }
        else if (member.trang_thai == 0)
        {
            action =
            `
            <button class="btn btn-sm btn-success"
                onclick="approveMember('${member.id_nguoi_dung}')">
                <i class="bi bi-check-circle"></i> Duyệt
            </button>
            <button class="btn btn-sm btn-danger"
                onclick="removeMember('${member.id_nguoi_dung}')">
                <i class="bi bi-trash"></i> Xóa
            </button>
            `;
        }
        else
        {
            action =
            `
            <span class="text-success">
                <i class="bi bi-check-circle"></i> Đã duyệt
            </span>
            <button class="btn btn-sm "
                onclick="removeMember('${member.id_nguoi_dung}')">
                <i class="bi bi-trash"></i> Xóa
            </button>
            `;
        }

        const date =
            new Date(member.ngay_tham_gia)
            .toLocaleDateString("vi-VN");

        const row =
        `
        <tr>
            <td>${member.ho_ten}</td>
            <td>${member.email}</td>
            <td>${roleBadge}</td>
            <td>${statusBadge}</td>
            <td>${date}</td>
            ${IS_OWNER ? `<td>${action}</td>` : ""}
        </tr>
        `;

        tbody.innerHTML += row;
    });
}



async function removeMember(userId)
{
    if (!confirm("Xóa thành viên này khỏi dự án?"))
        return;

    try
    {
        const res = await fetch(
            `http://localhost:6025/api/project/member` +
            `?idNguoiDung=${userId}` +
            `&idDuAn=${projectId}`,
            {
                method: "DELETE"
            }
        );

        if (!res.ok)
            throw new Error("Xóa thất bại");

        const data = await res.json();

        alert(data.message || "Đã xóa thành viên");

        await loadMembers();
    }
    catch (err)
    {
        console.error(err);
        alert("Lỗi xóa thành viên");
    }
}

function searchMember() {

    const keyword = document
        .getElementById("txtSearchMember")
        .value
        .toLowerCase()
        .trim();

    const info = document.getElementById("searchResultInfo");

    if (!keyword) {

        renderMembers(members);

        info.innerHTML = ""; // không hiện gì khi chưa search

        return;

    }

    const filtered = members.filter(member =>
        (member.ho_ten && member.ho_ten.toLowerCase().includes(keyword)) ||
        (member.email && member.email.toLowerCase().includes(keyword))
    );

    renderMembers(filtered);

    info.innerHTML =
        `Kết quả tìm kiếm: <b>${filtered.length}</b> / ${members.length} thành viên`;

}