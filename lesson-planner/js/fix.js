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
        
		// Fix for summary display functions
		// Wait until all scripts have fully loaded
		setTimeout(function() {
			console.log("Adding summary function enhancements");
			
			// Make sure summary functions are globally available
			if (typeof displayLOTypesSubstepSummary === 'function') {
				window.displayLOTypesSubstepSummary = displayLOTypesSubstepSummary;
			}
			if (typeof displayMisconceptionsSubstepSummary === 'function') {
				window.displayMisconceptionsSubstepSummary = displayMisconceptionsSubstepSummary;
			}
			if (typeof displayPriorKnowledgeSubstepSummary === 'function') {
				window.displayPriorKnowledgeSubstepSummary = displayPriorKnowledgeSubstepSummary;
			}
			if (typeof updateStep1Review === 'function') {
				window.updateStep1Review = updateStep1Review;
			}
			
			// Enhanced switchSubstep function to ensure summaries are updated
			const originalSwitchSubstep = window.switchSubstep;
			window.switchSubstep = function(mainStep, subStep) {
				console.log("Enhanced switchSubstep:", mainStep, subStep);
				
				// Call the original function
				if (originalSwitchSubstep) {
					originalSwitchSubstep(mainStep, subStep);
				}
				
				// Add our additional logic to update summaries
				setTimeout(function() {
					if (mainStep === 1) {
						if (subStep === 'B' && window.displayLOTypesSubstepSummary) {
							console.log("Calling displayLOTypesSubstepSummary");
							window.displayLOTypesSubstepSummary();
						} else if (subStep === 'C' && window.displayMisconceptionsSubstepSummary) {
							console.log("Calling displayMisconceptionsSubstepSummary");
							window.displayMisconceptionsSubstepSummary();
						} else if (subStep === 'D' && window.displayPriorKnowledgeSubstepSummary) {
							console.log("Calling displayPriorKnowledgeSubstepSummary");
							window.displayPriorKnowledgeSubstepSummary();
						} else if (subStep === 'E' && window.updateStep1Review) {
							console.log("Calling updateStep1Review");
							window.updateStep1Review();
						}
					}
				}, 300); // Small delay to ensure DOM is updated
			};
			
			// Reattach event listeners for substep tabs with the enhanced functionality
			document.querySelectorAll('.substep-tab').forEach(tab => {
				const stepNumber = parseInt(tab.getAttribute('data-step'));
				const substepLetter = tab.getAttribute('data-substep');
				
				// Remove existing click handlers
				tab.removeEventListener('click', function() {
					window.switchSubstep(stepNumber, substepLetter);
				});
				
				// Add new click handler
				tab.addEventListener('click', function() {
					window.switchSubstep(stepNumber, substepLetter);
				});
			});
			
			console.log("Summary function enhancements completed");
		}, 1000); // Wait for 1 second to ensure everything is loaded
		
        console.log('Fix script completed');
    });
})();