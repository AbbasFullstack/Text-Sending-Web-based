document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const sendBtn = document.getElementById('sendBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const status = document.getElementById('status');
    const shareSection = document.getElementById('shareSection');
    const shareLink = document.getElementById('shareLink');
    const copyLinkBtn = document.getElementById('copyLinkBtn');

    // Check URL hash on page load
    const urlHash = window.location.hash.substring(1);
    if (urlHash) {
        try {
            const decodedText = decodeURIComponent(urlHash);
            textInput.value = decodedText;
            showStatus('Text loaded from link!', 'success');
        } catch (e) {
            console.error('Error decoding text:', e);
        }
    }

    // Send text - updates URL hash
    sendBtn.addEventListener('click', function() {
        const text = textInput.value.trim();
        
        if (!text) {
            showStatus('Please enter some text first!', 'error');
            return;
        }

        // Encode text for URL
        const encodedText = encodeURIComponent(text);
        const newUrl = window.location.origin + window.location.pathname + '#' + encodedText;
        
        // Update URL without reloading
        window.history.pushState({}, '', newUrl);
        
        // Show share section
        shareLink.value = newUrl;
        shareSection.style.display = 'block';
        
        showStatus('Text ready to share! Copy the link above.', 'success');
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
    clearBtn.addEventListener('click', function() {
        textInput.value = '';
        shareSection.style.display = 'none';
        window.history.pushState({}, '', window.location.pathname);
        showStatus('Text cleared!', 'info');
    });

    // Copy link to clipboard
    copyLinkBtn.addEventListener('click', function() {
        const link = shareLink.value;
        
        if (!link) {
            showStatus('No link to copy!', 'error');
            return;
        }

        navigator.clipboard.writeText(link).then(function() {
            showStatus('Link copied to clipboard!', 'success');
        }).catch(function(err) {
            showStatus('Failed to copy link: ' + err, 'error');
        });
    });

    // Show status message
    function showStatus(message, type) {
        status.textContent = message;
        status.className = 'status ' + type;
        
        // Hide after 5 seconds
        setTimeout(function() {
            status.textContent = '';
            status.className = 'status';
        }, 5000);
    }

    // Auto-select text when focused
    textInput.addEventListener('focus', function() {
        this.select();
    });
});
