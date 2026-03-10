const API = "http://localhost:6025";

/**
 * Hàm chạy khi toàn bộ HTMl được load
 */
document.addEventListener("DOMContentLoaded", async () => {

    console.log("DOM loaded");

    await loadProjects();
    await loadPosts();
    await loadUsers();

});
/**
 * Lấy danh sách dự án từ API
 */
async function loadProjects() {

    try {
        const res = await fetch(`${API}/api/project/all`);

        const data = await res.json();

        const el = document.getElementById("totalProjects");

        if (el)
            el.innerText = data.length;
        else
            console.error("Không tìm thấy id totalProjects");
    }
    catch (err) {
        console.error("Project error:", err);
    }
}

/**
 * Lấy danh sách bài viết từ API
 */
async function loadPosts() {
    try {
        const res = await fetch(`${API}/api/post/all`);

        const posts = await res.json();

        const totalEl = document.getElementById("totalPosts");

        if (totalEl)
            totalEl.innerText = posts.length;

        const now = new Date();

        const thisMonthPosts = posts.filter(p => {

            const date = new Date(p.ngay_tao || p.created_at);

            return date.getMonth() === now.getMonth()
                && date.getFullYear() === now.getFullYear();

        });
        const monthEl = document.getElementById("postsThisMonth");

        if (monthEl)
            monthEl.innerText = thisMonthPosts.length;
    }
    catch (err) {
        console.error("Post error:", err);
    }
}
/**
 * Lấy danh sách người dùng từ API
 */
async function loadUsers() {
    try {
        const res = await fetch(`${API}/api/users/all`);

        const data = await res.json();

        const el = document.getElementById("totalUsers");

        if (el)
            el.innerText = data.length;
        else
            console.error("Không tìm thấy id totalUsers");
    }
    catch (err) {
        console.error("User error:", err);
    }
}