document.addEventListener('DOMContentLoaded', function() {
    // Get all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const progressBar = document.getElementById('progress-bar');
    const completedCount = document.getElementById('completed-count');
    const statusMessage = document.getElementById('status-message');
    const resetBtn = document.getElementById('reset-btn');
    
    // Total number of checks
    const totalChecks = checkboxes.length;
    
    // Update progress when a checkbox is clicked
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateProgress);
    });
    
    // Reset button functionality
    resetBtn.addEventListener('click', function() {
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        updateProgress();
    });
    
    function updateProgress() {
        // Count completed checks
        let completed = 0;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                completed++;
            }
        });
        
        // Update progress bar
        const percentage = (completed / totalChecks) * 100;
        progressBar.style.width = percentage + '%';
        
        // Update text
        completedCount.textContent = `${completed}/${totalChecks} checks completed`;
        
        // Update status message
        if (completed === 0) {
            statusMessage.textContent = 'Complete the checklist to see your status.';
            statusMessage.style.color = '#333';
        } else if (completed < totalChecks / 3) {
            statusMessage.textContent = 'You\'re getting started! Keep going.';
            statusMessage.style.color = '#e74c3c';
        } else if (completed < totalChecks * 2 / 3) {
            statusMessage.textContent = 'Making good progress!';
            statusMessage.style.color = '#f39c12';
        } else if (completed < totalChecks) {
            statusMessage.textContent = 'Almost there!';
            statusMessage.style.color = '#3498db';
        } else {
            statusMessage.textContent = 'Great job! Your code meets all quality checks.';
            statusMessage.style.color = '#2ecc71';
        }
    }
    
    // Initialize progress
    updateProgress();
});
