// Ukrainian Winnipeg App - Main JavaScript

// ===== GLOBAL VARIABLES =====
let currentSpeechSynthesis = null;
let currentSpeechRecognition = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Initialize tooltips and popovers
    initializeBootstrapComponents();
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize global event listeners
    initializeGlobalEventListeners();
    
    // Initialize service worker for PWA
    initializeServiceWorker();
    
    // Initialize theme and preferences
    initializeUserPreferences();
    
    console.log('Ukrainian Winnipeg App initialized successfully');
}

// ===== BOOTSTRAP COMPONENTS =====
function initializeBootstrapComponents() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.quick-access-card, .featured-section-card, .lesson-card, .community-card, .heritage-card, .event-card, .resource-card'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// ===== GLOBAL EVENT LISTENERS =====
function initializeGlobalEventListeners() {
    // Smooth scrolling for anchor links
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
    
    // Handle external links
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="http"]:not([href*="' + window.location.hostname + '"])')) {
            e.target.setAttribute('target', '_blank');
            e.target.setAttribute('rel', 'noopener noreferrer');
        }
    });
    
    // Global search functionality
    initializeGlobalSearch();
}

// ===== SEARCH FUNCTIONALITY =====
function initializeGlobalSearch() {
    const searchForm = document.querySelector('form[action*="search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const searchInput = this.querySelector('input[name="q"]');
            if (searchInput && searchInput.value.trim() === '') {
                e.preventDefault();
                showToast('Please enter a search term', 'warning');
            }
        });
    }
}

// ===== SPEECH SYNTHESIS =====
function speakText(text, lang = 'en-US', rate = 0.8) {
    if (!('speechSynthesis' in window)) {
        showToast('Text-to-speech is not supported in your browser', 'error');
        return;
    }
    
    // Stop any current speech
    if (currentSpeechSynthesis) {
        speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = function() {
        console.log('Speech started');
    };
    
    utterance.onend = function() {
        console.log('Speech ended');
        currentSpeechSynthesis = null;
    };
    
    utterance.onerror = function(event) {
        console.error('Speech synthesis error:', event);
        showToast('Error playing audio', 'error');
        currentSpeechSynthesis = null;
    };
    
    currentSpeechSynthesis = utterance;
    speechSynthesis.speak(utterance);
}

// ===== SPEECH RECOGNITION =====
function startSpeechRecognition(callback, lang = 'uk-UA') {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('Speech recognition is not supported in your browser. Please try Chrome or Edge.', 'error');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    
    recognition.onstart = function() {
        console.log('Speech recognition started');
        showListeningIndicator(true);
    };
    
    recognition.onresult = function(event) {
        const result = event.results[0][0].transcript;
        console.log('Speech recognition result:', result);
        showListeningIndicator(false);
        if (callback) callback(result);
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        showListeningIndicator(false);
        
        let errorMessage = 'Speech recognition error';
        switch(event.error) {
            case 'no-speech':
                errorMessage = 'No speech detected. Please try again.';
                break;
            case 'audio-capture':
                errorMessage = 'Microphone not accessible. Please check permissions.';
                break;
            case 'not-allowed':
                errorMessage = 'Microphone access denied. Please allow microphone access.';
                break;
            case 'network':
                errorMessage = 'Network error occurred. Please check your connection.';
                break;
            default:
                errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        showToast(errorMessage, 'error');
    };
    
    recognition.onend = function() {
        console.log('Speech recognition ended');
        showListeningIndicator(false);
        currentSpeechRecognition = null;
    };
    
    currentSpeechRecognition = recognition;
    recognition.start();
}

// ===== UI HELPERS =====
function showListeningIndicator(show) {
    const indicator = document.getElementById('listeningIndicator');
    if (indicator) {
        if (show) {
            indicator.classList.remove('d-none');
        } else {
            indicator.classList.add('d-none');
        }
    }
}

function showTranslatingIndicator(show) {
    const indicator = document.getElementById('translatingIndicator');
    if (indicator) {
        if (show) {
            indicator.classList.remove('d-none');
        } else {
            indicator.classList.add('d-none');
        }
    }
}

function showErrorMessage(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('d-none');
        
        setTimeout(() => {
            errorDiv.classList.add('d-none');
        }, 5000);
    }
}

function showToast(message, type = 'info', duration = 3000) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Set background color based on type
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    toast.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Remove after duration
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, duration);
}

// ===== LOCAL STORAGE HELPERS =====
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

// ===== USER PREFERENCES =====
function initializeUserPreferences() {
    // Load user preferences
    const preferences = loadFromLocalStorage('userPreferences', {
        language: 'en',
        speechRate: 0.8,
        autoPlay: false
    });
    
    // Apply preferences
    applyUserPreferences(preferences);
}

function applyUserPreferences(preferences) {
    // Apply speech rate
    if (preferences.speechRate) {
        window.userSpeechRate = preferences.speechRate;
    }
    
    // Apply auto-play setting
    if (preferences.autoPlay) {
        window.userAutoPlay = preferences.autoPlay;
    }
}

function updateUserPreference(key, value) {
    const preferences = loadFromLocalStorage('userPreferences', {});
    preferences[key] = value;
    saveToLocalStorage('userPreferences', preferences);
    applyUserPreferences(preferences);
}

// ===== COPY TO CLIPBOARD =====
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Copied to clipboard!', 'success');
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showToast('Failed to copy to clipboard', 'error');
    }
    
    document.body.removeChild(textArea);
}

// ===== SHARE FUNCTIONALITY =====
function shareContent(title, text, url = window.location.href) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).catch(err => {
            console.error('Error sharing:', err);
            copyToClipboard(`${title} - ${url}`);
        });
    } else {
        copyToClipboard(`${title} - ${url}`);
    }
}

// ===== SERVICE WORKER =====
function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/static/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateAvailable();
                            }
                        });
                    });
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed:', err);
                });
        });
    }
}

function showUpdateAvailable() {
    const updateBanner = document.createElement('div');
    updateBanner.innerHTML = `
        <div class="alert alert-info alert-dismissible fade show position-fixed" style="top: 80px; right: 20px; z-index: 9999; max-width: 300px;">
            <strong>Update Available!</strong><br>
            A new version of the app is available.
            <button type="button" class="btn btn-sm btn-info mt-2" onclick="updateApp()">Update Now</button>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.body.appendChild(updateBanner);
}

function updateApp() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ action: 'skipWaiting' });
                window.location.reload();
            }
        });
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

function sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showToast('An error occurred. Please try again.', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showToast('An error occurred. Please try again.', 'error');
    e.preventDefault();
});

// ===== CSS ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.UkrainianApp = {
    speakText,
    startSpeechRecognition,
    showToast,
    copyToClipboard,
    shareContent,
    saveToLocalStorage,
    loadFromLocalStorage,
    updateUserPreference
};
