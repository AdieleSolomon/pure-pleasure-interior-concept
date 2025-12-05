// Mobile Navigation Toggle - Wrapped in function for deferred execution
function initializeNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }
}

// Modal Elements - Lazy initialization to avoid null references
let modal = null;
let modalTitle = null;
let modalImage = null;
let modalDescription = null;
let modalCategory = null;
let modalDate = null;
let whatsappLink = null;
let emailLink = null;
let backToGallery = null;
let closeBtn = null;

// Initialize modal elements safely
function initializeModalElements() {
    modal = document.getElementById('designModal');
    modalTitle = document.getElementById('modalTitle');
    modalImage = document.getElementById('modalImage');
    modalDescription = document.getElementById('modalDescription');
    modalCategory = document.getElementById('modalCategory');
    modalDate = document.getElementById('modalDate');
    whatsappLink = document.getElementById('whatsappLink');
    emailLink = document.getElementById('emailLink');
    backToGallery = document.getElementById('backToGallery');
    closeBtn = document.querySelectorAll('.close-btn');
}

// WhatsApp Configuration - FIXED PHONE NUMBER
const WHATSAPP_NUMBER = '+2348165262854';
const BUSINESS_NAME = 'Pure Pleasure Building and Interior Concept';
const BUSINESS_EMAIL = 'Abrahamuwaoma71@gmail.com';

// State management
let designs = [];
let videos = [];

// GitHub JSON URL - Using your repository
const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/AdieleSolomon/Image-Gallery/main/gallery.json';
const GITHUB_VIDEOS_URL = 'https://raw.githubusercontent.com/AdieleSolomon/Image-Gallery/main/videos.json';

// Loading state elements - Initialize lazily
let galleryLoading = null;
let galleryError = null;
let galleryEmpty = null;
let galleryContainer = null;
let retryLoadGallery = null;
let lastUpdatedDate = null;
let currentYear = null;
let videosLoading = null;
let videosError = null;
let videosEmpty = null;
let videosGrid = null;
let retryLoadVideos = null;

// Function to initialize loading state elements
function initializeLoadingElements() {
    galleryLoading = document.getElementById('galleryLoading');
    galleryError = document.getElementById('galleryError');
    galleryEmpty = document.getElementById('galleryEmpty');
    galleryContainer = document.getElementById('designGallery');
    retryLoadGallery = document.getElementById('retryLoadGallery');
    lastUpdatedDate = document.getElementById('lastUpdatedDate');
    currentYear = document.getElementById('currentYear');
    videosLoading = document.getElementById('videosLoading');
    videosError = document.getElementById('videosError');
    videosEmpty = document.getElementById('videosEmpty');
    videosGrid = document.getElementById('videosGrid');
    retryLoadVideos = document.getElementById('retryLoadVideos');
    
    // Set current year in footer
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

// Initialize WhatsApp CTA Button in Footer
function initWhatsAppCTA() {
    const whatsappCTA = document.createElement('a');
    whatsappCTA.href = getWhatsAppUrl(`Hello ${BUSINESS_NAME}! I would like to inquire about your services.`);
    whatsappCTA.className = 'whatsapp-cta';
    whatsappCTA.target = '_blank';
    whatsappCTA.rel = 'noopener noreferrer';
    whatsappCTA.innerHTML = '<i class="fab fa-whatsapp"></i>';
    whatsappCTA.title = 'Chat with us on WhatsApp';
    
    document.body.appendChild(whatsappCTA);
}

// Function to generate WhatsApp URL
function getWhatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Function to get design inquiry message
function getDesignInquiryMessage(design) {
    return `Hello ${BUSINESS_NAME}!\n\nI'm interested in your "${design.title}" design.\n\nDesign Details:\n• Title: ${design.title}\n• Category: ${design.category || 'Interior Design'}\n\nPlease send me more information about this design, pricing details, and portfolio.`;
}

// Load all data from GitHub
async function loadAllData() {
    try {
        await Promise.all([
            loadGalleryData(),
            loadVideosData()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Load gallery data from GitHub
async function loadGalleryData() {
    try {
        // Show loading state
        showGalleryLoadingState();
        
        // Fetch data from GitHub
        const response = await fetch(GITHUB_JSON_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        designs = data.designs || [];
        
        // Update last updated date in footer
        if (data.lastUpdated && lastUpdatedDate) {
            lastUpdatedDate.textContent = data.lastUpdated;
        } else if (lastUpdatedDate) {
            lastUpdatedDate.textContent = 'Recently';
        }
        
        // Render designs
        renderDesigns();
        
    } catch (error) {
        console.error('Error loading gallery:', error);
        showGalleryErrorState();
        
        // Fallback to static designs if GitHub fails
        loadFallbackDesigns();
    }
}

// Load videos data from GitHub
async function loadVideosData() {
    try {
        // Show loading state
        showVideosLoadingState();
        
        // Fetch videos data from GitHub
        const response = await fetch(GITHUB_VIDEOS_URL);
        
        if (!response.ok) {
            // Try fallback video data
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        videos = data.videos || [];
        
        // If no videos in JSON, use fallback
        if (videos.length === 0) {
            loadFallbackVideos();
        } else {
            renderVideos();
        }
        
    } catch (error) {
        console.error('Error loading videos:', error);
        // Use fallback videos
        loadFallbackVideos();
    }
}

// Gallery Loading States
function showGalleryLoadingState() {
    if (galleryLoading) galleryLoading.style.display = 'block';
    if (galleryError) galleryError.style.display = 'none';
    if (galleryEmpty) galleryEmpty.style.display = 'none';
    if (galleryContainer) galleryContainer.style.display = 'none';
}

function showGalleryErrorState() {
    if (galleryLoading) galleryLoading.style.display = 'none';
    if (galleryError) galleryError.style.display = 'block';
    if (galleryEmpty) galleryEmpty.style.display = 'none';
    if (galleryContainer) galleryContainer.style.display = 'none';
}

function showGalleryEmptyState() {
    if (galleryLoading) galleryLoading.style.display = 'none';
    if (galleryError) galleryError.style.display = 'none';
    if (galleryEmpty) galleryEmpty.style.display = 'block';
    if (galleryContainer) galleryContainer.style.display = 'none';
}

function showGalleryContent() {
    if (galleryLoading) galleryLoading.style.display = 'none';
    if (galleryError) galleryError.style.display = 'none';
    if (galleryEmpty) galleryEmpty.style.display = 'none';
    if (galleryContainer) {
        galleryContainer.style.display = 'grid';
    }
}

// Videos Loading States
function showVideosLoadingState() {
    if (videosLoading) videosLoading.style.display = 'block';
    if (videosError) videosError.style.display = 'none';
    if (videosEmpty) videosEmpty.style.display = 'none';
    if (videosGrid) videosGrid.style.display = 'none';
}

function showVideosErrorState() {
    if (videosLoading) videosLoading.style.display = 'none';
    if (videosError) videosError.style.display = 'block';
    if (videosEmpty) videosEmpty.style.display = 'none';
    if (videosGrid) videosGrid.style.display = 'none';
}

function showVideosEmptyState() {
    if (videosLoading) videosLoading.style.display = 'none';
    if (videosError) videosError.style.display = 'none';
    if (videosEmpty) videosEmpty.style.display = 'block';
    if (videosGrid) videosGrid.style.display = 'none';
}

function showVideosContent() {
    if (videosLoading) videosLoading.style.display = 'none';
    if (videosError) videosError.style.display = 'none';
    if (videosEmpty) videosEmpty.style.display = 'none';
    if (videosGrid) {
        videosGrid.style.display = 'grid';
    }
}

// Render designs to the gallery with WhatsApp buttons
function renderDesigns() {
    if (!galleryContainer) {
        console.error('Gallery container not found!');
        return;
    }
    
    galleryContainer.innerHTML = '';
    
    if (designs.length === 0) {
        showGalleryEmptyState();
        return;
    }
    
    showGalleryContent();
    
    designs.forEach((design, index) => {
        const designCard = createDesignCard(design, index);
        galleryContainer.appendChild(designCard);
    });
}

// Render videos to the videos grid
function renderVideos() {
    if (!videosGrid) {
        console.error('Videos grid not found!');
        return;
    }
    
    videosGrid.innerHTML = '';
    
    if (videos.length === 0) {
        showVideosEmptyState();
        return;
    }
    
    showVideosContent();
    
    videos.forEach((video, index) => {
        const videoCard = createVideoCard(video, index);
        videosGrid.appendChild(videoCard);
    });
}

// Create a design card element with WhatsApp button BELOW (no overlay)
function createDesignCard(design, index) {
    const designCard = document.createElement('div');
    designCard.className = 'design-card';
    designCard.setAttribute('data-id', design.id || index + 1);
    
    // Generate WhatsApp URL for this design
    const whatsappUrl = getWhatsAppUrl(getDesignInquiryMessage(design));
    
    // Create image container - SIMPLIFIED - NO OVERLAY
    designCard.innerHTML = `
        <div class="design-img-container">
            <img src="${design.image}" 
                    alt="${design.title}" 
                    class="design-img"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'; this.alt='Image not available'">
        </div>
        <div class="design-info">
            <h3>${design.title}</h3>
            <p>${(design.description || '').substring(0, 100)}${design.description && design.description.length > 100 ? '...' : ''}</p>
            ${design.category ? `<span class="design-category">${design.category}</span>` : ''}
            ${design.date ? `<span class="design-date">${design.date}</span>` : ''}
            <a href="${whatsappUrl}" 
                class="btn design-quick-whatsapp" 
                target="_blank" 
                rel="noopener noreferrer"
                style="margin-top: 15px; background-color: #25D366; border: none; padding: 8px 15px; font-size: 0.9rem;">
                <i class="fab fa-whatsapp"></i> Inquire on WhatsApp
            </a>
        </div>
    `;
    
    // Add click event for entire card to open modal
    designCard.addEventListener('click', (e) => {
        // Check if WhatsApp button or any of its children were clicked
        const whatsappButton = e.target.closest('.design-quick-whatsapp');
        
        if (whatsappButton) {
            // Stop propagation and let the link work normally
            e.stopPropagation();
            return;
        }
        
        // Open modal for any other click on the card
        openDesignModal(design);
    });
    
    return designCard;
}

// Create a video card element with YouTube embed
function createVideoCard(video, index) {
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    videoCard.setAttribute('data-id', video.id || index + 1);
    
    // Extract YouTube video ID from URL
    let videoId = '';
    if (video.url) {
        const match = video.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
        if (match && match[1]) {
            videoId = match[1];
        }
    }
    
    // Create video embed or placeholder
    const videoEmbed = videoId 
        ? `<div class="video-container">
                <iframe src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        loading="lazy">
                </iframe>
            </div>`
            : `<div class="video-container">
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #000; color: #fff;">
                    <p>Video unavailable</p>
                </div>
            </div>`;
    
    videoCard.innerHTML = `
        ${videoEmbed}
        <div class="video-info">
            <h3>${video.title || 'Design Video'}</h3>
            <p>${video.description || 'Watch our design process and finished projects.'}</p>
            ${video.date ? `<span class="design-date">${video.date}</span>` : ''}
        </div>
    `;
    
    return videoCard;
}

// Fallback designs if GitHub fails
function loadFallbackDesigns() {
    designs = [
        {
            id: 1,
            title: "Window Blind & Curtain",
            image: "https://raw.githubusercontent.com/AdieleSolomon/Image-Gallery/main/images/design1.jpg",
            description: "Luxury window blind and curtain design for modern interiors.",
            category: "Interior Decoration",
            date: "2024-01-15"
        },
        {
            id: 2,
            title: "Window Treatment Solution",
            image: "https://raw.githubusercontent.com/AdieleSolomon/Image-Gallery/main/images/design2.jpg",
            description: "Professional window treatment solution combining blinds and curtains.",
            category: "Interior Decoration",
            date: "2024-01-15"
        },
        {
            id: 3,
            title: "Modern Curtain Installation",
            image: "https://raw.githubusercontent.com/AdieleSolomon/Image-Gallery/main/images/design3.jpg",
            description: "Modern curtain installation with custom tracks and premium fabric.",
            category: "Interior Decoration",
            date: "2024-01-15"
        }
    ];
    
    renderDesigns();
}

// Fallback videos
function loadFallbackVideos() {
    videos = [
        {
            id: 1,
            title: "Interior Design Process",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description: "Watch how we transform spaces from concept to completion.",
            date: "2024-01-15"
        },
        {
            id: 2,
            title: "Modern Window Treatments",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description: "Learn about the latest window treatment solutions for modern homes.",
            date: "2024-01-15"
        },
        {
            id: 3,
            title: "Space Planning Techniques",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description: "Professional techniques for optimizing space in any room.",
            date: "2024-01-15"
        }
    ];
    
    renderVideos();
}

// Open Modal when Design Image is Clicked
function openDesignModal(design) {
    if (!modal || !modalTitle || !modalImage || !modalDescription) {
        console.error('Modal elements not properly initialized');
        return;
    }
    
    modalTitle.textContent = design.title;
    modalImage.src = design.image;
    modalImage.alt = design.title;
    modalDescription.textContent = design.description;
    
    // Set category and date if available
    if (modalCategory) {
        modalCategory.textContent = design.category || 'Interior Design';
        modalCategory.style.display = design.category ? 'inline-block' : 'none';
    }
    
    if (modalDate) {
        modalDate.textContent = design.date || '';
        modalDate.style.display = design.date ? 'inline-block' : 'none';
    }
    
    // Create WhatsApp message
    const whatsappMessage = getDesignInquiryMessage(design);
    if (whatsappLink) {
        const whatsappUrl = getWhatsAppUrl(whatsappMessage);
        whatsappLink.href = whatsappUrl;
        whatsappLink.target = '_blank';
        whatsappLink.rel = 'noopener noreferrer';
        console.log('WhatsApp link set:', whatsappUrl);
    } else {
        console.warn('WhatsApp link element not found');
    }
    
    // Create Email link
    const emailSubject = `Inquiry about ${design.title} Design - ${BUSINESS_NAME}`;
    const emailBody = `Hello ${BUSINESS_NAME} Team,\n\nI'm interested in your "${design.title}" design.\n\nDesign Details:\n• Title: ${design.title}\n• Category: ${design.category || 'Interior Design'}\n• Description: ${design.description || 'No description available'}\n\nPlease provide me with more information about:\n1. Detailed specifications\n2. Pricing information\n3. Timeline for completion\n4. Any similar projects you've done\n\nThank you for your assistance.\n\nBest regards,\n[Your Name]`;
    if (emailLink) {
        emailLink.href = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    }
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Prevent click inside modal from closing it
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// Close Modal
function closeModal() {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Add close button event listeners
function setupCloseButtonListeners() {
    if (closeBtn && closeBtn.length > 0) {
        closeBtn.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeModal();
            });
        });
    }
    
    if (backToGallery) {
        backToGallery.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });
    }
    
    // Close Modal when clicking outside content
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

// Attach WhatsApp and Email link handlers AFTER modal is created
function attachModalLinkHandlers() {
    if (whatsappLink) {
        // Remove any existing listeners to prevent duplicates
        const newWhatsappLink = whatsappLink.cloneNode(true);
        whatsappLink.parentNode.replaceChild(newWhatsappLink, whatsappLink);
        whatsappLink = newWhatsappLink;
        
        whatsappLink.addEventListener('click', function(e) {
            // Let the link navigate normally
            console.log('WhatsApp button clicked:', this.href);
        });
    }
    
    if (emailLink) {
        // Remove any existing listeners to prevent duplicates
        const newEmailLink = emailLink.cloneNode(true);
        emailLink.parentNode.replaceChild(newEmailLink, emailLink);
        emailLink = newEmailLink;
        
        emailLink.addEventListener('click', function(e) {
            // Let the link navigate normally
            console.log('Email button clicked:', this.href);
        });
    }
}

// Contact Form Submission to WhatsApp - Initialize in DOMContentLoaded
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Create WhatsApp message
            const whatsappMessage = `Hello ${BUSINESS_NAME}!\n\nNew Contact Inquiry:\n\n• Name: ${name || 'Not provided'}\n• Email: ${email || 'Not provided'}\n• Phone: ${phone || 'Not provided'}\n• Message: ${message || 'No message provided'}\n\nThis inquiry was submitted through your website.`;
            
            // Open WhatsApp with pre-filled message
            window.open(getWhatsAppUrl(whatsappMessage), '_blank');
            
            // Show success message
            alert('Thank you for your message! You will be redirected to WhatsApp to send your inquiry.');
            
            // Reset form
            this.reset();
        });
    }
}

// Smooth scrolling for anchor links - Initialize in DOMContentLoaded
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all DOM elements first
    initializeNavigation();
    initializeModalElements();
    initializeLoadingElements();
    initializeContactForm();
    initializeSmoothScrolling();
    
    // Setup close button listeners
    setupCloseButtonListeners();
    
    // Initialize WhatsApp CTA button
    initWhatsAppCTA();
    
    // Load all data from GitHub
    loadAllData();
    
    // Setup retry buttons if they exist
    if (retryLoadGallery) {
        retryLoadGallery.addEventListener('click', loadGalleryData);
    }
    if (retryLoadVideos) {
        retryLoadVideos.addEventListener('click', loadVideosData);
    }
    
    // Add resize listener to handle mobile menu on orientation change
    window.addEventListener('resize', () => {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && window.innerWidth > 767) {
            navLinks.classList.remove('active');
        }
    });
});

// Image error handler for modal
if (modalImage) {
    modalImage.onerror = function() {
        this.src = 'https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
        this.alt = 'Image not available';
    };
}

// Handle lazy loading images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add touch events for mobile
document.addEventListener('touchstart', function() {}, {passive: true});