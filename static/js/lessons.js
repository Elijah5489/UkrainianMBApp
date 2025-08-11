// Ukrainian Winnipeg App - Lessons Module

// ===== LESSON VARIABLES =====
let currentLesson = null;
let practiceSession = null;
let userProgress = {};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeLessons();
});

function initializeLessons() {
    // Load user progress
    loadUserProgress();
    
    // Initialize lesson interactions
    initializeLessonEvents();
    
    // Initialize practice features
    initializePracticeFeatures();
    
    // Update progress display
    updateProgressDisplay();
    
    console.log('Lessons module initialized');
}

// ===== EVENT LISTENERS =====
function initializeLessonEvents() {
    // Lesson card click handlers
    const lessonCards = document.querySelectorAll('.lesson-card');
    lessonCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.matches('button, a, .btn')) {
                const lessonLink = card.querySelector('a[href*="/lessons/"]');
                if (lessonLink) {
                    window.location.href = lessonLink.href;
                }
            }
        });
    });
    
    // Practice button handlers
    const practiceButtons = document.querySelectorAll('[onclick*="Practice"]');
    practiceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const practiceType = this.getAttribute('onclick').includes('Pronunciation') ? 'pronunciation' : 'vocabulary';
            startPracticeSession(practiceType);
        });
    });
    
    // Progress tracking
    initializeProgressTracking();
}

// ===== PROGRESS TRACKING =====
function loadUserProgress() {
    const savedProgress = localStorage.getItem('lessonProgress');
    if (savedProgress) {
        try {
            userProgress = JSON.parse(savedProgress);
        } catch (error) {
            console.error('Error loading progress:', error);
            userProgress = {};
        }
    }
}

function saveUserProgress() {
    try {
        localStorage.setItem('lessonProgress', JSON.stringify(userProgress));
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

function updateProgressDisplay() {
    // Update lesson completion status
    Object.keys(userProgress).forEach(lessonId => {
        const lessonCard = document.querySelector(`[data-lesson-id="${lessonId}"]`);
        if (lessonCard && userProgress[lessonId].completed) {
            lessonCard.classList.add('lesson-completed');
            
            // Add completion badge
            let badge = lessonCard.querySelector('.completion-badge');
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'completion-badge';
                badge.innerHTML = '<i data-feather="check-circle"></i>';
                lessonCard.appendChild(badge);
            }
        }
    });
    
    // Update overall progress bars
    updateProgressBars();
    
    // Re-initialize feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

function updateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const level = bar.closest('.level-card')?.querySelector('h5')?.textContent?.toLowerCase();
        if (level) {
            const progress = calculateLevelProgress(level);
            bar.style.width = `${progress}%`;
            
            // Update background color based on progress
            bar.className = `progress-bar ${progress >= 80 ? 'bg-success' : progress >= 40 ? 'bg-warning' : 'bg-info'}`;
        }
    });
}

function calculateLevelProgress(level) {
    const completedLessons = Object.values(userProgress).filter(progress => 
        progress.completed && progress.level === level
    ).length;
    
    // Assume 5 lessons per level for now
    const totalLessons = 5;
    return Math.min((completedLessons / totalLessons) * 100, 100);
}

function initializeProgressTracking() {
    // Mark lesson as completed when "Mark as Complete" is clicked
    const completeBtn = document.getElementById('completeLesson');
    if (completeBtn) {
        completeBtn.addEventListener('click', function() {
            markLessonCompleted();
        });
    }
    
    // Track time spent on lesson
    const startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeSpent = Date.now() - startTime;
        recordTimeSpent(timeSpent);
    });
}

function markLessonCompleted() {
    const lessonId = getCurrentLessonId();
    const lessonLevel = getCurrentLessonLevel();
    
    if (lessonId) {
        if (!userProgress[lessonId]) {
            userProgress[lessonId] = {};
        }
        
        userProgress[lessonId].completed = true;
        userProgress[lessonId].completedAt = new Date().toISOString();
        userProgress[lessonId].level = lessonLevel;
        
        saveUserProgress();
        
        // Update UI
        const completeBtn = document.getElementById('completeLesson');
        if (completeBtn) {
            completeBtn.innerHTML = '<i data-feather="check" class="me-1"></i>Completed!';
            completeBtn.classList.add('disabled');
            completeBtn.disabled = true;
        }
        
        // Show success message
        showToast('Lesson completed! Great job!', 'success');
        
        // Update progress display
        updateProgressDisplay();
        
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
}

function recordTimeSpent(timeSpent) {
    const lessonId = getCurrentLessonId();
    if (lessonId) {
        if (!userProgress[lessonId]) {
            userProgress[lessonId] = {};
        }
        
        if (!userProgress[lessonId].timeSpent) {
            userProgress[lessonId].timeSpent = 0;
        }
        
        userProgress[lessonId].timeSpent += timeSpent;
        saveUserProgress();
    }
}

function getCurrentLessonId() {
    // Extract lesson ID from URL
    const path = window.location.pathname;
    const match = path.match(/\/lessons\/(\d+)/);
    return match ? match[1] : null;
}

function getCurrentLessonLevel() {
    // Get lesson level from page content
    const levelBadge = document.querySelector('.lesson-badge .badge');
    return levelBadge ? levelBadge.textContent.toLowerCase() : 'beginner';
}

// ===== PRACTICE FEATURES =====
function initializePracticeFeatures() {
    // Initialize alphabet practice if present
    if (document.getElementById('alphabetGrid')) {
        initializeAlphabetPractice();
    }
    
    // Initialize conversation practice
    initializeConversationPractice();
    
    // Initialize audio playback
    initializeAudioPlayback();
    
    // Initialize interactive exercises
    initializeInteractiveExercises();
}

function initializeAlphabetPractice() {
    const alphabetLetters = [
        {letter: 'А а', sound: 'a in father', audio: 'ah'},
        {letter: 'Б б', sound: 'b in boy', audio: 'beh'},
        {letter: 'В в', sound: 'v in very', audio: 'veh'},
        {letter: 'Г г', sound: 'h in house', audio: 'heh'},
        {letter: 'Д д', sound: 'd in dog', audio: 'deh'},
        {letter: 'Е е', sound: 'e in bet', audio: 'eh'},
        {letter: 'Є є', sound: 'ye in yes', audio: 'yeh'},
        {letter: 'Ж ж', sound: 's in measure', audio: 'zheh'},
        {letter: 'З з', sound: 'z in zoo', audio: 'zeh'},
        {letter: 'И и', sound: 'i in bit', audio: 'ih'},
        {letter: 'І і', sound: 'ee in see', audio: 'ee'},
        {letter: 'Ї ї', sound: 'yee', audio: 'yee'},
        {letter: 'Й й', sound: 'y in boy', audio: 'yih'},
        {letter: 'К к', sound: 'k in key', audio: 'kah'},
        {letter: 'Л л', sound: 'l in love', audio: 'el'},
        {letter: 'М м', sound: 'm in mother', audio: 'em'},
        {letter: 'Н н', sound: 'n in no', audio: 'en'},
        {letter: 'О о', sound: 'o in not', audio: 'oh'},
        {letter: 'П п', sound: 'p in pen', audio: 'peh'},
        {letter: 'Р р', sound: 'rolled r', audio: 'er'},
        {letter: 'С с', sound: 's in sun', audio: 'es'},
        {letter: 'Т т', sound: 't in top', audio: 'teh'},
        {letter: 'У у', sound: 'oo in moon', audio: 'oo'},
        {letter: 'Ф ф', sound: 'f in fun', audio: 'ef'},
        {letter: 'Х х', sound: 'ch in loch', audio: 'khah'},
        {letter: 'Ц ц', sound: 'ts in cats', audio: 'tseh'},
        {letter: 'Ч ч', sound: 'ch in chair', audio: 'cheh'},
        {letter: 'Ш ш', sound: 'sh in shop', audio: 'shah'},
        {letter: 'Щ щ', sound: 'shch', audio: 'shchah'},
        {letter: 'Ь ь', sound: 'soft sign', audio: 'soft'},
        {letter: 'Ю ю', sound: 'yu in yule', audio: 'yoo'},
        {letter: 'Я я', sound: 'ya in yard', audio: 'yah'}
    ];
    
    const grid = document.getElementById('alphabetGrid');
    if (!grid) return;
    
    // Clear existing content
    grid.innerHTML = '';
    
    alphabetLetters.forEach((item, index) => {
        const letterCard = document.createElement('div');
        letterCard.className = 'letter-practice-card';
        letterCard.innerHTML = `
            <div class="letter">${item.letter}</div>
            <div class="sound">${item.sound}</div>
            <button class="practice-letter-btn" data-letter="${item.letter}" data-audio="${item.audio}">
                <i data-feather="volume-2"></i>
            </button>
        `;
        
        // Add click event for audio
        const button = letterCard.querySelector('.practice-letter-btn');
        button.addEventListener('click', function() {
            playLetterSound(item.letter, item.audio);
        });
        
        grid.appendChild(letterCard);
    });
    
    // Initialize control buttons
    const playAllBtn = document.getElementById('playAllBtn');
    if (playAllBtn) {
        playAllBtn.addEventListener('click', function() {
            playAllLetters(alphabetLetters);
        });
    }
    
    const randomPracticeBtn = document.getElementById('randomPracticeBtn');
    if (randomPracticeBtn) {
        randomPracticeBtn.addEventListener('click', function() {
            startRandomLetterPractice(alphabetLetters);
        });
    }
    
    // Re-initialize feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

function playLetterSound(letter, audioKey) {
    // For now, use text-to-speech to pronounce the letter
    // In a real implementation, you might have audio files
    speakText(letter, 'uk-UA', 0.6);
    
    // Visual feedback
    const button = document.querySelector(`[data-letter="${letter}"]`);
    if (button) {
        button.classList.add('playing');
        setTimeout(() => {
            button.classList.remove('playing');
        }, 1000);
    }
}

function playAllLetters(letters) {
    let index = 0;
    const playNext = () => {
        if (index < letters.length) {
            playLetterSound(letters[index].letter, letters[index].audio);
            index++;
            setTimeout(playNext, 1500); // Wait 1.5 seconds between letters
        }
    };
    playNext();
}

function startRandomLetterPractice(letters) {
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    playLetterSound(randomLetter.letter, randomLetter.audio);
    
    // Show the letter after a delay for practice
    setTimeout(() => {
        showToast(`That was: ${randomLetter.letter} (${randomLetter.sound})`, 'info', 3000);
    }, 2000);
}

function initializeConversationPractice() {
    const startBtn = document.getElementById('startConversationPractice');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            if ('speechRecognition' in window || 'webkitSpeechRecognition' in window) {
                startConversationPracticeSession();
            } else {
                showToast('Speech recognition not supported in this browser. Please try Chrome or Edge.', 'error');
            }
        });
    }
}

function startConversationPracticeSession() {
    const phrases = [
        "Hello, how are you?",
        "I'm fine, thank you",
        "Nice to meet you",
        "Have a good day",
        "Thank you very much",
        "You're welcome"
    ];
    
    let currentPhraseIndex = 0;
    
    function practicePhrase() {
        if (currentPhraseIndex >= phrases.length) {
            showPracticeComplete();
            return;
        }
        
        const phrase = phrases[currentPhraseIndex];
        speakText(`Please repeat: ${phrase}`, 'en-US', 0.8);
        
        setTimeout(() => {
            startListening(phrase, (success) => {
                currentPhraseIndex++;
                setTimeout(practicePhrase, 1000);
            });
        }, 2500);
    }
    
    showToast('Starting conversation practice...', 'info');
    setTimeout(practicePhrase, 1000);
}

function startListening(expectedPhrase, callback) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('Speech recognition not supported', 'error');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onresult = function(event) {
        const spokenText = event.results[0][0].transcript.toLowerCase();
        const expected = expectedPhrase.toLowerCase();
        
        const similarity = calculateSimilarity(spokenText, expected);
        showPracticeFeedback(spokenText, expectedPhrase, similarity);
        
        setTimeout(() => callback(similarity > 0.6), 2000);
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        showToast('Please try again', 'warning');
        setTimeout(() => callback(false), 1000);
    };
    
    recognition.start();
}

function calculateSimilarity(text1, text2) {
    const words1 = text1.split(' ').filter(w => w.length > 2);
    const words2 = text2.split(' ').filter(w => w.length > 2);
    
    let matches = 0;
    words1.forEach(word => {
        if (words2.some(w => w.includes(word) || word.includes(w))) {
            matches++;
        }
    });
    
    return matches / Math.max(words1.length, words2.length, 1);
}

function showPracticeFeedback(spoken, expected, similarity) {
    const modal = document.getElementById('practiceModal');
    const result = document.getElementById('practiceResult');
    
    if (!modal || !result) return;
    
    let feedback = '';
    if (similarity > 0.8) {
        feedback = `
            <div class="alert alert-success text-center">
                <h5><i data-feather="award" class="me-2"></i>Excellent!</h5>
                <p><strong>You said:</strong> "${spoken}"</p>
                <p><strong>Expected:</strong> "${expected}"</p>
                <p>Great pronunciation!</p>
            </div>
        `;
    } else if (similarity > 0.6) {
        feedback = `
            <div class="alert alert-info text-center">
                <h5><i data-feather="thumbs-up" class="me-2"></i>Good job!</h5>
                <p><strong>You said:</strong> "${spoken}"</p>
                <p><strong>Expected:</strong> "${expected}"</p>
                <p>Keep practicing!</p>
            </div>
        `;
    } else {
        feedback = `
            <div class="alert alert-warning text-center">
                <h5><i data-feather="repeat" class="me-2"></i>Try again!</h5>
                <p><strong>You said:</strong> "${spoken}"</p>
                <p><strong>Expected:</strong> "${expected}"</p>
                <p>Don't worry, practice makes perfect!</p>
            </div>
        `;
    }
    
    result.innerHTML = feedback;
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

function showPracticeComplete() {
    const modal = document.getElementById('practiceModal');
    const result = document.getElementById('practiceResult');
    
    if (!modal || !result) return;
    
    result.innerHTML = `
        <div class="alert alert-success text-center">
            <h4><i data-feather="award" class="me-2"></i>Practice Complete!</h4>
            <p>Excellent work! You've completed the conversation practice.</p>
            <p>Your pronunciation is improving!</p>
        </div>
    `;
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // Record practice completion
    recordPracticeSession('conversation');
}

function initializeAudioPlayback() {
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const text = this.getAttribute('data-text');
            if (text) {
                speakText(text, 'en-US', 0.8);
                
                // Visual feedback
                this.classList.add('playing');
                setTimeout(() => {
                    this.classList.remove('playing');
                }, 2000);
            }
        });
    });
}

function initializeInteractiveExercises() {
    // Initialize quiz elements
    const quizButtons = document.querySelectorAll('.quiz-option');
    quizButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleQuizAnswer(this);
        });
    });
    
    // Initialize drag and drop exercises
    initializeDragAndDrop();
    
    // Initialize fill-in-the-blank exercises
    initializeFillInTheBlanks();
}

function handleQuizAnswer(button) {
    const isCorrect = button.getAttribute('data-correct') === 'true';
    const allOptions = button.parentNode.querySelectorAll('.quiz-option');
    
    // Disable all options
    allOptions.forEach(opt => opt.disabled = true);
    
    if (isCorrect) {
        button.classList.add('btn-success');
        showToast('Correct! Well done!', 'success');
    } else {
        button.classList.add('btn-danger');
        // Highlight correct answer
        const correctOption = button.parentNode.querySelector('[data-correct="true"]');
        if (correctOption) {
            correctOption.classList.add('btn-success');
        }
        showToast('Not quite right. Try to remember for next time!', 'warning');
    }
}

function initializeDragAndDrop() {
    // Placeholder for drag and drop functionality
    const dragElements = document.querySelectorAll('.draggable');
    const dropZones = document.querySelectorAll('.drop-zone');
    
    dragElements.forEach(element => {
        element.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.id);
        });
    });
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            const data = e.dataTransfer.getData('text/plain');
            const draggedElement = document.getElementById(data);
            if (draggedElement) {
                this.appendChild(draggedElement);
                checkDropAnswer(this);
            }
        });
    });
}

function checkDropAnswer(dropZone) {
    const expectedAnswer = dropZone.getAttribute('data-answer');
    const droppedElement = dropZone.querySelector('.draggable');
    
    if (droppedElement && droppedElement.getAttribute('data-value') === expectedAnswer) {
        dropZone.classList.add('correct');
        showToast('Correct placement!', 'success');
    } else {
        dropZone.classList.add('incorrect');
        showToast('Try again!', 'warning');
    }
}

function initializeFillInTheBlanks() {
    const blankInputs = document.querySelectorAll('.fill-blank');
    blankInputs.forEach(input => {
        input.addEventListener('blur', function() {
            checkFillInTheBlank(this);
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkFillInTheBlank(this);
            }
        });
    });
}

function checkFillInTheBlank(input) {
    const correctAnswer = input.getAttribute('data-answer').toLowerCase();
    const userAnswer = input.value.toLowerCase().trim();
    
    if (userAnswer === correctAnswer) {
        input.classList.add('correct');
        input.classList.remove('incorrect');
        showToast('Correct!', 'success');
    } else if (userAnswer.length > 0) {
        input.classList.add('incorrect');
        input.classList.remove('correct');
        showToast(`Hint: The answer starts with "${correctAnswer.charAt(0).toUpperCase()}"`, 'info');
    }
}

// ===== PRACTICE SESSIONS =====
function startPracticeSession(type) {
    practiceSession = {
        type: type,
        startTime: Date.now(),
        correct: 0,
        total: 0
    };
    
    const modal = document.getElementById('practiceModal');
    const content = document.getElementById('practiceContent');
    
    if (!modal || !content) return;
    
    if (type === 'pronunciation') {
        startPronunciationPractice();
    } else if (type === 'vocabulary') {
        startVocabularyQuiz();
    }
    
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

function startPronunciationPractice() {
    const content = document.getElementById('practiceContent');
    if (!content) return;
    
    content.innerHTML = `
        <div class="text-center">
            <h5>Pronunciation Practice</h5>
            <p>Listen to the word and repeat it clearly.</p>
            <div id="pronunciationWord" class="mb-4">
                <h3>Ready?</h3>
            </div>
            <button id="startPronunciation" class="btn btn-primary">
                <i data-feather="play" class="me-1"></i>
                Start Practice
            </button>
        </div>
    `;
    
    document.getElementById('startPronunciation').addEventListener('click', function() {
        startConversationPracticeSession();
    });
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

function startVocabularyQuiz() {
    const content = document.getElementById('practiceContent');
    if (!content) return;
    
    const questions = [
        {
            question: "What does 'Дякую' mean?",
            options: ["Hello", "Thank you", "Goodbye", "Please"],
            correct: 1
        },
        {
            question: "How do you say 'Hello' in Ukrainian?",
            options: ["Привіт", "Дякую", "До побачення", "Будь ласка"],
            correct: 0
        },
        {
            question: "What does 'Вибачте' mean?",
            options: ["Thank you", "Hello", "Excuse me", "Goodbye"],
            correct: 2
        }
    ];
    
    let currentQuestion = 0;
    
    function displayQuestion() {
        const q = questions[currentQuestion];
        content.innerHTML = `
            <div class="quiz-container">
                <h5>Question ${currentQuestion + 1} of ${questions.length}</h5>
                <div class="question mb-4">
                    <h4>${q.question}</h4>
                </div>
                <div class="options">
                    ${q.options.map((option, index) => `
                        <button class="btn btn-outline-primary quiz-option mb-2 w-100" data-index="${index}">
                            ${option}
                        </button>
                    `).join('')}
                </div>
                <div class="progress mt-4">
                    <div class="progress-bar" style="width: ${((currentQuestion + 1) / questions.length) * 100}%"></div>
                </div>
            </div>
        `;
        
        // Add event listeners to options
        content.querySelectorAll('.quiz-option').forEach(button => {
            button.addEventListener('click', function() {
                const selectedIndex = parseInt(this.getAttribute('data-index'));
                const isCorrect = selectedIndex === q.correct;
                
                // Update practice session
                practiceSession.total++;
                if (isCorrect) {
                    practiceSession.correct++;
                }
                
                // Provide feedback
                this.classList.remove('btn-outline-primary');
                if (isCorrect) {
                    this.classList.add('btn-success');
                    showToast('Correct!', 'success');
                } else {
                    this.classList.add('btn-danger');
                    // Highlight correct answer
                    const correctButton = content.querySelectorAll('.quiz-option')[q.correct];
                    correctButton.classList.remove('btn-outline-primary');
                    correctButton.classList.add('btn-success');
                    showToast('Not quite right!', 'warning');
                }
                
                // Disable all buttons
                content.querySelectorAll('.quiz-option').forEach(btn => btn.disabled = true);
                
                // Move to next question after delay
                setTimeout(() => {
                    currentQuestion++;
                    if (currentQuestion < questions.length) {
                        displayQuestion();
                    } else {
                        showQuizResults();
                    }
                }, 2000);
            });
        });
    }
    
    function showQuizResults() {
        const score = Math.round((practiceSession.correct / practiceSession.total) * 100);
        content.innerHTML = `
            <div class="text-center">
                <h4>Quiz Complete!</h4>
                <div class="score-display mb-4">
                    <h2 class="text-primary">${score}%</h2>
                    <p>You got ${practiceSession.correct} out of ${practiceSession.total} questions correct!</p>
                </div>
                ${score >= 80 ? 
                    '<div class="alert alert-success">Excellent work! You\'re ready for the next level!</div>' :
                    '<div class="alert alert-info">Keep practicing! You\'re making great progress!</div>'
                }
            </div>
        `;
        
        recordPracticeSession('vocabulary', score);
    }
    
    displayQuestion();
}

function recordPracticeSession(type, score = null) {
    const lessonId = getCurrentLessonId() || 'general';
    
    if (!userProgress[lessonId]) {
        userProgress[lessonId] = {};
    }
    
    if (!userProgress[lessonId].practiceHistory) {
        userProgress[lessonId].practiceHistory = [];
    }
    
    userProgress[lessonId].practiceHistory.push({
        type: type,
        score: score,
        date: new Date().toISOString(),
        duration: practiceSession ? Date.now() - practiceSession.startTime : 0
    });
    
    saveUserProgress();
}

// ===== UTILITY FUNCTIONS =====
function speakText(text, lang = 'en-US', rate = 0.8) {
    if (window.UkrainianApp && window.UkrainianApp.speakText) {
        window.UkrainianApp.speakText(text, lang, rate);
    } else if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate;
        speechSynthesis.speak(utterance);
    }
}

function showToast(message, type = 'info', duration = 3000) {
    if (window.UkrainianApp && window.UkrainianApp.showToast) {
        window.UkrainianApp.showToast(message, type, duration);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// ===== CSS ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    .lesson-completed {
        border: 2px solid #28a745;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
    }
    
    .completion-badge {
        position: absolute;
        top: -10px;
        right: -10px;
        background: #28a745;
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }
    
    .playing {
        background-color: #007bff !important;
        transform: scale(1.1);
        transition: all 0.3s ease;
    }
    
    .quiz-option.correct {
        background-color: #28a745 !important;
        border-color: #28a745 !important;
        color: white !important;
    }
    
    .quiz-option.incorrect {
        background-color: #dc3545 !important;
        border-color: #dc3545 !important;
        color: white !important;
    }
    
    .fill-blank.correct {
        border-color: #28a745 !important;
        background-color: rgba(40, 167, 69, 0.1);
    }
    
    .fill-blank.incorrect {
        border-color: #dc3545 !important;
        background-color: rgba(220, 53, 69, 0.1);
    }
    
    .drop-zone.correct {
        background-color: rgba(40, 167, 69, 0.2);
        border: 2px solid #28a745;
    }
    
    .drop-zone.incorrect {
        background-color: rgba(220, 53, 69, 0.2);
        border: 2px solid #dc3545;
    }
`;
document.head.appendChild(style);

// ===== EXPORT FOR GLOBAL ACCESS =====
window.LessonsApp = {
    startPronunciationPractice,
    startVocabularyQuiz,
    markLessonCompleted,
    recordPracticeSession
};
