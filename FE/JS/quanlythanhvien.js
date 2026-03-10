const API_URL = "http://localhost:6025/api/project/member"; 
let CURRENT_USER_ID = null; // id người dùng hiện tại
let IS_OWNER = false; // kiểm tra người dùng hiện tại là người tạo dự án không

let projectId = null; // id dự án hiện tại
let members = [];  // danh sách người dùng trong dự án
let projectOwnerId = null; // người tạo dự án 
let currentUserId = localStorage.getItem("currentUserId"); // id người dùng hiện tại
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
 * Hàm chạy khi toàn bộ HTMl được load
 */
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

/**
 * Hàm lấy thống tin dự án
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

        const p = Array.isArray(data) ? data[0] : data;

        document.getElementById("tenDuAn").innerText = p.tieu_de;
        document.getElementById("nguoiTao").innerText = p.ten_nguoi_tao;

        document.getElementById("ngayTao").innerText =
            new Date(p.ngay_tao).toLocaleDateString("vi-VN");

        const topTitle = document.querySelector(".topbar b");
        if (topTitle) {
            topTitle.innerText =
                "BÀI VIẾT CỦA TÔI TRONG DỰ ÁN: " + p.tieu_de;
        }

        projectOwnerId = p.id_nguoi_tao;

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
/**
 * Hàm lấy thống tin người dùng hiện tại
 * @returns 
 */
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

    document.getElementById("nguoiDangNhap").innerText =
        user.hoten ||
        user.tendangnhap ||
        "User";
}
/**
 * Hàm lấy thống tin người dùng trong dự án
 * @returns
 */
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

/**
 * Hàm duyệt người dùng
 * @param {*} userId 
 * @returns 
 */
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
/**
 * Hàm render người dùng
 * @param {*} members 
 */
function renderMembers(members)
{
    const tbody =
        document.getElementById("memberTableBody");

    const header =
        document.getElementById("actionHeader");

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
/**
 * hàm xóa người dùng
 * @param {*} userId 
 * @returns 
 */
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
/**
 * Hàm tim kiếm người dùng
 * @returns 
 */
function searchMember() {

    const keyword = document
        .getElementById("txtSearchMember")
        .value
        .toLowerCase()
        .trim();

    const info = document.getElementById("searchResultInfo");

    if (!keyword) {
        renderMembers(members);
        info.innerHTML = ""; 
        return;
    }

    const filtered = members.filter(member =>
        (member.ho_ten && member.ho_ten.toLowerCase().includes(keyword)) ||
        (member.email && member.email.toLowerCase().includes(keyword))
    );

    renderMembers(filtered);

    info.innerHTML = `Kết quả tìm kiếm: <b>${filtered.length}</b> / ${members.length} thành viên`;
}