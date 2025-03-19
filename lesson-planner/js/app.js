// Initialize the application
function initApp() {
    console.log('Initializing app...');
    
    // Ensure appState is available
    if (!window.appState) {
        console.error('appState is not defined');
        window.appState = {
            currentMainStep: 1,
            currentSubStep: 'A',
            mainStepExpanded: [true, false, false, false],
            lessonInfo: {}
        };
    }
    
    setupEventListeners();
    updateStepIndicators();
    setupResponseTabs();
    updateButtonStates();
    
    // Initialize scroll indicators for substep navigation
    checkSubstepNavScroll();
    
    console.log('App initialization complete');
}

// Set up all event listeners
function setupEventListeners() {
	// Ensure all main step headers have click handlers
	document.querySelectorAll('.main-step-header').forEach((header, index) => {
		const stepNumber = index + 1;
		header.removeEventListener('click', () => toggleMainStep(stepNumber));
		header.addEventListener('click', () => toggleMainStep(stepNumber));
	});

	// Ensure all substep tabs have click handlers
	document.querySelectorAll('.substep-tab').forEach(tab => {
		const stepNumber = parseInt(tab.getAttribute('data-step'));
		const substepLetter = tab.getAttribute('data-substep');
		tab.removeEventListener('click', () => switchSubstep(stepNumber, substepLetter));
		tab.addEventListener('click', () => switchSubstep(stepNumber, substepLetter));
	});
	
    // Form elements for Step 1A
    document.getElementById('provider').addEventListener('change', handleProviderChange);
    document.getElementById('course').addEventListener('change', handleFormInputChange);
    document.getElementById('level').addEventListener('change', handleFormInputChange);
    document.getElementById('ability').addEventListener('change', handleFormInputChange);
    document.getElementById('subject').addEventListener('change', handleFormInputChange);
    document.getElementById('topic').addEventListener('input', handleFormInputChange);
    document.getElementById('lessonNumber').addEventListener('input', handleFormInputChange);
    document.getElementById('lessonTitle').addEventListener('input', handleFormInputChange);
    document.getElementById('description').addEventListener('input', handleFormInputChange);
    
    // Practical component checkboxes
    document.getElementById('lo1HasPractical').addEventListener('change', handlePracticalChange);
    document.getElementById('lo2HasPractical').addEventListener('change', handlePracticalChange);
    document.getElementById('lo3HasPractical').addEventListener('change', handlePracticalChange);
    
    // Step 1A: Overview
    document.getElementById('generateOverviewPromptBtn').addEventListener('click', generateOverviewPrompt);
    document.getElementById('copyOverviewPromptBtn').addEventListener('click', () => copyToClipboard('overviewPromptTextarea'));
    document.getElementById('overviewResponseTextarea').addEventListener('input', handleOverviewResponse);
    document.getElementById('previewOverviewResponseBtn').addEventListener('click', previewOverviewResponse);
    document.getElementById('continueToLOTypesBtn').addEventListener('click', () => switchSubstep(1, 'B'));
    
    // Step 1B: LO Types
    document.getElementById('generateLOTypesPromptBtn').addEventListener('click', generateLOTypesPrompt);
    document.getElementById('copyLOTypesPromptBtn').addEventListener('click', () => copyToClipboard('loTypesPromptTextarea'));
    document.getElementById('loTypesResponseTextarea').addEventListener('input', handleLOTypesResponse);
    document.getElementById('previewLOTypesResponseBtn').addEventListener('click', previewLOTypesResponse);
    document.getElementById('continueToMisconceptionsBtn').addEventListener('click', () => switchSubstep(1, 'C'));
    
    // Edit LO Type buttons
    document.getElementById('editLO1TypeBtn').addEventListener('click', () => openLoTypeEditModal(1));
    document.getElementById('editLO2TypeBtn').addEventListener('click', () => openLoTypeEditModal(2));
    document.getElementById('editLO3TypeBtn').addEventListener('click', () => openLoTypeEditModal(3));
    document.getElementById('editAoCategory').addEventListener('change', updateSpecificTypeOptions);
    document.getElementById('saveLoTypeBtn').addEventListener('click', saveLoTypeChanges);
    
    // Step 1C: Misconceptions
    document.getElementById('generateMisconceptionsPromptBtn').addEventListener('click', generateMisconceptionsPrompt);
    document.getElementById('copyMisconceptionsPromptBtn').addEventListener('click', () => copyToClipboard('misconceptionsPromptTextarea'));
    document.getElementById('misconceptionsResponseTextarea').addEventListener('input', handleMisconceptionsResponse);
    document.getElementById('previewMisconceptionsResponseBtn').addEventListener('click', previewMisconceptionsResponse);
    document.getElementById('continueToPriorKnowledgeBtn').addEventListener('click', () => switchSubstep(1, 'D'));
    
    // Edit Misconceptions buttons
    document.getElementById('editLO1MisconceptionsBtn').addEventListener('click', () => openMisconceptionsEditModal(1));
    document.getElementById('editLO2MisconceptionsBtn').addEventListener('click', () => openMisconceptionsEditModal(2));
    document.getElementById('editLO3MisconceptionsBtn').addEventListener('click', () => openMisconceptionsEditModal(3));
    document.getElementById('addMisconceptionBtn').addEventListener('click', addNewMisconception);
    document.getElementById('saveMisconceptionsBtn').addEventListener('click', saveMisconceptionsChanges);
    
    // Step 1D: Prior Knowledge
    document.getElementById('generatePriorKnowledgePromptBtn').addEventListener('click', generatePriorKnowledgePrompt);
    document.getElementById('copyPriorKnowledgePromptBtn').addEventListener('click', () => copyToClipboard('priorKnowledgePromptTextarea'));
    document.getElementById('priorKnowledgeResponseTextarea').addEventListener('input', handlePriorKnowledgeResponse);
    document.getElementById('previewPriorKnowledgeResponseBtn').addEventListener('click', previewPriorKnowledgeResponse);
    document.getElementById('continueToReviewBtn').addEventListener('click', () => switchSubstep(1, 'E'));
    
    // Edit Prior Knowledge buttons
    document.getElementById('editLO1PriorKnowledgeBtn').addEventListener('click', () => openPriorKnowledgeEditModal(1));
    document.getElementById('editLO2PriorKnowledgeBtn').addEventListener('click', () => openPriorKnowledgeEditModal(2));
    document.getElementById('editLO3PriorKnowledgeBtn').addEventListener('click', () => openPriorKnowledgeEditModal(3));
    document.getElementById('addPriorKnowledgeBtn').addEventListener('click', addNewPriorKnowledgeItem);
    document.getElementById('savePriorKnowledgeBtn').addEventListener('click', savePriorKnowledgeChanges);
    
    // Step 1E: Review & Edit
    document.getElementById('finishStep1Btn').addEventListener('click', finishStep1);
    
    // Step 2 Event Listeners
    // Framework edit modal
    document.getElementById('editBltUsed').addEventListener('change', toggleBltLevelsVisibility);
    document.getElementById('saveFrameworkBtn').addEventListener('click', saveFrameworkChanges);
    
    // Exam Technique edit modal
    document.getElementById('saveExamTechniqueBtn').addEventListener('click', saveExamTechniqueChanges);
    
    // Practical Requirements edit modal
    document.getElementById('addVariableBtn').addEventListener('click', addNewVariable);
    document.getElementById('addEquipmentBtn').addEventListener('click', addNewEquipment);
    document.getElementById('addStepBtn').addEventListener('click', addNewStep);
    document.getElementById('savePracticalBtn').addEventListener('click', savePracticalChanges);
    
    // Frayer Model edit modal
    document.getElementById('addExampleBtn').addEventListener('click', addNewExample);
    document.getElementById('addNonExampleBtn').addEventListener('click', addNewNonExample);
    document.getElementById('saveFrayerModelBtn').addEventListener('click', saveFrayerModelChanges);
    
	// Step 3 buttons
    document.getElementById('continueToTeachingInputBtn').addEventListener('click', () => {
        switchSubstep(3, 'B');
    });
    
    document.getElementById('continueToFormativeAssessmentBtn').addEventListener('click', () => {
        switchSubstep(3, 'C');
    });
    
    document.getElementById('continueToSlideReviewBtn').addEventListener('click', () => {
        switchSubstep(3, 'D');
    });
	
    // Check for scroll on resize
    window.addEventListener('resize', checkSubstepNavScroll);
}

// Handle form input change
function handleFormInputChange(e) {
    const { id, value } = e.target;
    appState.lessonInfo[id] = value;
}

// Handle provider change
function handleProviderChange(e) {
    console.log('Provider changed:', e.target.value);
    const provider = e.target.value;
    const courseSelect = document.getElementById('course');
    
    if (!courseSelect) {
        console.error('Could not find course select element');
        return;
    }
    
    // Save to state
    appState.lessonInfo.provider = provider;
    
    // Clear current options
    courseSelect.innerHTML = '<option value="">Select Course</option>';
    
    if (provider && courseOptions[provider]) {
        // Add new options
        courseOptions[provider].forEach(course => {
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
}

// Handle practical component checkbox changes
function handlePracticalChange(e) {
    const id = e.target.id;
    const isChecked = e.target.checked;
    
    if (id === 'lo1HasPractical') {
        appState.learningObjectives.lo1.hasPractical = isChecked;
        updateBadge('lo1Badge', isChecked);
    } else if (id === 'lo2HasPractical') {
        appState.learningObjectives.lo2.hasPractical = isChecked;
        updateBadge('lo2Badge', isChecked);
    } else if (id === 'lo3HasPractical') {
        appState.learningObjectives.lo3.hasPractical = isChecked;
        updateBadge('lo3Badge', isChecked);
    }
}

// Setup response tabs
function setupResponseTabs() {
    document.querySelectorAll('.response-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabContainer = this.closest('.response-tabs');
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs in this container
            tabContainer.querySelectorAll('.response-tab').forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Find the content container
            const contentContainer = tabContainer.nextElementSibling;
            
            // Hide all content in this container
            contentContainer.querySelectorAll('.response-content').forEach(c => c.classList.remove('active'));
            
            // Show the selected content
            contentContainer.querySelector(`#${tabName}Response`).classList.add('active');
        });
    });
}

// Update button states based on input
function updateButtonStates() {
    // Step 1A: Overview
    document.getElementById('continueToLOTypesBtn').disabled = !appState.responses.overview;
    
    // Step 1B: LO Types
    document.getElementById('continueToMisconceptionsBtn').disabled = !appState.responses.loTypes;
    
    // Step 1C: Misconceptions
    document.getElementById('continueToPriorKnowledgeBtn').disabled = !appState.responses.misconceptions;
    
    // Step 1D: Prior Knowledge
    document.getElementById('continueToReviewBtn').disabled = !appState.responses.priorKnowledge;
    
    // Step 1E: Review completion
    const allComplete = appState.responses.overview && 
                        appState.responses.loTypes && 
                        appState.responses.misconceptions && 
                        appState.responses.priorKnowledge;
    document.getElementById('finishStep1Btn').disabled = !allComplete;
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded - initializing app');
    window.initApp();
});

// Initialize the application
window.initApp = function() {
    console.log('Initializing app...');
    
    // Ensure appState is available
    if (!window.appState) {
        console.error('appState is not defined');
        window.appState = {
            currentMainStep: 1,
            currentSubStep: 'A',
            mainStepExpanded: [true, false, false, false],
            lessonInfo: {}
        };
    }
    
    setupEventListeners();
    updateStepIndicators();
    setupResponseTabs();
    updateButtonStates();
    
    // Initialize scroll indicators for substep navigation
    checkSubstepNavScroll();
    
    console.log('App initialization complete');
	
window.toggleMainStep = function(stepNumber) {
    try {
        console.log('Toggling main step', stepNumber);
        const mainStep = document.getElementById(`mainStep${stepNumber}`);
        const mainStepContent = document.getElementById(`mainStepContent${stepNumber}`);
        
        if (!mainStep || !mainStepContent) {
            console.error(`Could not find main step ${stepNumber} elements`);
            return;
        }
        
        // Rest of function remains the same
    } catch (error) {
        console.error('Error in toggleMainStep:', error);
    }
};

};document.addEventListener('DOMContentLoaded', initApp);