window.onload = function () {
    document.querySelectorAll(".like-button").forEach((button) => {
        let postId = button.getAttribute("data-post-id");
        let likeCount = localStorage.getItem(postId) || 0;

        // Display stored like count
        button.querySelector(".like-count").textContent = likeCount;

        button.addEventListener("click", function () {
            likeCount++;
            localStorage.setItem(postId, likeCount);
            button.querySelector(".like-count").textContent = likeCount;
        });
    });
};
