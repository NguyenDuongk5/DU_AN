let allProjectsCache = [];
let currentIndex = 0;
const PAGE_SIZE = 4;
let isLoadingMore = false;
let joinedProjectsMap = new Map();
let selectedColor = null; 
// key = projectId
// value = trang_thai (0 hoặc 1)
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
function isAdmin() {

    const user = getCurrentUser();

    if (!user) return false;

    // ID admin cố định của bạn
    return user.id_nguoi_dung === "11111111-1111-1121-1111-111111111111";

}

// ==========================
// CHECK USER thường
// ==========================
function isUser() {

    const user = getCurrentUser();

    if (!user) return false;

    return !isAdmin();

}
document.addEventListener("DOMContentLoaded", () => {

    if (isAdmin()) {

        const section = document.getElementById("myProjectsSection");

        if (section)
            section.style.display = "none";

    }
    else {

        loadUserProjects();
        loadMyCreatedProjects();

    }

    loadAllProjects();

});

async function loadUserProjects() {

    const raw = localStorage.getItem("currentUser");

    if (!raw) return;

    const data = JSON.parse(raw);
    const user = data.user || data;

    const res = await fetch(`http://localhost:6025/api/users/${user.id_nguoi_dung}/projects`);

    if (!res.ok) return;

    let projects = await res.json();

    if (!Array.isArray(projects))
        projects = [projects];

    // lưu cache trạng thái tham gia
    joinedProjectsMap.clear();

    projects.forEach(p => {
        joinedProjectsMap.set(p.id_du_an, p.trang_thai);
    });

    const isHome = window.location.pathname.includes("user.html");

    renderProjects(projects, isHome);
}

function renderProjects(projects, isHome = false) {

    const container = document.getElementById("projectList");

    if (!container) return;

    container.innerHTML = "";

    if (!projects || projects.length === 0) {

        container.innerHTML =
            `<p class="text-muted">Bạn chưa có dự án nào.</p>`;

        return;
    }

    const list = isHome ? projects.slice(0, 3) : projects;

    list.forEach(p => {

        const date =
            new Date(p.ngay_tham_gia)
            .toLocaleDateString("vi-VN");

        // badge trạng thái
        let statusBadge = "";

        container.innerHTML += `
        <div class="col-md-4">
            <div class="feature-card"
                 style="border-top:5px solid ${p.mau || "#0d6efd"};">

                <div class="d-flex gap-3">

                    <div class="icon-bg">
                        <i class="bi bi-kanban fs-5"></i>
                    </div>

                    <div>

                        <h6 class="mb-1">
                            ${p.ten_du_an}
                            ${statusBadge}
                        </h6>

                        <p class="text-muted small mb-0">
                            ${p.mo_ta || ""}
                        </p>

                        <p class="text-muted small mb-0">
                            Ngày tham gia: ${date}
                        </p>

                        <p class="text-muted small mb-1">
                            Người tạo: ${p.nguoi_tao}
                        </p>

                        ${
                            p.trang_thai == 1
                            ?
                            `<a href="../Nguoidung/chitietduan.html?id=${p.id_du_an}" 
                               class="btn btn-sm btn-primary mt-2">
                                Xem chi tiết
                            </a>`
                            :
                            `<button class="btn btn-sm btn-warning mt-2" disabled>
                                Chờ duyệt
                            </button>`
                        }

                    </div>

                </div>

            </div>
        </div>`;

    });

}

async function loadAllProjects() {
    try {
        const res = await fetch("http://localhost:6025/api/project/all");

        if (!res.ok) {
            alert("Không lấy được tất cả dự án");
            return;
        }

        allProjectsCache = await res.json();
        currentIndex = 0;
        // sắp xếp theo date
        allProjectsCache.sort((a, b) => 
            new Date(b.ngay_tao) - new Date(a.ngay_tao)
        );

        renderNextProjects();

    } catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }
}


async function renderNextProjects() {
    if (isLoadingMore) return;

    const container = document.getElementById("allProjectList");
    const loading = document.getElementById("loadingMore");

    if (!container) return;

    isLoadingMore = true;
    loading.classList.remove("d-none");

    await new Promise(r => setTimeout(r, 700));

    const nextItems = allProjectsCache.slice(currentIndex, currentIndex + PAGE_SIZE);

    nextItems.forEach(p => {

        let joinButton = "";

        // ADMIN
        if (isAdmin()) {

            joinButton = `
                <a href="../Nguoidung/chitietduan.html?id=${p.id}" 
                class="btn btn-sm btn-primary mt-2">
                Xem chi tiết
                </a>
            `;

        }

        // USER thường
        else {

            const status = joinedProjectsMap.get(p.id);

            if (status === 1) {

                joinButton = `
                    <button class="btn btn-sm btn-success mt-2" disabled>
                        Đã tham gia
                    </button>
                `;

            }
            else if (status === 0) {

                joinButton = `
                    <button class="btn btn-sm btn-warning mt-2" disabled>
                        Chờ duyệt
                    </button>
                `;

            }
            else {

                joinButton = `
                    <button 
                        class="btn btn-sm btn-outline-primary mt-2"
                        onclick="joinProject('${p.id}')">
                        Tham gia
                    </button>
                `;
            }

        }

        container.innerHTML += `
        <div class="col-md-4">
            <div class="feature-card" style="border-top:5px solid ${p.mau || "#0d6efd"};">
                <div class="d-flex gap-3">
                    <div class="icon-bg">
                        <i class="bi bi-kanban fs-5"></i>
                    </div>
                    <div>
                        <h6 class="mb-1">${p.tieu_de}</h6>
                        <p class="text-muted small mb-0">${p.mo_ta || ""}</p>
                        <p class="text-muted small mb-1">
                            Ngày tạo: ${new Date(p.ngay_tao).toLocaleDateString("vi-VN")}
                        </p>
                        ${joinButton}
                    </div>
                </div>
            </div>
        </div>`;

    });

    currentIndex += PAGE_SIZE;

    loading.classList.add("d-none");
    isLoadingMore = false;
}
window.addEventListener("scroll", () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        if (currentIndex < allProjectsCache.length) {
            renderNextProjects();
        }
    }
});

function joinProject(projectId) {
    const raw = localStorage.getItem("currentUser");
    const data = JSON.parse(raw);
    const user = data.user || data;

    fetch("http://localhost:6025/api/project/join", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_du_an: projectId,
            id_nguoi_dung: user.id_nguoi_dung,
            vai_tro: 0
        })
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(() => {

    alert("Đã gửi yêu cầu tham gia!");

    joinedProjectsMap.set(projectId, 0);

    const container = document.getElementById("allProjectList");
    container.innerHTML = "";

    currentIndex = 0;

    renderNextProjects();
})

    .catch(() => alert("Bạn đã tham gia hoặc lỗi"));
}
// xử lý chọn màu
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".color-box").forEach(c => {
        c.addEventListener("click", () => {
            document.querySelectorAll(".color-box").forEach(x => x.classList.remove("active"));
            c.classList.add("active");
            selectedColor = c.dataset.color;
        });
    });
});
async function createProject() {
    const ten = document.getElementById("tenDuAn").value.trim();
    const mota = document.getElementById("moTa").value.trim();

    if (!ten) {
        alert("Nhập tên dự án");
        return;
    }

    const raw = localStorage.getItem("currentUser");
    if (!raw) {
        alert("Chưa đăng nhập");
        return;
    }

    const data = JSON.parse(raw);
    const user = data.user || data;

    const body = {
        tieu_de: ten,
        mo_ta: mota,
        mau: selectedColor || null,
        id_nguoi_tao: user.id_nguoi_dung
    };

    try {
        const res = await fetch("http://localhost:6025/api/project", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const err = await res.text();
            alert("Tạo thất bại: " + err);
            return;
        }

        const newProject = await res.json();

        alert("Tạo dự án thành công!");

        // 1. Thêm vào ALL PROJECT
        allProjectsCache.unshift(newProject);

        currentIndex = 0;
        const allContainer = document.getElementById("allProjectList");
        if (allContainer) {
            allContainer.innerHTML = "";
            renderNextProjects();
        }

        // 2. Reload MY PROJECT (vì creator = participant)
        await loadUserProjects();   
        await loadMyCreatedProjects();

        // 3. Reset form
        document.getElementById("tenDuAn").value = "";
        document.getElementById("moTa").value = "";
        selectedColor = null;

        // 4. Đóng popup
        const modalEl = document.getElementById("createProjectModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
        document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
        document.body.classList.remove("modal-open");


    } catch (e) {
        alert("Không kết nối server");
        console.error(e);
    }
}


async function loadMyCreatedProjects() {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return;

    const data = JSON.parse(raw);
    const user = data.user || data;

    const res = await fetch("http://localhost:6025/api/project/all");
    let projects = await res.json();

    const myProjects = projects.filter(p => p.id_nguoi_tao === user.id_nguoi_dung);

    renderMyProjects(myProjects);
}
function renderMyProjects(projects) {
    const container = document.getElementById("myProjectList");
    if (!container) return;

    container.innerHTML = "";

    if (!projects || projects.length === 0) {
        container.innerHTML = `<p class="text-muted">Bạn chưa tạo dự án nào.</p>`;
        return;
    }

    projects.forEach(p => {
        container.innerHTML += `
        <div class="col-md-4">
            <div class="feature-card" style="border-top:5px solid ${p.mau || "#0d6efd"};">
                <div class="d-flex gap-3">
                    <div class="icon-bg">
                        <i class="bi bi-kanban fs-5"></i>
                    </div>
                    <div>
                        <h6 class="mb-1">${p.tieu_de}</h6>
                        <p class="text-muted small mb-0">${p.mo_ta || ""}</p>
                        <p class="text-muted small mb-1">
                          Ngày tạo: ${new Date(p.ngay_tao).toLocaleDateString("vi-VN")}
                        </p>
                        <a href="chitietduan.html?id=${p.id}" 
                           class="btn btn-sm btn-primary mt-2">
                            Quản lý
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
    });
    
}
