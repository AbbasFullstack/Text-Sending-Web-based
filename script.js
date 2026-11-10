// Global variable to store the interval for auto-refresh
let autoRefreshInterval;

document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const sendBtn = document.getElementById('sendBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const status = document.getElementById('status');
    const timerDisplay = document.getElementById('timer');
    const shareSection = document.getElementById('shareSection');
    
    // Check for stored text on page load
    fetchStoredText();
    
    // Auto-refresh every 5 seconds
    startAutoRefresh();

    // Send text to server
    sendBtn.addEventListener('click', async function() {
        const text = textInput.value.trim();
        
        if (!text) {
            showStatus('Please enter some text first!', 'error');
            return;
        }

        try {
            const response = await fetch('/api/set-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showStatus('Text saved! It will be available for 30 minutes.', 'success');
                startTimer(1800); // 30 minutes = 1800 seconds
            } else {
                showStatus(data.error || 'Failed to save text!', 'error');
            }
        } catch (error) {
            showStatus('Error saving text: ' + error.message, 'error');
        }
    });

    // Copy text to clipboard
    copyBtn.addEventListener('click', function() {
        const text = textInput.value.trim();
        
        if (!text) {
            showStatus('No text to copy!', 'error');
            return;
        }

        navigator.clipboard.writeText(text).then(function() {
            showStatus('Text copied to clipboard!', 'success');
        }).catch(function(err) {
            showStatus('Failed to copy text: ' + err, 'error');
        });
    });

    // Clear text
    clearBtn.addEventListener('click', async function() {
        try {
            const response = await fetch('/api/clear-text', {
                method: 'POST'
            });
            
            const data = await response.json();
            
            if (data.success) {
                textInput.value = '';
                stopTimer();
                showStatus('Text cleared!', 'info');
            } else {
                showStatus(data.error || 'Failed to clear text!', 'error');
            }
        } catch (error) {
            textInput.value = '';
            stopTimer();
            showStatus('Text cleared locally!', 'info');
        }
    });

    // Manual refresh
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            fetchStoredText();
        });
    }

    // Fetch stored text from server
    async function fetchStoredText() {
        try {
            const response = await fetch('/api/get-text');
            const data = await response.json();
            
            if (data.text && data.timestamp) {
                textInput.value = data.text;
                
                // Calculate remaining time
                const expiresIn = data.expiresIn || 0;
                if (expiresIn > 0) {
                    startTimer(expiresIn);
                } else {
                    stopTimer();
                }
                
                showStatus('Loaded saved text!', 'success');
            } else {
                // No text stored or expired
                if (!textInput.value) {
                    showStatus('No text stored. Enter text and click Send.', 'info');
                }
                stopTimer();
            }
        } catch (error) {
            console.error('Error fetching text:', error);
            showStatus('Could not connect to server. Using local storage.', 'error');
        }
    }

    // Auto-refresh every 5 seconds
    function startAutoRefresh() {
        stopAutoRefresh();
        autoRefreshInterval = setInterval(fetchStoredText, 5000);
    }

    function stopAutoRefresh() {
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
        }
    }

    // Timer functions
    let timerInterval;
    let timeLeft = 0;

    function startTimer(seconds) {
        stopTimer();
        timeLeft = seconds;
        updateTimerDisplay();
        
        timerInterval = setInterval(function() {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                stopTimer();
                showStatus('Text has expired!', 'error');
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        if (timerDisplay) {
            timerDisplay.textContent = '00:00';
        }
    }

    function updateTimerDisplay() {
        if (!timerDisplay) return;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Show status message
    function showStatus(message, type) {
        status.textContent = message;
        status.className = 'status ' + type;
        
        // Hide after 5 seconds
        setTimeout(function() {
            if (!status.textContent.includes('Loaded') && !status.textContent.includes('available')) {
                status.textContent = '';
                status.className = 'status';
            }
        }, 5000);
    }

    // Auto-select text when focused
    textInput.addEventListener('focus', function() {
        this.select();
    });

    // Prevent form submission on Enter key
    textInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });
});
