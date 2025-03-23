// Fetch user email from localStorage
const userEmail = localStorage.getItem("userEmail"); // Get user's email

if (userEmail) {
    document.getElementById("displayName").textContent = userEmail; // Display email
} else {
    document.getElementById("displayName").textContent = "User"; // Fallback
}

// Logout function
function logout() {
    localStorage.removeItem("token");  // Clear token
    localStorage.removeItem("userId"); // Clear user ID
    localStorage.removeItem("userEmail"); // Clear email
    window.location.href = "index.html"; // Redirect to login page
}
document.addEventListener('DOMContentLoaded', function () {
    const postContainer = document.querySelector(".main-content");
    const postForm = document.getElementById('postForm');
    const modalOverlay = document.getElementById('exampleModal');
    const closeModal = document.getElementById('closeModal');
    const fabButton = document.querySelector('.fab-button');
    const dropdownItems = document.querySelectorAll('.category-item.dropdown');

    

    dropdownItems.forEach(item => {
        const dropdownMenu = item.querySelector('.dropdown-menu');

        item.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent the click from bubbling up
            item.classList.toggle('active');
            dropdownMenu.style.display = item.classList.contains('active') ? 'block' : 'none';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!item.contains(e.target)) {
                item.classList.remove('active');
                dropdownMenu.style.display = 'none';
            }
        });
    });
    // JavaScript to handle dropdown functionality


    // Load posts from localStorage
    function loadPosts() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        
        // Clear only the posts, not the header
        const existingPosts = postContainer.querySelectorAll(".post-card");
        existingPosts.forEach(post => post.remove());

        // Render user-generated posts
        posts.forEach(post => renderPost(post));
    }

    function renderPost(post) {
    const postElement = document.createElement("div");
    postElement.classList.add("post-card");

    let imageHTML = "";
    if (post.imageUrl) {
        imageHTML = `<div class="post-image">
                        <img src="${post.imageUrl}" alt="Post Image" class="post-img">
                     </div>`;
    }

    // Add a delete button if the post belongs to the current user
    const deleteButton = post.userEmail === localStorage.getItem("userEmail") 
        ? `<button class="delete-post-btn" onclick="deletePost('${post.time}')">Delete</button>`
        : "";

    postElement.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">${post.user[0]}</div>
            <div class="post-user-info">
                <div class="post-user-name">${post.user}</div>
                <div class="post-user-title">${post.title || "Community Member"}</div>
                <div class="post-time">${post.time}</div>
            </div>
        </div>
        <div class="post-content"><p>${post.text}</p></div>
        ${imageHTML}
        <div class="post-tags">${post.hashtags.split(",").map(tag => `<div class="post-tag">${tag}</div>`).join(" ")}</div>
        ${deleteButton} <!-- Add the delete button -->
    `;

    // Append the post after the header
    postContainer.appendChild(postElement);
}

    function savePost(post) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        post.userEmail = localStorage.getItem("userEmail"); // Add the logged-in user's email to the post
        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));
    }
    // Handle post submission
    postForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const text = document.getElementById('postText').value.trim();
        const hashtags = document.getElementById('postHashtags').value.trim();
        const imageFile = document.getElementById('postImage').files[0];

        if (!text) {
            alert("❌ Post content cannot be empty!");
            return;
        }

        const newPost = {
            user: "Anonymous",
            title: "Community Member",
            time: "Just now",
            text: text,
            hashtags: hashtags,
            likes: 0,
            comments: 0,
            views: 0
        };

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                newPost.imageUrl = e.target.result;
                savePost(newPost);
                loadPosts();
            };
            reader.readAsDataURL(imageFile);
        } else {
            savePost(newPost);
            loadPosts();
        }

        postForm.reset();
        modalOverlay.classList.remove('active');
    });

    // Show modal on clicking the plus button
    fabButton.addEventListener('click', function () {
        modalOverlay.classList.add('active');
    });

    // Close modal on clicking close button
    closeModal.addEventListener('click', function () {
        modalOverlay.classList.remove('active');
    });

    // Close modal when clicking outside content
    window.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });

    // Load posts when the page loads
    loadPosts();

    // Dropdown menu functionality
    const userProfileDropdown = document.getElementById('userProfileDropdown');
    const profileDropdown = document.getElementById('profileDropdown');

    userProfileDropdown.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent the click from bubbling up to the window
        profileDropdown.classList.toggle('show');
    });

    // Close the dropdown when clicking outside of it
    window.addEventListener('click', function () {
        if (profileDropdown.classList.contains('show')) {
            profileDropdown.classList.remove('show');
        }
    });
    const userEmail = localStorage.getItem("userEmail"); // Get user's email

    
      
});
