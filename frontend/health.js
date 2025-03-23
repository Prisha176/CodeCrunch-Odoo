document.addEventListener('DOMContentLoaded', () => {
    // Sample health alerts data with headings
    const healthAlerts = {
        urgent: [
            { heading: "Dengue Cases on the Rise", message: "Health authorities have reported a significant increase in dengue cases in your region. Symptoms include high fever, severe headache, and joint pain. To prevent the spread of dengue, eliminate stagnant water around your home, use mosquito repellent, and install window screens. If you experience symptoms, seek medical attention immediately." },
            { heading: "Poor Air Quality Alert", message: "Due to ongoing wildfires and industrial pollution, the air quality in your area has reached hazardous levels. The Air Quality Index (AQI) is currently above 300, which is considered very unhealthy. Residents are advised to limit outdoor activities, use N95 masks when outside, and keep windows closed. Air purifiers are recommended for indoor use." },
            { heading: "Flu Vaccination Drive", message: "The annual flu season has begun, and health officials are urging everyone to get vaccinated. The flu vaccine is especially important for pregnant women, the elderly, and individuals with chronic health conditions. Vaccines are available at local clinics, pharmacies, and community health centers. Protect yourself and your loved ones by getting your flu shot today." }
        ],
        info: [
            { heading: "Breast Cancer Awareness Month", message: "October is Breast Cancer Awareness Month, and health organizations are offering free screenings and educational programs. Early detection is key to successful treatment. Women aged 40 and above are encouraged to schedule a mammogram. Self-examination techniques and risk factors will be discussed in community workshops throughout the month." },
            { heading: "Mental Health Support", message: "If you or someone you know is struggling with mental health issues, help is available. Free counseling services, hotlines, and support groups are accessible 24/7. Topics include stress management, anxiety, depression, and coping strategies. Visit the official mental health portal for more information and resources." },
            { heading: "Healthy Eating Habits", message: "A balanced diet is essential for maintaining good health. Incorporate a variety of fruits, vegetables, whole grains, and lean proteins into your meals. Limit processed foods, sugary drinks, and excessive salt intake. Nutritionists recommend meal planning and portion control to achieve long-term health goals.." }
        ],
        update: [
            { heading: "Women's Health Center Launch", message: "A state-of-the-art women's health center is set to open next month in your city. The center will offer specialized services, including maternal care, mental health support, and wellness programs. Prenatal and postnatal care, family planning, and gynecological services will also be available. Stay tuned for the official opening date and registration details." },
            { heading: "Telemedicine Now Available", message: "Telemedicine services have been launched to provide remote consultations with healthcare professionals. Patients can now access medical advice, prescriptions, and follow-up care from the comfort of their homes. Download the official health app to book appointments and connect with doctors." },
            { heading: "Winter Health Tips", message: "As winter approaches, it's important to take extra care of your health. Get your vitamin D levels checked, as sunlight exposure is limited during this season. Stay active to avoid seasonal depression, and ensure your home is well-ventilated to prevent respiratory issues. Seasonal flu vaccines are also recommended." }
        ]
    };

    // Function to create an alert element
    function createAlertElement(type, heading, message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;

        const alertIcon = document.createElement('div');
        alertIcon.className = 'alert-icon';
        alertIcon.textContent = type === 'urgent' ? '!' : type === 'info' ? 'i' : '✓';

        const alertContent = document.createElement('div');
        alertContent.className = 'alert-content';
        alertContent.innerHTML = `<strong>${heading}:</strong> ${message}`;

        alertDiv.appendChild(alertIcon);
        alertDiv.appendChild(alertContent);

        return alertDiv;
    }

    // Function to display a set of three alerts (urgent, info, update)
    function displayAlertSet() {
        const alertsContainer = document.getElementById('alerts-container');

        // Check if the element exists
        if (!alertsContainer) {
            console.error('Element with ID "alerts-container" not found.');
            return;
        }

        // Clear existing alerts
        alertsContainer.innerHTML = '';

        // Get one random alert from each category
        const urgentAlert = healthAlerts.urgent[Math.floor(Math.random() * healthAlerts.urgent.length)];
        const infoAlert = healthAlerts.info[Math.floor(Math.random() * healthAlerts.info.length)];
        const updateAlert = healthAlerts.update[Math.floor(Math.random() * healthAlerts.update.length)];

        // Create and append alert elements
        alertsContainer.appendChild(createAlertElement('urgent', urgentAlert.heading, urgentAlert.message));
        alertsContainer.appendChild(createAlertElement('info', infoAlert.heading, infoAlert.message));
        alertsContainer.appendChild(createAlertElement('update', updateAlert.heading, updateAlert.message));
    }

    // Simulate real-time updates every 10 seconds
    setInterval(displayAlertSet, 2000); // 10 seconds

    // Display the first set of alerts immediately
    displayAlertSet();
});


//******************************************************************* */
// Diily health tips

document.addEventListener('DOMContentLoaded', () => {
    // Sample daily health tips data with additional information
    const dailyHealthTips = [
        {
            icon: "💧",
            title: "Stay Hydrated",
            text: "Aim for 8-10 glasses of water daily to maintain energy levels and support metabolic functions.",
            additionalInfo: {
                advantages: [
                    "💧 Improves skin health and hydration.",
                    "⚡ Boosts energy and reduces fatigue.",
                    "🩺 Supports kidney function and detoxification."
                ],
                funFact: "Did you know? Your brain is about 75% water! Staying hydrated helps you think clearly and stay focused.",
                videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            }
        },
        {
            icon: "📱",
            title: "Reduce Screen Time",
            text: "Take regular breaks from screens to protect your eyes and reduce digital fatigue.",
            additionalInfo: {
                advantages: [
                    "👀 Reduces eye strain and dryness.",
                    "🧠 Improves focus and productivity.",
                    "😊 Enhances sleep quality by reducing blue light exposure."
                ],
                funFact: "Did you know? The average person spends over 7 hours a day looking at screens! Take a break!",
                videoLink: "https://www.youtube.com/watch?v=mno678" // Replace with a real link
            }
        },
        {
            icon: "🧘",
            title: "Practice Self-Care",
            text: "Schedule at least 15 minutes daily for activities that bring you joy and relaxation.",
            additionalInfo: {
                advantages: [
                    "🧘 Reduces stress and anxiety.",
                    "🧠 Improves mental clarity and focus.",
                    "😊 Enhances overall emotional well-being."
                ],
                funFact: "Did you know? Laughing for 15 minutes burns up to 40 calories! Self-care can be fun too!",
                videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            }
        },
        {
            icon: "🍬",
            title: "Cut Down on Sugar",
            text: "Reduce your intake of sugary drinks and snacks to maintain a healthy weight and prevent diseases.",
            additionalInfo: {
                advantages: [
                    "🍬 Reduces the risk of diabetes and obesity.",
                    "🦷 Improves dental health.",
                    "💪 Boosts energy levels without crashes."
                ],
                funFact: "Did you know? The average person consumes about 17 teaspoons of added sugar daily—way more than the recommended 6 teaspoons!",
                videoLink: "https://www.youtube.com/watch?v=stu234" // Replace with a real link
            }
        },
        {
            icon: "🍎",
            title: "Eat a Balanced Diet",
            text: "Include a variety of fruits, vegetables, whole grains, and lean proteins in your daily meals for optimal health.",
            additionalInfo: {
                advantages: [
                    "🍎 Provides essential vitamins and minerals.",
                    "💪 Boosts energy and supports muscle growth.",
                    "🩺 Reduces the risk of chronic diseases like diabetes and heart disease."
                ],
                funFact: "Did you know? Eating a rainbow of fruits and vegetables ensures you get a wide range of nutrients!",
                videoLink: "https://www.youtube.com/watch?v=abc123" // Replace with a real link
            }
        },
        {
            icon: "☀️",
            title: "Protect Your Skin",
            text: "Wear sunscreen daily to protect your skin from harmful UV rays and prevent skin cancer.",
            additionalInfo: {
                advantages: [
                    "☀️ Reduces the risk of skin cancer.",
                    "👶 Prevents premature aging and wrinkles.",
                    "🩺 Maintains healthy skin cells."
                ],
                funFact: "Did you know? Even on cloudy days, up to 80% of the sun's UV rays can reach your skin!",
                videoLink: "https://www.youtube.com/watch?v=yza890" // Replace with a real link
            }
        },
        {
            icon: "😴",
            title: "Get Enough Sleep",
            text: "Aim for 7-9 hours of quality sleep each night to recharge your body and mind.",
            additionalInfo: {
                advantages: [
                    "😴 Improves memory and cognitive function.",
                    "💤 Boosts immune system function.",
                    "😊 Enhances mood and reduces irritability."
                ],
                funFact: "Did you know? During sleep, your brain cleans itself by removing toxins that build up during the day!",
                videoLink: "https://www.youtube.com/watch?v=ghi012" // Replace with a real link
            }
        },
    ];

    // Get DOM elements
    const tipIcon = document.querySelector('.tip-icon');
    const tipTitle = document.querySelector('.tip-title');
    const tipText = document.querySelector('.tip-text');
    const readMoreBtn = document.querySelector('.read-more-btn');
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    const tipPopup = document.getElementById('tip-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupText = document.getElementById('popup-text');
    const popupAdditionalInfo = document.getElementById('popup-additional-info');
    const closeBtn = document.querySelector('.close-btn');

    let currentTipIndex = 0;

    // Function to display the current tip
    function displayCurrentTip() {
        const currentTip = dailyHealthTips[currentTipIndex];
        tipIcon.textContent = currentTip.icon;
        tipTitle.textContent = currentTip.title;
        tipText.textContent = currentTip.text;
    }

    // Function to cycle through tips
    function cycleTips() {
        currentTipIndex = (currentTipIndex + 1) % dailyHealthTips.length; // Move to the next tip
        displayCurrentTip();
    }

    // Function to show the popup with additional info
    function showPopup() {
        const currentTip = dailyHealthTips[currentTipIndex];
        popupTitle.textContent = currentTip.title;
        popupText.textContent = currentTip.text;
        popupAdditionalInfo.innerHTML = `
            <h4>Why is this important? 🤔</h4>
            <ul>
                ${currentTip.additionalInfo.advantages.map(advantage => `<li>${advantage}</li>`).join('')}
            </ul>
            <div class="fun-fact">
                <h4>Fun Fact! 😄</h4>
                <p>${currentTip.additionalInfo.funFact}</p>
            </div>
            <div class="video-link">
                <h4>Learn More 🎥</h4>
                <a href="${currentTip.additionalInfo.videoLink}" target="_blank">Watch this video on the importance of ${currentTip.title.toLowerCase()}!</a>
            </div>
        `;
        tipPopup.style.display = 'flex'; // Show the popup
    }

    // Function to hide the popup
    function hidePopup() {
        tipPopup.style.display = 'none'; // Hide the popup
    }

    // Function to bookmark the current tip
    function bookmarkTip() {
        const currentTip = dailyHealthTips[currentTipIndex];
        alert(`Bookmarked: ${currentTip.title}`);
        // You can save the bookmark to localStorage or a backend server here.
    }

    // Event listeners
    readMoreBtn.addEventListener('click', showPopup);
    bookmarkBtn.addEventListener('click', bookmarkTip);
    closeBtn.addEventListener('click', hidePopup);
    window.addEventListener('click', (event) => {
        if (event.target === tipPopup) {
            hidePopup();
        }
    });

    // Display the first tip immediately
    displayCurrentTip();

    // Cycle through tips every 10 seconds
    setInterval(cycleTips, 2000); // 10 seconds


     // Pagination and Filtering Logic
     let currentPage = 1;
     const articlesPerPage = 3;
     let allArticles = []; // To store fetched articles

  // Function to fetch articles from the API
  async function fetchArticles() {
    try {
        const response = await fetch('https://api.example.com/articles'); // Replace with your API endpoint
        if (!response.ok) {
            throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        allArticles = data; // Store fetched articles
        displayArticles(); // Display articles after fetching
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
}

     // Function to display articles based on the current page and filter
     function displayArticles() {
         const filterValue = document.getElementById('filter').value;
         const allArticles = Array.from(document.querySelectorAll('.article-card'));
         const filteredArticles = filterValue === 'all' 
             ? allArticles 
             : allArticles.filter(article => article.getAttribute('data-category') === filterValue);
 
              // Clear the articles container
        const articlesContainer = document.getElementById('articles-container');
        articlesContainer.innerHTML = '';

         // Create and append article cards for the current page
         paginatedArticles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card';
            articleCard.setAttribute('data-category', article.category);
            articleCard.innerHTML = `
                <h3 class="article-title">${article.title}</h3>
                <p class="article-author">By ${article.author} · ${article.date}</p>
                <p class="article-content">${article.content}</p>
                <div class="article-tags">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="#" class="read-more">Read More</a>
            `;
            articlesContainer.appendChild(articleCard);
        });

         // Hide all articles
         allArticles.forEach(article => article.style.display = 'none');
 
         // Calculate the range of articles to display
         const start = (currentPage - 1) * articlesPerPage;
         const end = start + articlesPerPage;
         const paginatedArticles = filteredArticles.slice(start, end);
 
         // Show the articles for the current page
         paginatedArticles.forEach(article => article.style.display = 'block');
 
         // Update the pagination indicator
         const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
         document.getElementById('page-indicator').textContent = `Page ${currentPage} of ${totalPages}`;
 
         // Enable/disable pagination buttons
         document.getElementById('prev-page').disabled = currentPage === 1;
         document.getElementById('next-page').disabled = currentPage === totalPages;
     }
 
     // Event listener for the filter dropdown
     document.getElementById('filter').addEventListener('change', () => {
         currentPage = 1; // Reset to the first page when filtering
         displayArticles();
     });
 
     // Event listener for the "Previous" button
     document.getElementById('prev-page').addEventListener('click', () => {
         if (currentPage > 1) {
             currentPage--;
             displayArticles();
         }
     });
 
     // Event listener for the "Next" button
     document.getElementById('next-page').addEventListener('click', () => {
         const filterValue = document.getElementById('filter').value;
         const allArticles = Array.from(document.querySelectorAll('.article-card'));
         const filteredArticles = filterValue === 'all' 
             ? allArticles 
             : allArticles.filter(article => article.getAttribute('data-category') === filterValue);
         const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
 
         if (currentPage < totalPages) {
             currentPage++;
             displayArticles();
         }
     });
 
     // Fetch articles when the page loads
    fetchArticles();
     // Initial display of articles
   //  displayArticles();
    
});
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

