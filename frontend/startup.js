// Array to store startups
let startups = [];

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Get references to DOM elements
  const startupGrid = document.getElementById('startupGrid');
  const addStartupBtn = document.getElementById('addStartupBtn');
  const addStartupModal = document.getElementById('addStartupModal');
  const closeModalBtn = document.querySelector('.close');
  const startupForm = document.getElementById('startupForm');
  const imageInput = document.getElementById('startupImages');
  const imagePreview = document.getElementById('imagePreview');
  const searchInput = document.querySelector('.search-bar input');
  const searchButton = document.querySelector('.search-bar button');
  const applyFiltersBtn = document.querySelector('.apply-filters');
  const resetFiltersBtn = document.querySelector('.reset-filters');
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

  // Setup event listeners
  setupEventListeners();
  
  // Load startups from localStorage if available
  loadStartups();
  
  // Display startups
  displayStartups();
  
  // Set up user profile
  displayUserProfile();
});

// Initialize event listeners
function setupEventListeners() {
  // Open modal when Add Startup button is clicked
  addStartupBtn.addEventListener('click', () => {
    addStartupModal.style.display = 'block';
  });
  
  // Close modal when X is clicked
  closeModalBtn.addEventListener('click', () => {
    addStartupModal.style.display = 'none';
    startupForm.reset();
    imagePreview.innerHTML = '';
  });
  
  // Close modal when clicking outside the modal
  window.addEventListener('click', (e) => {
    if (e.target === addStartupModal) {
      addStartupModal.style.display = 'none';
      startupForm.reset();
      imagePreview.innerHTML = '';
    }
  });
  
  // Handle form submission
  startupForm.addEventListener('submit', handleFormSubmit);
  
  // Handle image upload preview
  imageInput.addEventListener('change', handleImagePreview);
  
  // Search functionality
  searchButton.addEventListener('click', performSearch);
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
  
  // Filter functionality
  applyFiltersBtn.addEventListener('click', applyFilters);
  resetFiltersBtn.addEventListener('click', resetFilters);
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  // Get form values
  const name = document.getElementById('startupName').value;
  const owner = document.getElementById('ownerName').value;
  const address = document.getElementById('startupAddress').value;
  const contactNumber = document.getElementById('contactNumber').value;
  const industry = document.getElementById('industryType').value;
  const stage = document.getElementById('startupStage').value;
  const description = document.getElementById('startupDescription').value;
  
  // Create new startup object
  const newStartup = {
    id: Date.now(), // Use timestamp as unique ID
    name,
    owner,
    address,
    contactNumber,
    industry,
    stage,
    description,
    logo: 'https://via.placeholder.com/150', // Default logo
    opportunities: [], // Can be expanded later
    createdAt: new Date().toISOString()
  };
  
  // Add to startups array
  startups.push(newStartup);
  
  // Save to localStorage
  saveStartups();
  
  // Update display
  displayStartups();
  
  // Close modal and reset form
  addStartupModal.style.display = 'none';
  startupForm.reset();
  imagePreview.innerHTML = '';
  
  // Show confirmation message
  showNotification('Startup added successfully!');
}

// Handle image preview
function handleImagePreview(e) {
  imagePreview.innerHTML = '';
  const files = e.target.files;
  
  // Limit to maximum 5 images
  const maxFiles = Math.min(files.length, 5);
  
  for (let i = 0; i < maxFiles; i++) {
    const file = files[i];
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      
      reader.onload = function(event) {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.className = 'preview-image';
        imagePreview.appendChild(img);
      };
      
      reader.readAsDataURL(file);
    }
  }
}

// Display startups in the grid
function displayStartups(filteredStartups = null) {
  const startupGrid = document.getElementById('startupGrid');
  const startupsToDisplay = filteredStartups || startups;
  
  // Clear existing grid
  startupGrid.innerHTML = '';
  
  if (startupsToDisplay.length === 0) {
    startupGrid.innerHTML = `
      <div class="no-startups">
        <h3>No startups found</h3>
        <p>Be the first to add your startup or adjust your search filters.</p>
      </div>
    `;
    return;
  }
  
  // Create startup cards
  startupsToDisplay.forEach(startup => {
    const card = document.createElement('div');
    card.className = 'startup-card';
    
    // Industry badge class
    const industryClass = `industry-${startup.industry}`;
    
    // Create stage badge
    const stageBadge = getStageColorClass(startup.stage);
    
    card.innerHTML = `
      <div class="startup-logo">
        <img src="${startup.logo}" alt="${startup.name} logo">
      </div>
      <div class="startup-info">
        <h3>${startup.name}</h3>
        <p class="owner-name">Founded by ${startup.owner}</p>
        <p class="startup-description">${startup.description}</p>
        <div class="startup-details">
          <span class="badge ${industryClass}">${getIndustryFullName(startup.industry)}</span>
          <span class="badge ${stageBadge}">${getStageFullName(startup.stage)}</span>
        </div>
        <div class="startup-actions">
          <button class="contact-btn" data-id="${startup.id}">Contact</button>
          <button class="view-details-btn" data-id="${startup.id}">View Details</button>
        </div>
      </div>
    `;
    
    startupGrid.appendChild(card);
  });
  
  // Add event listeners to the new buttons
  document.querySelectorAll('.contact-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const startupId = parseInt(e.target.dataset.id);
      const startup = startups.find(s => s.id === startupId);
      showContactModal(startup);
    });
  });
  
  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const startupId = parseInt(e.target.dataset.id);
      const startup = startups.find(s => s.id === startupId);
      showStartupDetailsModal(startup);
    });
  });
}

// Get full industry name
function getIndustryFullName(industry) {
  const industries = {
    'tech': 'Technology',
    'healthcare': 'Healthcare',
    'finance': 'FinTech',
    'education': 'Education',
    'ecommerce': 'E-Commerce',
    'sustainability': 'Sustainability'
  };
  return industries[industry] || industry;
}

// Get full stage name
function getStageFullName(stage) {
  const stages = {
    'seed': 'Seed',
    'early': 'Early Stage',
    'growth': 'Growth Stage',
    'established': 'Established'
  };
  return stages[stage] || stage;
}

// Get stage color class
function getStageColorClass(stage) {
  const stageColors = {
    'seed': 'stage-seed',
    'early': 'stage-early',
    'growth': 'stage-growth',
    'established': 'stage-established'
  };
  return stageColors[stage] || '';
}

// Search functionality
function performSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    displayStartups();
    return;
  }
  
  const filteredStartups = startups.filter(startup => {
    return (
      startup.name.toLowerCase().includes(searchTerm) ||
      startup.description.toLowerCase().includes(searchTerm) ||
      startup.owner.toLowerCase().includes(searchTerm) ||
      getIndustryFullName(startup.industry).toLowerCase().includes(searchTerm)
    );
  });
  
  displayStartups(filteredStartups);
}

// Apply filters
function applyFilters() {
  const industryFilter = document.getElementById('industry');
  const locationFilter = document.getElementById('location');
  const stageFilter = document.getElementById('stage');
  const opportunitiesFilter = document.getElementById('opportunities');
  
  const industry = industryFilter.value;
  const location = locationFilter.value;
  const stage = stageFilter.value;
  const opportunity = opportunitiesFilter.value;
  
  let filteredStartups = [...startups];
  
  if (industry) {
    filteredStartups = filteredStartups.filter(startup => startup.industry === industry);
  }
  
  if (location) {
    filteredStartups = filteredStartups.filter(startup => startup.location === location);
  }
  
  if (stage) {
    filteredStartups = filteredStartups.filter(startup => startup.stage === stage);
  }
  
  if (opportunity) {
    filteredStartups = filteredStartups.filter(startup => 
      startup.opportunities && startup.opportunities.includes(opportunity)
    );
  }
  
  displayStartups(filteredStartups);
}

// Reset filters
function resetFilters() {
  document.getElementById('industry').value = '';
  document.getElementById('location').value = '';
  document.getElementById('stage').value = '';
  document.getElementById('opportunities').value = '';
  searchInput.value = '';
  
  displayStartups();
}

// Display user profile
function displayUserProfile() {
  const userProfile = document.getElementById('userProfile');
  
  // Check if user is logged in (this would be replaced with actual auth logic)
  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
  
  if (isLoggedIn) {
    // Get user data (this would be replaced with actual user data)
    const userData = JSON.parse(localStorage.getItem('userData')) || {
      name: 'Guest User',
      avatar: 'https://via.placeholder.com/60',
      role: 'Entrepreneur'
    };
    
    userProfile.innerHTML = `
      <div class="profile-pic">
        <img src="${userData.avatar}" alt="Profile picture">
      </div>
      <div class="profile-info">
        <h3>${userData.name}</h3>
        <p>${userData.role}</p>
      </div>
    `;
  } else {
    userProfile.innerHTML = `
      <div class="login-prompt">
        <button id="loginBtn">Login</button>
        <button id="signupBtn">Sign Up</button>
      </div>
    `;
    
    // Add event listeners for login/signup buttons
    document.getElementById('loginBtn').addEventListener('click', showLoginModal);
    document.getElementById('signupBtn').addEventListener('click', showSignupModal);
  }
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Hide and remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Show contact modal
function showContactModal(startup) {
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'modal contact-modal';
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Contact ${startup.name}</h2>
      <div class="contact-info">
        <p><strong>Owner:</strong> ${startup.owner}</p>
        <p><strong>Address:</strong> ${startup.address}</p>
        <p><strong>Phone:</strong> ${startup.contactNumber}</p>
      </div>
      <form id="contactForm">
        <div class="form-group">
          <label for="contactName">Your Name</label>
          <input type="text" id="contactName" required>
        </div>
        <div class="form-group">
          <label for="contactEmail">Your Email</label>
          <input type="email" id="contactEmail" required>
        </div>
        <div class="form-group">
          <label for="contactMessage">Message</label>
          <textarea id="contactMessage" rows="4" required></textarea>
        </div>
        <button type="submit" class="submit-btn">Send Message</button>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Show modal
  setTimeout(() => {
    modal.style.display = 'block';
  }, 10);
  
  // Close modal when X is clicked
  modal.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    }
  });
  
  // Handle form submission
  modal.querySelector('#contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Message sent successfully!');
    modal.style.display = 'none';
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
  });
}

// Show startup details modal
function showStartupDetailsModal(startup) {
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'modal details-modal';
  
  modal.innerHTML = `
    <div class="modal-content details-content">
      <span class="close">&times;</span>
      <div class="startup-header">
        <div class="startup-logo-large">
          <img src="${startup.logo}" alt="${startup.name} logo">
        </div>
        <div class="startup-title">
          <h2>${startup.name}</h2>
          <p class="founder">Founded by ${startup.owner}</p>
          <div class="startup-badges">
            <span class="badge industry-${startup.industry}">${getIndustryFullName(startup.industry)}</span>
            <span class="badge ${getStageColorClass(startup.stage)}">${getStageFullName(startup.stage)}</span>
          </div>
        </div>
      </div>
      <div class="startup-description-full">
        <h3>About</h3>
        <p>${startup.description}</p>
      </div>
      <div class="startup-details-grid">
        <div class="detail-item">
          <h4>Contact</h4>
          <p>${startup.contactNumber}</p>
        </div>
        <div class="detail-item">
          <h4>Location</h4>
          <p>${startup.address}</p>
        </div>
        <div class="detail-item">
          <h4>Added</h4>
          <p>${formatDate(startup.createdAt)}</p>
        </div>
      </div>
      <div class="startup-actions-full">
        <button class="contact-btn-full" data-id="${startup.id}">Contact Owner</button>
        <button class="save-btn" data-id="${startup.id}">Save to Favorites</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Show modal
  setTimeout(() => {
    modal.style.display = 'block';
  }, 10);
  
  // Close modal when X is clicked
  modal.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    }
  });
  
  // Handle contact button click
  modal.querySelector('.contact-btn-full').addEventListener('click', (e) => {
    modal.style.display = 'none';
    setTimeout(() => {
      document.body.removeChild(modal);
      showContactModal(startup);
    }, 300);
  });
  
  // Handle save button click
  modal.querySelector('.save-btn').addEventListener('click', (e) => {
    showNotification('Startup saved to favorites!');
    e.target.textContent = 'Saved';
    e.target.disabled = true;
  });
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Show login modal
function showLoginModal() {
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'modal login-modal';
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Login</h2>
      <form id="loginForm">
        <div class="form-group">
          <label for="loginEmail">Email</label>
          <input type="email" id="loginEmail" required>
        </div>
        <div class="form-group">
          <label for="loginPassword">Password</label>
          <input type="password" id="loginPassword" required>
        </div>
        <button type="submit" class="submit-btn">Login</button>
      </form>
      <p class="form-footer">Don't have an account? <a href="#" id="switchToSignup">Sign up</a></p>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Show modal
  setTimeout(() => {
    modal.style.display = 'block';
  }, 10);
  
  // Close modal when X is clicked
  modal.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    }
  });
  
  // Handle form submission
  modal.querySelector('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Mock login - in a real app, this would call an API
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify({
      name: 'Jane Doe',
      avatar: 'https://via.placeholder.com/60',
      role: 'Entrepreneur'
    }));
    
    showNotification('Login successful!');
    modal.style.display = 'none';
    setTimeout(() => {
      document.body.removeChild(modal);
      displayUserProfile();
    }, 300);
  });
  
  // Switch to signup
  modal.querySelector('#switchToSignup').addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'none';
    setTimeout(() => {
      document.body.removeChild(modal);
      showSignupModal();
    }, 300);
  });
}

// Show signup modal
function showSignupModal() {
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'modal signup-modal';
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Sign Up</h2>
      <form id="signupForm">
        <div class="form-group">
          <label for="signupName">Full Name</label>
          <input type="text" id="signupName" required>
        </div>
        <div class="form-group">
          <label for="signupEmail">Email</label>
          <input type="email" id="signupEmail" required>
        </div>
        <div class="form-group">
          <label for="signupPassword">Password</label>
          <input type="password" id="signupPassword" required>
        </div>
        <div class="form-group">
          <label for="signupConfirmPassword">Confirm Password</label>
          <input type="password" id="signupConfirmPassword" required>
        </div>
        <button type="submit" class="submit-btn">Sign Up</button>
      </form>
      <p class="form-footer">Already have an account? <a href="#" id="switchToLogin">Login</a></p>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Show modal
  setTimeout(() => {
    modal.style.display = 'block';
  }, 10);
  
  // Close modal when X is clicked
  modal.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    }
  });
  
  // Handle form submission
  modal.querySelector('#signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Mock signup - in a real app, this would call an API
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify({
      name: document.getElementById('signupName').value,
      avatar: 'https://via.placeholder.com/60',
      role: 'Entrepreneur'
    }));
    
    showNotification('Sign up successful!');
    modal.style.display = 'none';
    setTimeout(() => {
      document.body.removeChild(modal);
      displayUserProfile();
    }, 300);
  });
  
  // Switch to login
  modal.querySelector('#switchToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'none';
    setTimeout(() => {
      document.body.removeChild(modal);
      showLoginModal();
    }, 300);
  });
}

// Load startups from localStorage
function loadStartups() {
  const storedStartups = localStorage.getItem('startups');
  if (storedStartups) {
    startups = JSON.parse(storedStartups);
  }
}

// Save startups to localStorage
function saveStartups() {
  localStorage.setItem('startups', JSON.stringify(startups));
}
