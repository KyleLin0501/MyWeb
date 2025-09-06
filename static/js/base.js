document.addEventListener("DOMContentLoaded", function () {
    let currentPath = window.location.pathname.split('/')[1]; // 取得第一層路徑
    console.log("currentPath:", currentPath); // Debugging

    document.querySelectorAll(".category-container a").forEach(link => {
        let linkPath = new URL(link.href, window.location.origin).pathname.split('/')[1]; // 取得完整路徑的第一層
        console.log("linkPath:", linkPath); // Debugging

        if (linkPath === currentPath) {
            link.parentElement.classList.add("active");
        }
    });
});
