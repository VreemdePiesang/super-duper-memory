document.addEventListener('DOMContentLoaded', function() {
    // Get all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.querySelector('.progress-container');
    const completedCount = document.getElementById('completed-count');
    const statusMessage = document.getElementById('status-message');
    const resetBtn = document.getElementById('reset-btn');

    // Total number of checks
    const totalChecks = checkboxes.length;

    // LocalStorage key
    const STORAGE_KEY = 'webdev-qc-checklist-state';

    // Load saved state from localStorage
    function loadState() {
        try {
            const savedState = localStorage.getItem(STORAGE_KEY);
            if (savedState) {
                const state = JSON.parse(savedState);
                checkboxes.forEach(checkbox => {
                    if (state[checkbox.id] !== undefined) {
                        checkbox.checked = state[checkbox.id];
                    }
                });
            }
        } catch (error) {
            console.error('Error loading saved state:', error);
        }
    }

    // Save current state to localStorage
    function saveState() {
        try {
            const state = {};
            checkboxes.forEach(checkbox => {
                state[checkbox.id] = checkbox.checked;
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error('Error saving state:', error);
        }
    }

    // Update progress when a checkbox is clicked
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateProgress();
            saveState();
        });
    });

    // Reset button functionality
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all checkboxes? This will clear your progress.')) {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            updateProgress();
            saveState();
        }
    });

    // Keyboard shortcut: Ctrl/Cmd + Shift + R to reset
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            resetBtn.click();
        }
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

        // Update ARIA attributes for progress bar
        progressContainer.setAttribute('aria-valuenow', Math.round(percentage));

        // Update text
        completedCount.textContent = `${completed}/${totalChecks} checks completed`;

        // Update status message with more detailed feedback
        if (completed === 0) {
            statusMessage.textContent = 'Complete the checklist to see your status.';
            statusMessage.style.color = '#333';
        } else if (completed < totalChecks / 3) {
            statusMessage.textContent = `You're getting started! ${totalChecks - completed} checks remaining.`;
            statusMessage.style.color = '#e74c3c';
        } else if (completed < totalChecks * 2 / 3) {
            statusMessage.textContent = `Making good progress! ${totalChecks - completed} checks to go.`;
            statusMessage.style.color = '#f39c12';
        } else if (completed < totalChecks) {
            statusMessage.textContent = `Almost there! Just ${totalChecks - completed} more check${totalChecks - completed === 1 ? '' : 's'}!`;
            statusMessage.style.color = '#3498db';
        } else {
            statusMessage.textContent = '🎉 Great job! Your code meets all quality checks.';
            statusMessage.style.color = '#2ecc71';
            // Add a subtle celebration effect
            progressBar.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                progressBar.style.animation = '';
            }, 500);
        }
    }

    // Load saved state on page load
    loadState();

    // Initialize progress
    updateProgress();

    // Add section progress tracking
    addSectionProgress();
});

// Add individual section progress indicators
function addSectionProgress() {
    const sections = [
        { id: 'html-checklist', heading: 'html-checks-heading' },
        { id: 'css-checklist', heading: 'css-checks-heading' },
        { id: 'general-checklist', heading: 'general-checks-heading' }
    ];

    sections.forEach(section => {
        const list = document.getElementById(section.id);
        const heading = document.getElementById(section.heading);

        if (list && heading) {
            const checkboxes = list.querySelectorAll('input[type="checkbox"]');
            const sectionTotal = checkboxes.length;

            // Create progress indicator
            const progressIndicator = document.createElement('span');
            progressIndicator.className = 'section-progress';
            progressIndicator.style.cssText = 'margin-left: 10px; font-size: 0.9em; color: #666; font-weight: normal;';

            // Function to update section progress
            const updateSectionProgress = () => {
                let sectionCompleted = 0;
                checkboxes.forEach(cb => {
                    if (cb.checked) sectionCompleted++;
                });
                progressIndicator.textContent = `(${sectionCompleted}/${sectionTotal})`;

                // Color code based on completion
                if (sectionCompleted === 0) {
                    progressIndicator.style.color = '#999';
                } else if (sectionCompleted === sectionTotal) {
                    progressIndicator.style.color = '#2ecc71';
                } else {
                    progressIndicator.style.color = '#3498db';
                }
            };

            // Add event listeners
            checkboxes.forEach(cb => {
                cb.addEventListener('change', updateSectionProgress);
            });

            // Add to heading
            heading.appendChild(progressIndicator);

            // Initialize
            updateSectionProgress();
        }
    });
}
