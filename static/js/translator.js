// Ukrainian Winnipeg App - Translator Module

// ===== TRANSLATOR VARIABLES =====
let currentPhrases = [];
let filteredPhrases = [];
let currentCategory = 'all';
let isListening = false;
let isTranslating = false;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeTranslator();
});

function initializeTranslator() {
    // Load initial phrases
    loadPhrases();
    
    // Initialize event listeners
    initializeTranslatorEvents();
    
    // Check for URL parameters
    checkURLParameters();
    
    // Initialize speech capabilities
    checkSpeechCapabilities();
    
    console.log('Translator module initialized');
}

// ===== EVENT LISTENERS =====
function initializeTranslatorEvents() {
    // Voice input button
    const listenBtn = document.getElementById('listenUkrainian');
    if (listenBtn) {
        listenBtn.addEventListener('click', startVoiceInput);
    }
    
    // Clear button
    const clearBtn = document.getElementById('clearUkrainian');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearTranslation);
    }
    
    // Speak English button
    const speakBtn = document.getElementById('speakEnglish');
    if (speakBtn) {
        speakBtn.addEventListener('click', speakEnglishTranslation);
    }
    
    // Copy English button
    const copyBtn = document.getElementById('copyEnglish');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyEnglishTranslation);
    }
    
    // Ukrainian text input
    const ukrainianText = document.getElementById('ukrainianText');
    if (ukrainianText) {
        ukrainianText.addEventListener('input', debounce(handleTextInput, 500));
        ukrainianText.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                translateText();
            }
        });
    }
    
    // Category filter buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterByCategory(category);
            updateActiveCategory(this);
        });
    });
    
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
}

// ===== SPEECH CAPABILITIES =====
function checkSpeechCapabilities() {
    const listenBtn = document.getElementById('listenUkrainian');
    const speakBtn = document.getElementById('speakEnglish');
    
    // Check speech recognition support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        if (listenBtn) {
            listenBtn.disabled = true;
            listenBtn.innerHTML = '<i data-feather="mic-off" class="me-1"></i>Not Supported';
            listenBtn.title = 'Speech recognition not supported in this browser';
        }
        showToast('Speech recognition not supported. Please use Chrome or Edge for voice features.', 'warning');
    }
    
    // Check speech synthesis support
    if (!('speechSynthesis' in window)) {
        if (speakBtn) {
            speakBtn.disabled = true;
            speakBtn.innerHTML = '<i data-feather="volume-x" class="me-1"></i>Not Supported';
            speakBtn.title = 'Text-to-speech not supported in this browser';
        }
    }
    
    // Re-initialize feather icons
    feather.replace();
}

// ===== URL PARAMETERS =====
function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category && category !== 'all') {
        filterByCategory(category);
        updateActiveCategoryByName(category);
    }
}

// ===== PHRASE LOADING =====
function loadPhrases() {
    showPhraseLoading(true);
    
    // Get current category
    const category = currentCategory;
    const searchTerm = document.getElementById('searchInput')?.value || '';
    
    // Build URL with parameters
    const params = new URLSearchParams();
    if (category !== 'all') {
        params.append('category', category);
    }
    if (searchTerm) {
        params.append('search', searchTerm);
    }
    
    const url = `/api/translations?${params.toString()}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            currentPhrases = data;
            filteredPhrases = data;
            displayPhrases(data);
            showPhraseLoading(false);
        })
        .catch(error => {
            console.error('Error loading phrases:', error);
            showPhraseLoading(false);
            showPhraseError('Failed to load phrases. Please refresh the page.');
        });
}

// ===== PHRASE DISPLAY =====
function displayPhrases(phrases) {
    const phraseList = document.getElementById('phraseList');
    if (!phraseList) return;
    
    if (phrases.length === 0) {
        phraseList.innerHTML = `
            <div class="empty-state text-center py-5">
                <i data-feather="search" class="empty-icon"></i>
                <h4>No Phrases Found</h4>
                <p class="text-muted">No phrases match your current search or category filter.</p>
            </div>
        `;
        feather.replace();
        return;
    }
    
    let html = '';
    phrases.forEach(phrase => {
        html += `
            <div class="phrase-item" data-category="${phrase.category}">
                <div class="phrase-ukrainian">${escapeHtml(phrase.ukrainian)}</div>
                <div class="phrase-english">${escapeHtml(phrase.english)}</div>
                ${phrase.pronunciation ? `<div class="phrase-pronunciation">${escapeHtml(phrase.pronunciation)}</div>` : ''}
                <div class="phrase-meta">
                    <span class="phrase-category">${phrase.category.replace('_', ' ').toUpperCase()}</span>
                    ${phrase.subcategory ? `<span class="phrase-subcategory">${phrase.subcategory}</span>` : ''}
                </div>
                <div class="phrase-actions">
                    <button class="btn btn-sm btn-outline-primary" onclick="usePhrase('${escapeHtml(phrase.ukrainian)}', '${escapeHtml(phrase.english)}')">
                        <i data-feather="arrow-up" class="me-1"></i>
                        Use
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="speakPhrase('${escapeHtml(phrase.english)}')">
                        <i data-feather="volume-2" class="me-1"></i>
                        Listen
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="copyPhrase('${escapeHtml(phrase.english)}')">
                        <i data-feather="copy" class="me-1"></i>
                        Copy
                    </button>
                </div>
            </div>
        `;
    });
    
    phraseList.innerHTML = html;
    feather.replace();
}

function showPhraseLoading(show) {
    const phraseList = document.getElementById('phraseList');
    if (!phraseList) return;
    
    if (show) {
        phraseList.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading phrases...</span>
                </div>
                <p class="mt-3 text-muted">Loading phrases...</p>
            </div>
        `;
    }
}

function showPhraseError(message) {
    const phraseList = document.getElementById('phraseList');
    if (!phraseList) return;
    
    phraseList.innerHTML = `
        <div class="alert alert-danger text-center">
            <i data-feather="alert-circle" class="me-2"></i>
            ${message}
            <button class="btn btn-outline-danger btn-sm mt-2" onclick="loadPhrases()">
                <i data-feather="refresh-cw" class="me-1"></i>
                Retry
            </button>
        </div>
    `;
    feather.replace();
}

// ===== VOICE INPUT =====
function startVoiceInput() {
    if (isListening) {
        stopVoiceInput();
        return;
    }
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('Speech recognition not supported in this browser', 'error');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'uk-UA'; // Ukrainian
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    
    const listenBtn = document.getElementById('listenUkrainian');
    const listeningIndicator = document.getElementById('listeningIndicator');
    
    recognition.onstart = function() {
        isListening = true;
        if (listenBtn) {
            listenBtn.innerHTML = '<i data-feather="square" class="me-1"></i>Stop';
            listenBtn.classList.add('btn-danger');
            listenBtn.classList.remove('btn-primary');
        }
        if (listeningIndicator) {
            listeningIndicator.classList.remove('d-none');
        }
        console.log('Voice input started');
    };
    
    recognition.onresult = function(event) {
        const result = event.results[0][0].transcript;
        console.log('Voice input result:', result);
        
        const ukrainianText = document.getElementById('ukrainianText');
        if (ukrainianText) {
            ukrainianText.value = result;
            translateText();
        }
    };
    
    recognition.onerror = function(event) {
        console.error('Voice input error:', event.error);
        
        let errorMessage = 'Voice input error occurred';
        switch(event.error) {
            case 'no-speech':
                errorMessage = 'No speech detected. Please speak clearly into your microphone.';
                break;
            case 'audio-capture':
                errorMessage = 'Microphone not accessible. Please check your device settings.';
                break;
            case 'not-allowed':
                errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
                break;
            case 'network':
                errorMessage = 'Network error occurred. Please check your internet connection.';
                break;
            case 'aborted':
                return; // User cancelled, don't show error
            default:
                errorMessage = `Voice input error: ${event.error}`;
        }
        
        showErrorMessage(errorMessage);
    };
    
    recognition.onend = function() {
        isListening = false;
        if (listenBtn) {
            listenBtn.innerHTML = '<i data-feather="mic" class="me-1"></i>Listen';
            listenBtn.classList.remove('btn-danger');
            listenBtn.classList.add('btn-primary');
        }
        if (listeningIndicator) {
            listeningIndicator.classList.add('d-none');
        }
        feather.replace();
        console.log('Voice input ended');
    };
    
    try {
        recognition.start();
    } catch (error) {
        console.error('Failed to start voice recognition:', error);
        showToast('Failed to start voice recognition', 'error');
        isListening = false;
    }
}

function stopVoiceInput() {
    if (window.currentSpeechRecognition) {
        window.currentSpeechRecognition.abort();
    }
    isListening = false;
}

// ===== TEXT TRANSLATION =====
function handleTextInput() {
    const ukrainianText = document.getElementById('ukrainianText');
    if (!ukrainianText) return;
    
    const text = ukrainianText.value.trim();
    if (text.length > 0) {
        translateText();
    } else {
        clearEnglishText();
    }
}

function translateText() {
    const ukrainianText = document.getElementById('ukrainianText');
    const englishText = document.getElementById('englishText');
    
    if (!ukrainianText || !englishText) return;
    
    const text = ukrainianText.value.trim();
    if (!text) {
        clearEnglishText();
        return;
    }
    
    showTranslatingIndicator(true);
    
    // Check if input is Cyrillic (Ukrainian) or Latin (English)
    const isCyrillic = /[\u0400-\u04FF]/.test(text);
    const isLatin = /[A-Za-z]/.test(text);
    
    let exactMatch = null;
    let partialMatches = [];
    
    if (isCyrillic) {
        // Ukrainian to English translation
        exactMatch = currentPhrases.find(phrase => 
            phrase.ukrainian.toLowerCase() === text.toLowerCase()
        );
        
        if (!exactMatch) {
            partialMatches = currentPhrases.filter(phrase =>
                phrase.ukrainian.toLowerCase().includes(text.toLowerCase()) ||
                text.toLowerCase().includes(phrase.ukrainian.toLowerCase())
            );
        }
    } else if (isLatin) {
        // English to Ukrainian translation (reverse lookup)
        exactMatch = currentPhrases.find(phrase => 
            phrase.english.toLowerCase() === text.toLowerCase()
        );
        
        if (exactMatch) {
            // For English input, show Ukrainian as result
            englishText.value = exactMatch.ukrainian;
            enableTranslationButtons();
            showTranslatingIndicator(false);
            showToast(`English → Ukrainian: "${exactMatch.english}" → "${exactMatch.ukrainian}"`, 'success');
            return;
        }
        
        // Look for partial matches in English text
        partialMatches = currentPhrases.filter(phrase =>
            phrase.english.toLowerCase().includes(text.toLowerCase()) ||
            text.toLowerCase().includes(phrase.english.toLowerCase())
        );
        
        if (partialMatches.length > 0) {
            const bestMatch = partialMatches.reduce((best, current) => {
                if (current.english.toLowerCase().includes(text.toLowerCase())) {
                    if (!best || current.english.length < best.english.length) {
                        return current;
                    }
                }
                return best;
            }, null);
            
            if (bestMatch) {
                englishText.value = bestMatch.ukrainian;
                enableTranslationButtons();
                showTranslatingIndicator(false);
                showToast(`English → Ukrainian: "${bestMatch.english}" → "${bestMatch.ukrainian}"`, 'info');
                return;
            }
        }
    }
    
    // Handle Ukrainian matches
    if (exactMatch && isCyrillic) {
        englishText.value = exactMatch.english;
        enableTranslationButtons();
        showTranslatingIndicator(false);
        return;
    }
    
    if (partialMatches.length > 0 && isCyrillic) {
        // Use the best match (shortest Ukrainian text that contains the input)
        const bestMatch = partialMatches.reduce((best, current) => {
            if (current.ukrainian.toLowerCase().includes(text.toLowerCase())) {
                if (!best || current.ukrainian.length < best.ukrainian.length) {
                    return current;
                }
            }
            return best;
        }, null);
        
        if (bestMatch) {
            englishText.value = bestMatch.english;
            enableTranslationButtons();
            showTranslatingIndicator(false);
            
            // Show suggestion
            showToast(`Ukrainian → English: "${bestMatch.ukrainian}" → "${bestMatch.english}"`, 'info');
            return;
        }
    }
    
    // No matches found
    const direction = isCyrillic ? 'Ukrainian → English' : isLatin ? 'English → Ukrainian' : 'Translation';
    englishText.value = `${direction} translation not found. Try: "${text}" (Please add this phrase to help others!)`;
    disableTranslationButtons();
    showTranslatingIndicator(false);
    
    // Show helpful message
    const hint = isCyrillic ? 'Try typing in English for reverse translation' : isLatin ? 'Try typing in Ukrainian (Cyrillic)' : 'Try using Ukrainian or English text';
    showToast(`Phrase not found in database. ${hint}`, 'warning');
}

// ===== TRANSLATION CONTROLS =====
function clearTranslation() {
    const ukrainianText = document.getElementById('ukrainianText');
    const englishText = document.getElementById('englishText');
    
    if (ukrainianText) ukrainianText.value = '';
    if (englishText) englishText.value = '';
    
    disableTranslationButtons();
    hideAllIndicators();
}

function clearEnglishText() {
    const englishText = document.getElementById('englishText');
    if (englishText) englishText.value = '';
    disableTranslationButtons();
}

function speakEnglishTranslation() {
    const englishText = document.getElementById('englishText');
    if (!englishText || !englishText.value.trim()) return;
    
    speakText(englishText.value.trim());
}

function copyEnglishTranslation() {
    const englishText = document.getElementById('englishText');
    if (!englishText || !englishText.value.trim()) return;
    
    copyToClipboard(englishText.value.trim());
}

function enableTranslationButtons() {
    const speakBtn = document.getElementById('speakEnglish');
    const copyBtn = document.getElementById('copyEnglish');
    
    if (speakBtn) {
        speakBtn.disabled = false;
        speakBtn.classList.remove('btn-outline-secondary');
        speakBtn.classList.add('btn-success');
    }
    
    if (copyBtn) {
        copyBtn.disabled = false;
        copyBtn.classList.remove('btn-outline-secondary');
        copyBtn.classList.add('btn-outline-primary');
    }
}

function disableTranslationButtons() {
    const speakBtn = document.getElementById('speakEnglish');
    const copyBtn = document.getElementById('copyEnglish');
    
    if (speakBtn) {
        speakBtn.disabled = true;
        speakBtn.classList.remove('btn-success');
        speakBtn.classList.add('btn-outline-secondary');
    }
    
    if (copyBtn) {
        copyBtn.disabled = true;
        copyBtn.classList.remove('btn-outline-primary');
        copyBtn.classList.add('btn-outline-secondary');
    }
}

// ===== FILTERING =====
function filterByCategory(category) {
    currentCategory = category;
    loadPhrases();
    
    // Update URL without page reload
    const url = new URL(window.location);
    if (category === 'all') {
        url.searchParams.delete('category');
    } else {
        url.searchParams.set('category', category);
    }
    window.history.pushState({}, '', url);
}

function updateActiveCategory(buttonElement) {
    // Remove active class from all buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    buttonElement.classList.add('active');
}

function updateActiveCategoryByName(categoryName) {
    const button = document.querySelector(`[data-category="${categoryName}"]`);
    if (button) {
        updateActiveCategory(button);
    }
}

// ===== SEARCH =====
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.trim();
    loadPhrases(); // This will use the current search term
}

// ===== PHRASE ACTIONS =====
function usePhrase(ukrainian, english) {
    const ukrainianText = document.getElementById('ukrainianText');
    const englishText = document.getElementById('englishText');
    
    if (ukrainianText) ukrainianText.value = ukrainian;
    if (englishText) englishText.value = english;
    
    enableTranslationButtons();
    
    // Scroll to translator interface
    const translatorInterface = document.querySelector('.translator-interface');
    if (translatorInterface) {
        translatorInterface.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    showToast('Phrase loaded into translator', 'success');
}

function speakPhrase(text) {
    speakText(text);
}

function copyPhrase(text) {
    copyToClipboard(text);
}

// ===== INDICATOR HELPERS =====
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

function hideAllIndicators() {
    const indicators = ['listeningIndicator', 'translatingIndicator', 'errorMessage'];
    indicators.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('d-none');
        }
    });
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function speakText(text) {
    if (window.UkrainianApp && window.UkrainianApp.speakText) {
        window.UkrainianApp.speakText(text);
    } else if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    } else {
        showToast('Text-to-speech not supported', 'error');
    }
}

function copyToClipboard(text) {
    if (window.UkrainianApp && window.UkrainianApp.copyToClipboard) {
        window.UkrainianApp.copyToClipboard(text);
    } else {
        // Fallback implementation
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy to clipboard', 'error');
        });
    }
}

function showToast(message, type = 'info') {
    if (window.UkrainianApp && window.UkrainianApp.showToast) {
        window.UkrainianApp.showToast(message, type);
    } else {
        // Fallback implementation
        console.log(`${type.toUpperCase()}: ${message}`);
        alert(message);
    }
}

// ===== EXPORT FOR GLOBAL ACCESS =====
window.TranslatorApp = {
    usePhrase,
    speakPhrase,
    copyPhrase,
    translateText,
    clearTranslation,
    startVoiceInput,
    filterByCategory
};
