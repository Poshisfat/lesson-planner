// Fix script for GCSE Science Lesson Planner
(function() {
    // Wait for DOM content to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Fix script loaded');
        
        // Define course options globally to ensure they're accessible
        window.courseOptions = {
            'AQA': ['Combined Science: Trilogy', 'Combined Science: Synergy', 'Biology', 'Chemistry', 'Physics'],
            'Edexcel': ['Combined Science', 'Biology A', 'Biology B', 'Chemistry A', 'Chemistry B', 'Physics A', 'Physics B'],
            'OCR': ['Combined Science A: Gateway', 'Combined Science B: Twenty First Century', 'Biology A', 'Biology B', 'Chemistry A', 'Chemistry B', 'Physics A', 'Physics B'],
            'WJEC': ['Combined Science', 'Biology', 'Chemistry', 'Physics'],
            'CCEA': ['Single Award Science', 'Double Award Science', 'Biology', 'Chemistry', 'Physics']
        };
        
        // Fix for main step toggling
        window.toggleMainStep = function(stepNumber) {
            console.log('Toggling main step', stepNumber);
            const mainStep = document.getElementById(`mainStep${stepNumber}`);
            const mainStepContent = document.getElementById(`mainStepContent${stepNumber}`);
            
            if (!mainStep || !mainStepContent) {
                console.error(`Could not find main step ${stepNumber} elements`);
                return;
            }
            
            if (mainStep.classList.contains('expanded')) {
                mainStep.classList.remove('expanded');
                mainStepContent.style.height = '0';
                if (window.appState) {
                    window.appState.mainStepExpanded[stepNumber - 1] = false;
                }
            } else {
                mainStep.classList.add('expanded');
                mainStepContent.style.height = 'auto';
                if (window.appState) {
                    window.appState.mainStepExpanded[stepNumber - 1] = true;
                }
            }
        };
        
        // Fix for substep switching
        window.switchSubstep = function(mainStep, subStep) {
            console.log('Switching to substep', mainStep, subStep);
            
            // Update state
            if (window.appState) {
                window.appState.currentMainStep = mainStep;
                window.appState.currentSubStep = subStep;
            }
            
            // Ensure main step is expanded
            const mainStepElement = document.getElementById(`mainStep${mainStep}`);
            const mainStepContent = document.getElementById(`mainStepContent${mainStep}`);
            
            if (!mainStepElement || !mainStepContent) {
                console.error(`Could not find main step ${mainStep} elements`);
                return;
            }
            
            if (!mainStepElement.classList.contains('expanded')) {
                mainStepElement.classList.add('expanded');
                mainStepContent.style.height = 'auto';
                if (window.appState) {
                    window.appState.mainStepExpanded[mainStep - 1] = true;
                }
            }
            
            // Update substep tabs
            document.querySelectorAll('.substep-tab').forEach(tab => {
                if (tab.getAttribute('data-step') == mainStep && tab.getAttribute('data-substep') == subStep) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
            
            // Update substep content
            document.querySelectorAll('.substep-content').forEach(content => {
                if (content.getAttribute('data-step') == mainStep && content.getAttribute('data-substep') == subStep) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
            
            // Scroll to top of the main step
            mainStepElement.scrollIntoView({ behavior: 'smooth' });
        };
        
        // Fix for course selection
        window.handleProviderChange = function(e) {
            console.log('Provider changed:', e.target.value);
            const provider = e.target.value;
            const courseSelect = document.getElementById('course');
            
            if (!courseSelect) {
                console.error('Could not find course select element');
                return;
            }
            
            // Save to state
            if (window.appState && window.appState.lessonInfo) {
                window.appState.lessonInfo.provider = provider;
            }
            
            // Clear current options
            courseSelect.innerHTML = '<option value="">Select Course</option>';
            
            if (provider && window.courseOptions[provider]) {
                // Add new options
                window.courseOptions[provider].forEach(course => {
                    const option = document.createElement('option');
                    option.value = course;
                    option.textContent = course;
                    courseSelect.appendChild(option);
                });
                
                // Enable the select
                courseSelect.disabled = false;
            } else {
                // Disable the select if no provider is selected
                courseSelect.disabled = true;
            }
        };
        
        // Re-attach event listener for provider change
        const providerSelect = document.getElementById('provider');
        if (providerSelect) {
            // Replace any existing onchange handler
            providerSelect.onchange = window.handleProviderChange;
        }
        
        // Check for scroll on substep navigation
        window.checkSubstepNavScroll = function() {
            document.querySelectorAll('.substeps-nav').forEach(nav => {
                const hasScrollbar = nav.scrollWidth > nav.clientWidth;
                
                // Get scroll indicators
                const leftIndicator = nav.querySelector('.nav-scroll-left');
                const rightIndicator = nav.querySelector('.nav-scroll-right');
                
                // Show/hide indicators based on scrollbar
                if (hasScrollbar) {
                    if (leftIndicator) leftIndicator.style.display = 'flex';
                    if (rightIndicator) rightIndicator.style.display = 'flex';
                } else {
                    if (leftIndicator) leftIndicator.style.display = 'none';
                    if (rightIndicator) rightIndicator.style.display = 'none';
                }
            });
        };
        
        // Run initialization
        window.checkSubstepNavScroll();
        
        console.log('Fix script completed');
    });
})();