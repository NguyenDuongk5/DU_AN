/**
 * Hàm chạy khi toàn bộ HTMl được load
 */
document.addEventListener("DOMContentLoaded", () => {
    loadUserProjects();
});
/**
 * Hàm lấy danh sách dự án người dùng đã tham gia
 * @returns 
 */
async function loadUserProjects() {
    const raw = localStorage.getItem("currentUser");

    if (!raw) {
        console.log("Chưa login");
        return;
    }

    const data = JSON.parse(raw);
    console.log("User from storage:", data);

    const user = data.user || data;

    if (!user || !user.id_nguoi_dung) {
        console.log("Không tìm thấy user", user);
        return;
    }

    const userId = user.id_nguoi_dung;

    try {
        const res = await fetch(`http://localhost:6025/api/users/${userId}/projects`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const projects = await res.json();

        if (!res.ok) {
            alert(projects.message || "Không lấy được dự án");
            return;
        }

        renderProjects(projects);

    } catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }
}

/**
 * Hàm render danh sách dự án người dùng
 * @param {*} projects 
 * @returns 
 */
function renderProjects(projects) {
    const container = document.getElementById("projectList");
    container.innerHTML = "";
    // check xem projects co phai mang hay khong
    if (!projects || projects.length === 0) {
        container.innerHTML = `<p class="text-muted">Bạn chưa có dự án nào.</p>`;
        return;
    }
    // Lấy top 3 dự án
    const top3 = projects.slice(0, 3);
    
    top3.forEach(p => {
        const date = new Date(p.ngay_tao).toLocaleDateString("vi-VN");

        container.innerHTML += `
        <div class="col-md-4">
            <div class="feature-card" style="border-top:5px solid #0d6efd;">
                <div class="d-flex align-items-start gap-3 mb-3">
                    <div class="icon-bg">
                        <i class="bi bi-kanban fs-5"></i>
                    </div>
                    <div>
                        <h6 class="mb-1">${p.ten_du_an}</h6>
                        <p class="text-muted small mb-1">Ngày tạo: ${date}</p>
                        <p class="text-muted small mb-0">Người tạo: ${p.ho_ten}</p>
                        <a href="../Nguoidung/chitiet.html?id=${p.id_du_an}" 
                           class="btn btn-sm btn-primary mt-2">
                            Xem chi tiết
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
    });
}

