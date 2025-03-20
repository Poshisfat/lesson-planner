// Global state initialization
window.appState = {
    currentMainStep: 1,
    currentSubStep: 'A',
    mainStepExpanded: [true, false, false, false],
    lessonInfo: {},
    responses: {
        overview: '',
        loTypes: '',
        misconceptions: '',
        priorKnowledge: '',
        frameworks: '',
        examTechniques: '',
        lessonStructure: '',
        practicalRequirements: '',
        frayerModels: '',
        retrieval: '',
        teachingInput: '',
        formative: '',
        referenceMaterials: '',
        retrievalWorksheet: '',
        scaleQuestions: '',
        applicationQuestions: '',
        examTechniqueQuestions: '',
        examStyleQuestions: '',
        worksheetFinalization: ''
    },
    learningObjectives: {
        lo1: { title: '', description: '', hasPractical: false },
        lo2: { title: '', description: '', hasPractical: false },
        lo3: { title: '', description: '', hasPractical: false, exists: false },
        count: 0
    },
    responseTags: {}
};

// Initialize the application
function initApp() {
    // Ensure appState is defined globally
    if (typeof window.appState === 'undefined') {
        console.log('Initializing appState in global scope');
        window.appState = {
            currentMainStep: 1,
            currentSubStep: 'A',
            mainStepExpanded: [true, false, false, false],
            lessonInfo: {},
            responses: {
                overview: '',
                loTypes: '',
                misconceptions: '',
                priorKnowledge: '',
                frameworks: '',
                examTechniques: '',
                lessonStructure: '',
                practicalRequirements: '',
                frayerModels: '',
                retrieval: '',
                teachingInput: '',
                formative: ''
            },
            learningObjectives: {
                lo1: { title: '', description: '', hasPractical: false },
                lo2: { title: '', description: '', hasPractical: false },
                lo3: { title: '', description: '', hasPractical: false, exists: false },
                count: 0
            },
            loTypes: {
                lo1: { aoCategory: '', specificType: '', justification: '' },
                lo2: { aoCategory: '', specificType: '', justification: '' },
                lo3: { aoCategory: '', specificType: '', justification: '' }
            },
            misconceptions: {
                lo1: [],
                lo2: [],
                lo3: []
            },
            priorKnowledge: {
                lo1: [],
                lo2: [],
                lo3: []
            },
            editState: {
                currentLO: 1,
                tempMisconceptions: [],
                tempPriorKnowledge: []
            },
            responseTags: {}
        };
    } else {
        // Ensure critical nested objects exist
        if (!appState.loTypes) {
            console.log('Initializing loTypes object');
            appState.loTypes = {
                lo1: { aoCategory: '', specificType: '', justification: '' },
                lo2: { aoCategory: '', specificType: '', justification: '' },
                lo3: { aoCategory: '', specificType: '', justification: '' }
            };
        }
        
        if (!appState.misconceptions) {
            console.log('Initializing misconceptions object');
            appState.misconceptions = { lo1: [], lo2: [], lo3: [] };
        }
        
        if (!appState.priorKnowledge) {
            console.log('Initializing priorKnowledge object');
            appState.priorKnowledge = { lo1: [], lo2: [], lo3: [] };
        }
        
        if (!appState.editState) {
            console.log('Initializing editState object');
            appState.editState = {
                currentLO: 1,
                tempMisconceptions: [],
                tempPriorKnowledge: []
            };
        }
    }
    
    // Keep whatever code comes after the initialization
    // For example:
    setupEventListeners();
    updateStepIndicators();
    // etc.
}

// Toggle BLT levels visibility
function toggleBltLevelsVisibility() {
    const bltUsed = document.getElementById('editBltUsed').checked;
    const levelsContainer = document.getElementById('bltLevelsContainer');
    
    if (levelsContainer) {
        levelsContainer.style.display = bltUsed ? 'block' : 'none';
    }
}

// Modal interaction functions
function addNewVariable() {
    const container = document.getElementById('variablesContainer');
    if (!container) return;
    
    const row = document.createElement('div');
    row.className = 'variable-row';
    row.innerHTML = `
        <input type="text" class="form-control" placeholder="Variable name">
        <select class="form-control variable-type">
            <option value="independent">Independent</option>
            <option value="dependent">Dependent</option>
            <option value="control">Control</option>
        </select>
        <button class="btn btn-outline btn-sm" onclick="this.parentNode.remove()">×</button>
    `;
    
    container.appendChild(row);
}

function addNewEquipment() {
    const container = document.getElementById('equipmentContainer');
    if (!container) return;
    
    const row = document.createElement('div');
    row.className = 'equipment-row';
    row.innerHTML = `
        <input type="text" class="form-control" placeholder="Equipment item">
        <button class="btn btn-outline btn-sm" onclick="this.parentNode.remove()">×</button>
    `;
    
    container.appendChild(row);
}

function addNewStep() {
    const container = document.getElementById('stepsContainer');
    if (!container) return;
    
    const row = document.createElement('div');
    row.className = 'step-row';
    row.innerHTML = `
        <input type="text" class="form-control" placeholder="Step description">
        <button class="btn btn-outline btn-sm" onclick="this.parentNode.remove()">×</button>
    `;
    
    container.appendChild(row);
}

// Modal save functions
function savePracticalChanges() {
    const loNumber = document.getElementById('editPracticalLoNumber').value;
    const title = document.getElementById('editPracticalTitle').value;
    const aim = document.getElementById('editPracticalAim').value;
    const safety = document.getElementById('editPracticalSafety').value;
    
    // Get variables
    const variables = [];
    document.querySelectorAll('#variablesContainer .variable-row').forEach(row => {
        const name = row.querySelector('input').value;
        const type = row.querySelector('select').value;
        if (name) {
            variables.push({ name, type });
        }
    });
    
    // Get equipment
    const equipment = [];
    document.querySelectorAll('#equipmentContainer .equipment-row').forEach(row => {
        const item = row.querySelector('input').value;
        if (item) {
            equipment.push(item);
        }
    });
    
    // Get steps
    const steps = [];
    document.querySelectorAll('#stepsContainer .step-row').forEach(row => {
        const step = row.querySelector('input').value;
        if (step) {
            steps.push(step);
        }
    });
    
    // Update the state
    const practicalKey = `lo${loNumber}`;
    appState.practicalRequirements[practicalKey] = {
        title,
        aim,
        variables,
        equipment,
        steps,
        safety
    };
    
    // Close the modal
    closeModal('practicalEditModal');
}

function saveFrameworkChanges() {
    const loNumber = document.getElementById('editFrameworkLoNumber').value;
    const primaryFramework = document.getElementById('editPrimaryFramework').value;
    const bltUsed = document.getElementById('editBltUsed').checked;
    
    // BLT levels
    const bltLevels = {
        remember: document.getElementById('editBltRemember')?.checked || false,
        understand: document.getElementById('editBltUnderstand')?.checked || false,
        apply: document.getElementById('editBltApply')?.checked || false,
        analyze: document.getElementById('editBltAnalyze')?.checked || false,
        evaluate: document.getElementById('editBltEvaluate')?.checked || false,
        create: document.getElementById('editBltCreate')?.checked || false
    };
    
    // Update the state
    const loKey = `lo${loNumber}`;
    appState.frameworks[loKey] = {
        primaryFramework,
        bltUsed,
        bltLevels
    };
    
    // Close the modal
    closeModal('frameworkEditModal');
}

function saveExamTechniqueChanges() {
    const loNumber = document.getElementById('editTechniqueLoNumber').value;
    
    // Get exam techniques
    const BLT = document.getElementById('editTechniqueBLT')?.checked || false;
    const EVERY = document.getElementById('editTechniqueEVERY')?.checked || false;
    const MEMES = document.getElementById('editTechniqueMEMES')?.checked || false;
    const GRAPH = document.getElementById('editTechniqueGRAPH')?.checked || false;
    const notes = document.getElementById('editExamNotes')?.value || '';
    
    // Update the state
    const loKey = `lo${loNumber}`;
    appState.examTechniques[loKey] = {
        BLT,
        EVERY,
        MEMES,
        GRAPH,
        notes
    };
    
    // Close the modal
    closeModal('examTechniqueEditModal');
}

function addNewExample() {
    const container = document.getElementById('examplesContainer');
    if (!container) return;
    
    const row = document.createElement('div');
    row.className = 'frayer-example-item';
    row.innerHTML = `
        <input type="text" class="form-control" placeholder="Example">
        <button class="btn btn-outline btn-sm" onclick="this.parentNode.remove()">×</button>
    `;
    
    container.appendChild(row);
}

function addNewNonExample() {
    const container = document.getElementById('nonExamplesContainer');
    if (!container) return;
    
    const row = document.createElement('div');
    row.className = 'frayer-example-item';
    row.innerHTML = `
        <input type="text" class="form-control" placeholder="Non-example">
        <button class="btn btn-outline btn-sm" onclick="this.parentNode.remove()">×</button>
    `;
    
    container.appendChild(row);
}

function saveFrayerModelChanges() {
    const loNumber = document.getElementById('editFrayerLoNumber').value;
    const type = document.getElementById('editFrayerType').value;
    const term = document.getElementById('editFrayerTerm').value;
    const definition = document.getElementById('editFrayerDefinition').value;
    const characteristics = document.getElementById('editFrayerCharacteristics').value;
    
    // Get examples
    const examples = [];
    document.querySelectorAll('#examplesContainer .frayer-example-item').forEach(row => {
        const example = row.querySelector('input').value;
        if (example) {
            examples.push(example);
        }
    });
    
    // Get non-examples
    const nonExamples = [];
    document.querySelectorAll('#nonExamplesContainer .frayer-example-item').forEach(row => {
        const nonExample = row.querySelector('input').value;
        if (nonExample) {
            nonExamples.push(nonExample);
        }
    });
    
    // Update the state
    const loKey = `lo${loNumber}`;
    appState.frayerModels[loKey] = {
        type,
        term,
        definition,
        examples,
        nonExamples,
        characteristics
    };
    
    // Close the modal
    closeModal('frayerModelEditModal');
}

// Make these functions globally available
window.addNewVariable = addNewVariable;
window.addNewEquipment = addNewEquipment;
window.addNewStep = addNewStep;
window.savePracticalChanges = savePracticalChanges;
window.saveFrameworkChanges = saveFrameworkChanges;
window.saveExamTechniqueChanges = saveExamTechniqueChanges;
window.addNewExample = addNewExample;
window.addNewNonExample = addNewNonExample;
window.saveFrayerModelChanges = saveFrayerModelChanges;

// Make it globally available
window.toggleBltLevelsVisibility = toggleBltLevelsVisibility;

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
    
    // Ensure misconceptions object is defined
    if (!window.appState.misconceptions) {
        window.appState.misconceptions = { lo1: [], lo2: [], lo3: [] };
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
};
document.addEventListener('DOMContentLoaded', initApp);

// Make navigation functions globally available
window.addEventListener('load', function() {
    // Wait until all scripts have loaded before making these global
    window.toggleMainStep = typeof toggleMainStep !== 'undefined' ? toggleMainStep : window.toggleMainStep;
    window.switchSubstep = typeof switchSubstep !== 'undefined' ? switchSubstep : window.switchSubstep;
    window.scrollSubstepNav = typeof scrollSubstepNav !== 'undefined' ? scrollSubstepNav : window.scrollSubstepNav;
    window.checkSubstepNavScroll = typeof checkSubstepNavScroll !== 'undefined' ? checkSubstepNavScroll : window.checkSubstepNavScroll;
    window.finishStep1 = typeof finishStep1 !== 'undefined' ? finishStep1 : window.finishStep1;
    window.finishStep2 = typeof finishStep2 !== 'undefined' ? finishStep2 : window.finishStep2;
    window.finishStep3 = typeof finishStep3 !== 'undefined' ? finishStep3 : window.finishStep3;
    window.finishStep4 = typeof finishStep4 !== 'undefined' ? finishStep4 : window.finishStep4;
    console.log('Global navigation functions assigned');
});

// Fix for event listener errors by replacing the setupEventListeners function
(function() {
    // Create a safer version of setupEventListeners
    const originalSetupEventListeners = window.setupEventListeners || function() {};
    
    // Replace the setupEventListeners function with a safer version
    window.setupEventListeners = function() {
        try {
            // Helper function to safely add event listeners
            function addEventListenerSafely(elementId, eventType, handler) {
                const element = document.getElementById(elementId);
                if (element) {
                    element.addEventListener(eventType, handler);
                    return true;
                } else {
                    console.warn(`Element with ID '${elementId}' not found, skipping event listener: ${elementId}`);
                    return false;
                }
            }

            // Attach event listeners to main step headers
            document.querySelectorAll('.main-step-header').forEach((header, index) => {
                const stepNumber = index + 1;
                header.removeEventListener('click', () => toggleMainStep(stepNumber));
                header.addEventListener('click', () => toggleMainStep(stepNumber));
            });

            // Attach event listeners to substep tabs
            document.querySelectorAll('.substep-tab').forEach(tab => {
                const stepNumber = parseInt(tab.getAttribute('data-step'));
                const substepLetter = tab.getAttribute('data-substep');
                tab.removeEventListener('click', () => switchSubstep(stepNumber, substepLetter));
                tab.addEventListener('click', () => switchSubstep(stepNumber, substepLetter));
            });
            
            // Form elements for Step 1A
            addEventListenerSafely('provider', 'change', handleProviderChange);
            addEventListenerSafely('course', 'change', handleFormInputChange);
            addEventListenerSafely('level', 'change', handleFormInputChange);
            addEventListenerSafely('ability', 'change', handleFormInputChange);
            addEventListenerSafely('subject', 'change', handleFormInputChange);
            addEventListenerSafely('topic', 'input', handleFormInputChange);
            addEventListenerSafely('lessonNumber', 'input', handleFormInputChange);
            addEventListenerSafely('lessonTitle', 'input', handleFormInputChange);
            addEventListenerSafely('description', 'input', handleFormInputChange);
            
            // Practical component checkboxes
            addEventListenerSafely('lo1HasPractical', 'change', handlePracticalChange);
            addEventListenerSafely('lo2HasPractical', 'change', handlePracticalChange);
            addEventListenerSafely('lo3HasPractical', 'change', handlePracticalChange);
            
            // Step 1A: Overview
            addEventListenerSafely('generateOverviewPromptBtn', 'click', generateOverviewPrompt);
            addEventListenerSafely('copyOverviewPromptBtn', 'click', () => copyToClipboard('overviewPromptTextarea'));
            addEventListenerSafely('overviewResponseTextarea', 'input', handleOverviewResponse);
            addEventListenerSafely('previewOverviewResponseBtn', 'click', previewOverviewResponse);
            addEventListenerSafely('continueToLOTypesBtn', 'click', () => switchSubstep(1, 'B'));
            
            // Step 1B: LO Types
            addEventListenerSafely('generateLOTypesPromptBtn', 'click', generateLOTypesPrompt);
            addEventListenerSafely('copyLOTypesPromptBtn', 'click', () => copyToClipboard('loTypesPromptTextarea'));
            addEventListenerSafely('loTypesResponseTextarea', 'input', handleLOTypesResponse);
            addEventListenerSafely('previewLOTypesResponseBtn', 'click', previewLOTypesResponse);
            addEventListenerSafely('continueToMisconceptionsBtn', 'click', () => switchSubstep(1, 'C'));
            
            // Edit LO Type buttons
            addEventListenerSafely('editLO1TypeBtn', 'click', () => openLoTypeEditModal(1));
            addEventListenerSafely('editLO2TypeBtn', 'click', () => openLoTypeEditModal(2));
            addEventListenerSafely('editLO3TypeBtn', 'click', () => openLoTypeEditModal(3));
            addEventListenerSafely('editAoCategory', 'change', updateSpecificTypeOptions);
            addEventListenerSafely('saveLoTypeBtn', 'click', saveLoTypeChanges);
            
            // Step 1C: Misconceptions
            addEventListenerSafely('generateMisconceptionsPromptBtn', 'click', generateMisconceptionsPrompt);
            addEventListenerSafely('copyMisconceptionsPromptBtn', 'click', () => copyToClipboard('misconceptionsPromptTextarea'));
            addEventListenerSafely('misconceptionsResponseTextarea', 'input', handleMisconceptionsResponse);
            addEventListenerSafely('previewMisconceptionsResponseBtn', 'click', previewMisconceptionsResponse);
            addEventListenerSafely('continueToPriorKnowledgeBtn', 'click', () => switchSubstep(1, 'D'));
            
            // Edit Misconceptions buttons
            addEventListenerSafely('editLO1MisconceptionsBtn', 'click', () => openMisconceptionsEditModal(1));
            addEventListenerSafely('editLO2MisconceptionsBtn', 'click', () => openMisconceptionsEditModal(2));
            addEventListenerSafely('editLO3MisconceptionsBtn', 'click', () => openMisconceptionsEditModal(3));
            addEventListenerSafely('addMisconceptionBtn', 'click', addNewMisconception);
            addEventListenerSafely('saveMisconceptionsBtn', 'click', saveMisconceptionsChanges);
            
            // Step 1D: Prior Knowledge
            addEventListenerSafely('generatePriorKnowledgePromptBtn', 'click', generatePriorKnowledgePrompt);
            addEventListenerSafely('copyPriorKnowledgePromptBtn', 'click', () => copyToClipboard('priorKnowledgePromptTextarea'));
            addEventListenerSafely('priorKnowledgeResponseTextarea', 'input', handlePriorKnowledgeResponse);
            addEventListenerSafely('previewPriorKnowledgeResponseBtn', 'click', previewPriorKnowledgeResponse);
            addEventListenerSafely('continueToReviewBtn', 'click', () => switchSubstep(1, 'E'));
            
            // Edit Prior Knowledge buttons
            addEventListenerSafely('editLO1PriorKnowledgeBtn', 'click', () => openPriorKnowledgeEditModal(1));
            addEventListenerSafely('editLO2PriorKnowledgeBtn', 'click', () => openPriorKnowledgeEditModal(2));
            addEventListenerSafely('editLO3PriorKnowledgeBtn', 'click', () => openPriorKnowledgeEditModal(3));
            addEventListenerSafely('addPriorKnowledgeBtn', 'click', addNewPriorKnowledgeItem);
            addEventListenerSafely('savePriorKnowledgeBtn', 'click', savePriorKnowledgeChanges);
            
            // Step 1E: Review & Edit
            addEventListenerSafely('finishStep1Btn', 'click', finishStep1);
            
            // Step 2 Event Listeners
            // Framework edit modal
            addEventListenerSafely('editBltUsed', 'change', toggleBltLevelsVisibility);
            addEventListenerSafely('saveFrameworkBtn', 'click', saveFrameworkChanges);
            
            // Exam Technique edit modal
            addEventListenerSafely('saveExamTechniqueBtn', 'click', saveExamTechniqueChanges);
            
            // Practical Requirements edit modal
            addEventListenerSafely('addVariableBtn', 'click', addNewVariable);
            addEventListenerSafely('addEquipmentBtn', 'click', addNewEquipment);
            addEventListenerSafely('addStepBtn', 'click', addNewStep);
            addEventListenerSafely('savePracticalBtn', 'click', savePracticalChanges);
            
            // Frayer Model edit modal
            addEventListenerSafely('addExampleBtn', 'click', addNewExample);
            addEventListenerSafely('addNonExampleBtn', 'click', addNewNonExample);
            addEventListenerSafely('saveFrayerModelBtn', 'click', saveFrayerModelChanges);
            
            // Step 3 buttons - These are the problematic ones
            addEventListenerSafely('continueToTeachingInputBtn', 'click', () => switchSubstep(3, 'B'));
            addEventListenerSafely('continueToFormativeAssessmentBtn', 'click', () => switchSubstep(3, 'C'));
            addEventListenerSafely('continueToSlideReviewBtn', 'click', () => switchSubstep(3, 'D'));
            
            // Check for scroll on resize
            window.addEventListener('resize', checkSubstepNavScroll);
        } catch (error) {
            console.error("Error in setupEventListeners:", error);
        }
    };
    
    // Re-run setup event listeners if the app has already been initialized
    if (window.appState) {
        console.log("Re-running setupEventListeners with safer version");
        window.setupEventListeners();
    }
})();

// STEP 1A: OVERVIEW FUNCTIONS

// Generate overview prompt
function generateOverviewPrompt() {
    // Basic form validation
    const requiredFields = ['provider', 'course', 'level', 'ability', 'subject', 'topic', 'lessonNumber', 'lessonTitle'];
    let missingFields = [];
    
    requiredFields.forEach(field => {
        if (!appState.lessonInfo[field]) {
            missingFields.push(field);
        }
    });
    
    if (missingFields.length > 0) {
        alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
        return;
    }
    
    const prompt = `Create an engaging GCSE science lesson outline on ${appState.lessonInfo.topic} for ${appState.lessonInfo.level} ${appState.lessonInfo.subject} students of ${appState.lessonInfo.ability} ability level.

FORMAT YOUR RESPONSE USING THIS EXACT XML STRUCTURE:

<LessonInfo>
Subject: ${appState.lessonInfo.subject}
Topic: ${appState.lessonInfo.topic}
ExamBoard: ${appState.lessonInfo.provider}
Course: ${appState.lessonInfo.course}
Level: ${appState.lessonInfo.level}
Ability: ${appState.lessonInfo.ability}
LessonNumber: ${appState.lessonInfo.lessonNumber}
LessonTitle: ${appState.lessonInfo.lessonTitle}
</LessonInfo>

<LearningObjectives>
<LO1>
<Title>[First learning objective title - make this exam-focused but engaging]</Title>
<Description>[One paragraph describing this learning objective and how it will be taught in an engaging way, including any live demonstrations or models if appropriate]</Description>
</LO1>

<LO2>
<Title>[Second learning objective title - make this exam-focused but engaging]</Title>
<Description>[One paragraph describing this learning objective and how it will be taught in an engaging way]</Description>
</LO2>

<!-- Include LO3 only if necessary for the topic -->
<LO3>
<Title>[Optional third learning objective title]</Title>
<Description>[One paragraph describing this learning objective and how it will be taught in an engaging way]</Description>
</LO3>
</LearningObjectives>

Your lesson outline must:
1. Include 2-3 clear, specific learning objectives aligned with the GCSE specification
2. Focus on exam technique while keeping students engaged
3. Suggest general approaches for teaching each objective (NOT detailed lesson activities)
4. Mention if a live demonstration or physical model would be appropriate (without detailed instructions)
5. Make abstract concepts tangible and memorable
6. Indicate in the descriptions if any of the learning objectives would benefit from a practical component
7. DO NOT include detailed worksheets, specific written tasks, or detailed practical descriptions

${appState.lessonInfo.description ? 'Additional information: ' + appState.lessonInfo.description : ''}

IMPORTANT: I need your response in two parts:
1. First, give me a clear, readable version of the response formatted for easy scanning
2. Then, provide the XML-tagged version exactly as specified above (this is what I'll use in subsequent steps)`;

    // Set prompt in textarea
    document.getElementById('overviewPromptTextarea').value = prompt;
}

// Handle overview response
function handleOverviewResponse(e) {
    const response = e.target.value;
    appState.responses.overview = response;
    
    // Extract XML content
    const lessonInfoMatch = extractXML(response, 'LessonInfo');
    const learningObjMatch = extractXML(response, 'LearningObjectives');
    
    if (lessonInfoMatch) {
        appState.responseTags.lessonInfo = lessonInfoMatch;
    }
    
    if (learningObjMatch) {
        appState.responseTags.learningObjectives = learningObjMatch;
        
        // Extract LO titles and descriptions
        extractLearningObjectives(learningObjMatch);
    }
    
    // Update button state
    document.getElementById('continueToLOTypesBtn').disabled = !(lessonInfoMatch && learningObjMatch);
}

// Extract learning objectives from XML
function extractLearningObjectives(xml) {
    // Extract LO1
    const lo1Match = xml.match(/<LO1>[\s\S]*?<Title>([\s\S]*?)<\/Title>[\s\S]*?<Description>([\s\S]*?)<\/Description>([\s\S]*?)<\/LO1>/);
    if (lo1Match) {
        appState.learningObjectives.lo1.title = lo1Match[1].trim();
        appState.learningObjectives.lo1.description = lo1Match[2].trim();
        
        // Check for practical tag
        const practical1Match = lo1Match[3].match(/<Practical>([\s\S]*?)<\/Practical>/i);
        if (practical1Match) {
            appState.learningObjectives.lo1.hasPractical = practical1Match[1].trim().toLowerCase() === 'yes';
            // Update the checkbox to match
            const checkbox = document.getElementById('lo1HasPractical');
            if (checkbox) {
                checkbox.checked = appState.learningObjectives.lo1.hasPractical;
            }
            // Update the badge
            updateBadge('lo1Badge', appState.learningObjectives.lo1.hasPractical);
        }
        
        appState.learningObjectives.count = 1;
    }
    
    // Extract LO2
    const lo2Match = xml.match(/<LO2>[\s\S]*?<Title>([\s\S]*?)<\/Title>[\s\S]*?<Description>([\s\S]*?)<\/Description>([\s\S]*?)<\/LO2>/);
    if (lo2Match) {
        appState.learningObjectives.lo2.title = lo2Match[1].trim();
        appState.learningObjectives.lo2.description = lo2Match[2].trim();
        
        // Check for practical tag
        const practical2Match = lo2Match[3].match(/<Practical>([\s\S]*?)<\/Practical>/i);
        if (practical2Match) {
            appState.learningObjectives.lo2.hasPractical = practical2Match[1].trim().toLowerCase() === 'yes';
            // Update the checkbox to match
            const checkbox = document.getElementById('lo2HasPractical');
            if (checkbox) {
                checkbox.checked = appState.learningObjectives.lo2.hasPractical;
            }
            // Update the badge
            updateBadge('lo2Badge', appState.learningObjectives.lo2.hasPractical);
        }
        
        appState.learningObjectives.count = 2;
    }
    
    // Extract LO3 if present
    const lo3Match = xml.match(/<LO3>[\s\S]*?<Title>([\s\S]*?)<\/Title>[\s\S]*?<Description>([\s\S]*?)<\/Description>([\s\S]*?)<\/LO3>/);
    if (lo3Match) {
        appState.learningObjectives.lo3.title = lo3Match[1].trim();
        appState.learningObjectives.lo3.description = lo3Match[2].trim();
        
        // Check for practical tag
        const practical3Match = lo3Match[3].match(/<Practical>([\s\S]*?)<\/Practical>/i);
        if (practical3Match) {
            appState.learningObjectives.lo3.hasPractical = practical3Match[1].trim().toLowerCase() === 'yes';
            // Update the checkbox to match
            const checkbox = document.getElementById('lo3HasPractical');
            if (checkbox) {
                checkbox.checked = appState.learningObjectives.lo3.hasPractical;
            }
            // Update the badge
            updateBadge('lo3Badge', appState.learningObjectives.lo3.hasPractical);
        }
        
        appState.learningObjectives.lo3.exists = true;
        appState.learningObjectives.count = 3;
    }
    
    // Log the extracted learning objectives for debugging
    console.log('Extracted learning objectives:', appState.learningObjectives);
}

// Preview overview response
function previewOverviewResponse() {
    if (!appState.responses.overview.trim()) {
        alert('Please paste Claude\'s response before previewing');
        return;
    }
    
    // Format the response for the formatted view
    const formattedResponseHtml = formatResponse(appState.responses.overview, 'overview');
    document.getElementById('overviewFormattedResponse').innerHTML = formattedResponseHtml;
    
    // Format the XML for the tagged view
    const taggedResponseHtml = formatXML(appState.responses.overview);
    document.getElementById('overviewTaggedResponse').innerHTML = taggedResponseHtml;
    
    // Show the preview
    document.getElementById('overviewPreview').style.display = 'block';
    
    // Show learning objectives section with practical detection
    displayLearningObjectives();
}

// Display learning objectives with practical detection options
function displayLearningObjectives() {
    // Set values in the learning objectives containers
    document.getElementById('lo1Title').textContent = appState.learningObjectives.lo1.title;
    document.getElementById('lo1Description').textContent = appState.learningObjectives.lo1.description;
    updateBadge('lo1Badge', appState.learningObjectives.lo1.hasPractical);
    
    document.getElementById('lo2Title').textContent = appState.learningObjectives.lo2.title;
    document.getElementById('lo2Description').textContent = appState.learningObjectives.lo2.description;
    updateBadge('lo2Badge', appState.learningObjectives.lo2.hasPractical);
    
    // Handle LO3 if it exists
    if (appState.learningObjectives.lo3.exists) {
        document.getElementById('lo3Container').style.display = 'block';
        document.getElementById('lo3Title').textContent = appState.learningObjectives.lo3.title;
        document.getElementById('lo3Description').textContent = appState.learningObjectives.lo3.description;
        updateBadge('lo3Badge', appState.learningObjectives.lo3.hasPractical);
    } else {
        document.getElementById('lo3Container').style.display = 'none';
    }
    
    // Show the section
    document.getElementById('learningObjectivesSection').style.display = 'block';
}

// Update badge display
function updateBadge(badgeId, hasPractical) {
    const badge = document.getElementById(badgeId);
    if (badge) {
        if (hasPractical) {
            badge.textContent = 'Practical';
            badge.classList.add('badge-practical');
        } else {
            badge.textContent = 'Theory';
            badge.classList.remove('badge-practical');
        }
    }
}

// STEP 1B: LO TYPES FUNCTIONS

// Display the content summary for LO Types substep
function displayLOTypesSubstepSummary() {
    console.log("Displaying LO Types Substep Summary");
    console.log("Current learning objectives:", appState.learningObjectives);
    
    let html = '<h4>Learning Objectives</h4>';
    
    // Check if learning objectives exist and have titles
    if (appState.learningObjectives && 
        appState.learningObjectives.lo1 && 
        appState.learningObjectives.lo1.title) {
        
        // LO1
        html += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective 1</span>
                <span id="summaryLo1Badge" class="lo-badge ${appState.learningObjectives.lo1.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo1.hasPractical ? 'Practical' : 'Theory'}</span>
            </div>
            <p><strong>${appState.learningObjectives.lo1.title}</strong></p>
            <p>${appState.learningObjectives.lo1.description}</p>
        </div>`;
        
        // LO2
        if (appState.learningObjectives.lo2 && appState.learningObjectives.lo2.title) {
            html += `<div class="lo-container">
                <div class="lo-header">
                    <span>Learning Objective 2</span>
                    <span id="summaryLo2Badge" class="lo-badge ${appState.learningObjectives.lo2.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo2.hasPractical ? 'Practical' : 'Theory'}</span>
                </div>
                <p><strong>${appState.learningObjectives.lo2.title}</strong></p>
                <p>${appState.learningObjectives.lo2.description}</p>
            </div>`;
        }
        
        // LO3 if it exists
        if (appState.learningObjectives.lo3 && 
            appState.learningObjectives.lo3.exists && 
            appState.learningObjectives.lo3.title) {
            
            html += `<div class="lo-container">
                <div class="lo-header">
                    <span>Learning Objective 3</span>
                    <span id="summaryLo3Badge" class="lo-badge ${appState.learningObjectives.lo3.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo3.hasPractical ? 'Practical' : 'Theory'}</span>
                </div>
                <p><strong>${appState.learningObjectives.lo3.title}</strong></p>
                <p>${appState.learningObjectives.lo3.description}</p>
            </div>`;
        }
    } else {
        html = '<p>Please complete Step 1A first to see your learning objectives here.</p>';
    }
    
    // Update the content
    const contentElement = document.getElementById('loBSummaryContent');
    if (contentElement) {
        contentElement.innerHTML = html;
    } else {
        console.error("Could not find loBSummaryContent element");
    }
}

// Generate LO types prompt
function generateLOTypesPrompt() {
    if (!appState.responseTags.learningObjectives) {
        alert('Please complete the overview step first');
        return;
    }

    // Add information about practical components
    let practicalInfo = '\n\nPractical Information:\n';
    practicalInfo += `LO1 Has Practical Component: ${appState.learningObjectives.lo1.hasPractical ? 'Yes' : 'No'}\n`;
    practicalInfo += `LO2 Has Practical Component: ${appState.learningObjectives.lo2.hasPractical ? 'Yes' : 'No'}\n`;
    if (appState.learningObjectives.lo3.exists) {
        practicalInfo += `LO3 Has Practical Component: ${appState.learningObjectives.lo3.hasPractical ? 'Yes' : 'No'}\n`;
    }
    
    const prompt = `Based on the lesson overview I provided earlier, I need you to identify the most appropriate learning objective types for each LO. 

Here's the lesson overview:
${appState.responseTags.lessonInfo}

${appState.responseTags.learningObjectives}
${practicalInfo}

Now, for each learning objective, identify which of these AO types would be most appropriate and WHY:

AO1 - Knowledge & Recall options:
• Abstract Concept understanding
• Tangible Knowledge recall
• Exam Technique familiarity
• Terminology & Keyword Precision
• Fact-Sequence Recall

AO2 - Application options:
• Data Analysis & Interpretation
• Exam Application Techniques
• Calculation Application
• Scientific Method Application
• Scenario-Based Application

AO3 - Analysis & Evaluation options:
• Experimental Design & Analysis
• Multi-Step Problem Solving
• Evaluation & Critical Assessment
• Interpretation & Conclusion Formation
• Abstract Concept Linking

FORMAT YOUR RESPONSE USING THIS EXACT XML STRUCTURE:

<LOTypes>
<LO1Type>
<AOCategory>[AO1/AO2/AO3]</AOCategory>
<SpecificType>[Specific type from the list above]</SpecificType>
<Justification>[Brief explanation of why this type is appropriate for this learning objective, referencing practical components if relevant]</Justification>
</LO1Type>

<LO2Type>
<AOCategory>[AO1/AO2/AO3]</AOCategory>
<SpecificType>[Specific type from the list above]</SpecificType>
<Justification>[Brief explanation of why this type is appropriate for this learning objective, referencing practical components if relevant]</Justification>
</LO2Type>

<!-- Include LO3 only if there was a third learning objective in the overview -->
<LO3Type>
<AOCategory>[AO1/AO2/AO3]</AOCategory>
<SpecificType>[Specific type from the list above]</SpecificType>
<Justification>[Brief explanation of why this type is appropriate for this learning objective, referencing practical components if relevant]</Justification>
</LO3Type>
</LOTypes>

IMPORTANT: I need your response in two parts:
1. First, give me a clear, readable version of the response formatted for easy scanning
2. Then, provide the XML-tagged version exactly as specified above (this is what I'll use in subsequent steps)`;

    // Set prompt in textarea
    document.getElementById('loTypesPromptTextarea').value = prompt;
}

// Handle LO types response
function handleLOTypesResponse(e) {
    try {
        const response = e.target.value;
        
        // Only proceed if there's actual content
        if (!response || response.trim() === '') {
            console.log('Empty response, not processing');
            document.getElementById('continueToMisconceptionsBtn').disabled = true;
            return;
        }
        
        console.log('Processing LOTypes response...');
        appState.responses.loTypes = response;
        
        // Ensure loTypes object is initialized
        if (!appState.loTypes) {
            console.log('Initializing loTypes object');
            appState.loTypes = {
                lo1: {
                    aoCategory: '',
                    specificType: '',
                    justification: ''
                },
                lo2: {
                    aoCategory: '',
                    specificType: '',
                    justification: ''
                },
                lo3: {
                    aoCategory: '',
                    specificType: '',
                    justification: ''
                }
            };
        }
        
        // Extract XML content - specifically looking for LOTypes, not LearningObjectives
        const loTypesMatch = extractXML(response, 'LOTypes');
        
        if (loTypesMatch) {
            console.log('Found LOTypes XML in response');
            appState.responseTags.loTypes = loTypesMatch;
            
            // Extract LO types
            try {
                extractLOTypes(loTypesMatch);
                console.log('Successfully extracted LO types:', appState.loTypes);
                
                // Enable the continue button
                document.getElementById('continueToMisconceptionsBtn').disabled = false;
            } catch (extractError) {
                console.error('Error extracting LO types:', extractError);
                alert('There was an error processing the Learning Objective Types. Please check the format of Claude\'s response.');
                document.getElementById('continueToMisconceptionsBtn').disabled = true;
            }
        } else {
            console.warn('No LOTypes XML found in the response');
            
            // Check if response contains Learning Objectives instead
            if (response.includes('<LearningObjectives>')) {
                console.warn('Response contains Learning Objectives XML, not LOTypes. This appears to be from Step 1A, not Step 1B.');
                alert('This response appears to be from Step 1A (Learning Objectives), not Step 1B (LO Types). Please generate and paste the LOTypes response from Claude.');
            }
            
            document.getElementById('continueToMisconceptionsBtn').disabled = true;
        }
    } catch (error) {
        console.error('Error in handleLOTypesResponse:', error);
        document.getElementById('continueToMisconceptionsBtn').disabled = true;
    }
}

// Extract LO types from XML
function extractLOTypes(xml) {
    if (!xml) {
        console.error('No XML provided to extractLOTypes');
        return;
    }
    
    // Ensure loTypes object exists
    if (!appState.loTypes) {
        appState.loTypes = {
            lo1: { aoCategory: '', specificType: '', justification: '' },
            lo2: { aoCategory: '', specificType: '', justification: '' },
            lo3: { aoCategory: '', specificType: '', justification: '' }
        };
    }
    
    try {
        // Extract LO1 type
        const lo1TypeMatch = xml.match(/<LO1Type>[\s\S]*?<AOCategory>([\s\S]*?)<\/AOCategory>[\s\S]*?<SpecificType>([\s\S]*?)<\/SpecificType>[\s\S]*?<Justification>([\s\S]*?)<\/Justification>[\s\S]*?<\/LO1Type>/);
        if (lo1TypeMatch) {
            appState.loTypes.lo1.aoCategory = lo1TypeMatch[1].trim();
            appState.loTypes.lo1.specificType = lo1TypeMatch[2].trim();
            appState.loTypes.lo1.justification = lo1TypeMatch[3].trim();
            console.log('Extracted LO1 type:', appState.loTypes.lo1);
        } else {
            console.warn('Could not extract LO1 type from XML');
        }
        
        // Extract LO2 type
        const lo2TypeMatch = xml.match(/<LO2Type>[\s\S]*?<AOCategory>([\s\S]*?)<\/AOCategory>[\s\S]*?<SpecificType>([\s\S]*?)<\/SpecificType>[\s\S]*?<Justification>([\s\S]*?)<\/Justification>[\s\S]*?<\/LO2Type>/);
        if (lo2TypeMatch) {
            appState.loTypes.lo2.aoCategory = lo2TypeMatch[1].trim();
            appState.loTypes.lo2.specificType = lo2TypeMatch[2].trim();
            appState.loTypes.lo2.justification = lo2TypeMatch[3].trim();
            console.log('Extracted LO2 type:', appState.loTypes.lo2);
        } else {
            console.warn('Could not extract LO2 type from XML');
        }
        
        // Extract LO3 type if present
        const lo3TypeMatch = xml.match(/<LO3Type>[\s\S]*?<AOCategory>([\s\S]*?)<\/AOCategory>[\s\S]*?<SpecificType>([\s\S]*?)<\/SpecificType>[\s\S]*?<Justification>([\s\S]*?)<\/Justification>[\s\S]*?<\/LO3Type>/);
        if (lo3TypeMatch && appState.learningObjectives.lo3.exists) {
            appState.loTypes.lo3.aoCategory = lo3TypeMatch[1].trim();
            appState.loTypes.lo3.specificType = lo3TypeMatch[2].trim();
            appState.loTypes.lo3.justification = lo3TypeMatch[3].trim();
            console.log('Extracted LO3 type:', appState.loTypes.lo3);
        } else if (appState.learningObjectives.lo3.exists) {
            console.warn('Could not extract LO3 type from XML even though LO3 exists');
        }
    } catch (error) {
        console.error('Error in extractLOTypes:', error);
        throw error; // Re-throw to be handled by the caller
    }
}

// Preview LO types response
function previewLOTypesResponse() {
    if (!appState.responses.loTypes.trim()) {
        alert('Please paste Claude\'s response before previewing');
        return;
    }
    
    // Format the response for the formatted view
    const formattedResponseHtml = formatResponse(appState.responses.loTypes, 'loTypes');
    document.getElementById('loTypesFormattedResponse').innerHTML = formattedResponseHtml;
    
    // Format the XML for the tagged view
    const taggedResponseHtml = formatXML(appState.responses.loTypes);
    document.getElementById('loTypesTaggedResponse').innerHTML = taggedResponseHtml;
    
    // Show the preview
    document.getElementById('loTypesPreview').style.display = 'block';
    
    // Display LO types for editing
    displayLOTypesForEditing();
}

// Display LO types for editing
function displayLOTypesForEditing() {
    try {
        // Ensure loTypes exists
        if (!appState.loTypes) {
            console.error('loTypes not initialized in displayLOTypesForEditing');
            appState.loTypes = {
                lo1: { aoCategory: '', specificType: '', justification: '' },
                lo2: { aoCategory: '', specificType: '', justification: '' },
                lo3: { aoCategory: '', specificType: '', justification: '' }
            };
        }
        
        // LO1
        const lo1AOCategory = document.getElementById('lo1AOCategory');
        const lo1SpecificType = document.getElementById('lo1SpecificType');
        const lo1TypeJustification = document.getElementById('lo1TypeJustification');
        
        if (lo1AOCategory) lo1AOCategory.textContent = appState.loTypes.lo1.aoCategory || '(Not set)';
        if (lo1SpecificType) lo1SpecificType.textContent = appState.loTypes.lo1.specificType || '(Not set)';
        if (lo1TypeJustification) lo1TypeJustification.textContent = appState.loTypes.lo1.justification || '(Not provided)';
        
        // LO2
        const lo2AOCategory = document.getElementById('lo2AOCategory');
        const lo2SpecificType = document.getElementById('lo2SpecificType');
        const lo2TypeJustification = document.getElementById('lo2TypeJustification');
        
        if (lo2AOCategory) lo2AOCategory.textContent = appState.loTypes.lo2.aoCategory || '(Not set)';
        if (lo2SpecificType) lo2SpecificType.textContent = appState.loTypes.lo2.specificType || '(Not set)';
        if (lo2TypeJustification) lo2TypeJustification.textContent = appState.loTypes.lo2.justification || '(Not provided)';
        
        // LO3 if it exists
        if (appState.learningObjectives.lo3.exists) {
            const lo3TypeContainer = document.getElementById('lo3TypeContainer');
            const lo3AOCategory = document.getElementById('lo3AOCategory');
            const lo3SpecificType = document.getElementById('lo3SpecificType');
            const lo3TypeJustification = document.getElementById('lo3TypeJustification');
            
            if (lo3TypeContainer) lo3TypeContainer.style.display = 'block';
            if (lo3AOCategory) lo3AOCategory.textContent = appState.loTypes.lo3.aoCategory || '(Not set)';
            if (lo3SpecificType) lo3SpecificType.textContent = appState.loTypes.lo3.specificType || '(Not set)';
            if (lo3TypeJustification) lo3TypeJustification.textContent = appState.loTypes.lo3.justification || '(Not provided)';
        } else {
            const lo3TypeContainer = document.getElementById('lo3TypeContainer');
            if (lo3TypeContainer) lo3TypeContainer.style.display = 'none';
        }
        
        // Show the container
        const loTypesEditContainer = document.getElementById('loTypesEditContainer');
        if (loTypesEditContainer) loTypesEditContainer.style.display = 'block';
        
        console.log('Successfully displayed LO types for editing');
    } catch (error) {
        console.error('Error in displayLOTypesForEditing:', error);
        alert('There was an error displaying the Learning Objective Types. Please try refreshing the page.');
    }
}

// Open LO Type Edit Modal
function openLoTypeEditModal(loNumber) {
    appState.editState.currentLO = loNumber;
    
    // Set the LO number in the dropdown
    document.getElementById('editLoNumber').value = loNumber;
    
    // Get the current values
    const loType = appState.loTypes[`lo${loNumber}`];
    
    // Set the values in the form
    document.getElementById('editAoCategory').value = loType.aoCategory;
    updateSpecificTypeOptions(); // Populate the specific type options based on the AO category
    document.getElementById('editSpecificType').value = loType.specificType;
    document.getElementById('editTypeJustification').value = loType.justification;
    
    // Show the modal
    document.getElementById('loTypeEditModal').classList.add('active');
}

// Update specific type options based on selected AO category
function updateSpecificTypeOptions() {
    const aoCategory = document.getElementById('editAoCategory').value;
    const specificTypeSelect = document.getElementById('editSpecificType');
    
    // Clear current options
    specificTypeSelect.innerHTML = '';
    
    // Add new options based on selected AO category
    if (aoTypes[aoCategory]) {
        aoTypes[aoCategory].forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            specificTypeSelect.appendChild(option);
        });
    }
}

// Save LO Type changes
function saveLoTypeChanges() {
    const loNumber = appState.editState.currentLO;
    const aoCategory = document.getElementById('editAoCategory').value;
    const specificType = document.getElementById('editSpecificType').value;
    const justification = document.getElementById('editTypeJustification').value;
    
    // Update the state
    appState.loTypes[`lo${loNumber}`].aoCategory = aoCategory;
    appState.loTypes[`lo${loNumber}`].specificType = specificType;
    appState.loTypes[`lo${loNumber}`].justification = justification;
    
    // Update the display
    document.getElementById(`lo${loNumber}AOCategory`).textContent = aoCategory;
    document.getElementById(`lo${loNumber}SpecificType`).textContent = specificType;
    document.getElementById(`lo${loNumber}TypeJustification`).textContent = justification;
    
    // Close the modal
    closeModal('loTypeEditModal');
}

// STEP 1C: MISCONCEPTIONS FUNCTIONS

// Display the content summary for Misconceptions substep
function displayMisconceptionsSubstepSummary() {
    console.log("Displaying Misconceptions Substep Summary");
    console.log("Current LO types:", appState.loTypes);
    
    let html = '<h4>Learning Objectives & Types</h4>';
    
    // Check if learning objectives and types exist
    if (appState.learningObjectives && 
        appState.learningObjectives.lo1 && 
        appState.learningObjectives.lo1.title &&
        appState.loTypes &&
        appState.loTypes.lo1 &&
        appState.loTypes.lo1.aoCategory) {
        
        // LO1
        html += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective 1</span>
                <span id="summaryLo1Badge" class="lo-badge ${appState.learningObjectives.lo1.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo1.hasPractical ? 'Practical' : 'Theory'}</span>
            </div>
            <p><strong>${appState.learningObjectives.lo1.title}</strong></p>
            <p>${appState.learningObjectives.lo1.description}</p>
            <div style="margin-top: 0.5rem;">
                <p><strong>Assessment Objective:</strong> ${appState.loTypes.lo1.aoCategory} - ${appState.loTypes.lo1.specificType}</p>
            </div>
        </div>`;
        
        // LO2
        if (appState.learningObjectives.lo2 && 
            appState.learningObjectives.lo2.title &&
            appState.loTypes.lo2 &&
            appState.loTypes.lo2.aoCategory) {
            
            html += `<div class="lo-container">
                <div class="lo-header">
                    <span>Learning Objective 2</span>
                    <span id="summaryLo2Badge" class="lo-badge ${appState.learningObjectives.lo2.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo2.hasPractical ? 'Practical' : 'Theory'}</span>
                </div>
                <p><strong>${appState.learningObjectives.lo2.title}</strong></p>
                <p>${appState.learningObjectives.lo2.description}</p>
                <div style="margin-top: 0.5rem;">
                    <p><strong>Assessment Objective:</strong> ${appState.loTypes.lo2.aoCategory} - ${appState.loTypes.lo2.specificType}</p>
                </div>
            </div>`;
        }
        
        // LO3 if it exists
        if (appState.learningObjectives.lo3 && 
            appState.learningObjectives.lo3.exists && 
            appState.learningObjectives.lo3.title &&
            appState.loTypes.lo3 &&
            appState.loTypes.lo3.aoCategory) {
            
            html += `<div class="lo-container">
                <div class="lo-header">
                    <span>Learning Objective 3</span>
                    <span id="summaryLo3Badge" class="lo-badge ${appState.learningObjectives.lo3.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo3.hasPractical ? 'Practical' : 'Theory'}</span>
                </div>
                <p><strong>${appState.learningObjectives.lo3.title}</strong></p>
                <p>${appState.learningObjectives.lo3.description}</p>
                <div style="margin-top: 0.5rem;">
                    <p><strong>Assessment Objective:</strong> ${appState.loTypes.lo3.aoCategory} - ${appState.loTypes.lo3.specificType}</p>
                </div>
            </div>`;
        }
    } else {
        html = '<p>Please complete Steps 1A and 1B first to see your learning objectives and types here.</p>';
    }
    
    // Update the content
    const contentElement = document.getElementById('loCSummaryContent');
    if (contentElement) {
        contentElement.innerHTML = html;
    } else {
        console.error("Could not find loCSummaryContent element");
    }
}

// Generate misconceptions prompt
function generateMisconceptionsPrompt() {
    if (!appState.responseTags.learningObjectives || !appState.responseTags.loTypes) {
        alert('Please complete the previous steps first');
        return;
    }

    // Add information about practical components
    let practicalInfo = '\n\nPractical Information:\n';
    practicalInfo += `LO1 Has Practical Component: ${appState.learningObjectives.lo1.hasPractical ? 'Yes' : 'No'}\n`;
    practicalInfo += `LO2 Has Practical Component: ${appState.learningObjectives.lo2.hasPractical ? 'Yes' : 'No'}\n`;
    if (appState.learningObjectives.lo3.exists) {
        practicalInfo += `LO3 Has Practical Component: ${appState.learningObjectives.lo3.hasPractical ? 'Yes' : 'No'}\n`;
    }
    
    const prompt = `Based on the lesson overview and learning objective types I provided earlier, I need you to identify likely student misconceptions for each learning objective.

Here's the lesson overview:
${appState.responseTags.lessonInfo}

${appState.responseTags.learningObjectives}
${practicalInfo}

Here are the learning objective types:
${appState.responseTags.loTypes}

For each learning objective, identify 2-3 specific misconceptions that students commonly develop about this topic. For any learning objectives with practical components, be sure to include at least one misconception related to the practical aspects.

FORMAT YOUR RESPONSE USING THIS EXACT XML STRUCTURE:

<Misconceptions>
<LO1Misconceptions>
<Misconception1>[Brief description of first misconception related to LO1]</Misconception1>
<Misconception2>[Brief description of second misconception related to LO1]</Misconception2>
<Misconception3>[Optional third misconception related to LO1]</Misconception3>
</LO1Misconceptions>

<LO2Misconceptions>
<Misconception1>[Brief description of first misconception related to LO2]</Misconception1>
<Misconception2>[Brief description of second misconception related to LO2]</Misconception2>
<Misconception3>[Optional third misconception related to LO2]</Misconception3>
</LO2Misconceptions>

<!-- Include LO3 only if there was a third learning objective in the overview -->
<LO3Misconceptions>
<Misconception1>[Brief description of first misconception related to LO3]</Misconception1>
<Misconception2>[Brief description of second misconception related to LO3]</Misconception2>
<Misconception3>[Optional third misconception related to LO3]</Misconception3>
</LO3Misconceptions>
</Misconceptions>

IMPORTANT: I need your response in two parts:
1. First, give me a clear, readable version of the response formatted for easy scanning
2. Then, provide the XML-tagged version exactly as specified above (this is what I'll use in subsequent steps)`;

    // Set prompt in textarea
    document.getElementById('misconceptionsPromptTextarea').value = prompt;
}

// Handle misconceptions response
function handleMisconceptionsResponse(e) {
    const response = e.target.value;
    appState.responses.misconceptions = response;
    
    // Ensure misconceptions object exists
    if (!appState.misconceptions) {
        console.log('Initializing misconceptions object');
        appState.misconceptions = {
            lo1: [],
            lo2: [],
            lo3: []
        };
    }
    
    // Extract XML content
    const misconceptionsMatch = extractXML(response, 'Misconceptions');
    
    if (misconceptionsMatch) {
        appState.responseTags.misconceptions = misconceptionsMatch;
        
        // Extract misconceptions for each LO
        extractMisconceptions(misconceptionsMatch);
    }
    
    // Update button state
    document.getElementById('continueToPriorKnowledgeBtn').disabled = !misconceptionsMatch;
}

// Extract misconceptions from XML
function extractMisconceptions(xml) {
    // Ensure misconceptions object exists
    if (!appState.misconceptions) {
        console.log('Initializing misconceptions object in extractMisconceptions');
        appState.misconceptions = {
            lo1: [],
            lo2: [],
            lo3: []
        };
    }
    
    // Reset misconceptions arrays
    appState.misconceptions.lo1 = [];
    appState.misconceptions.lo2 = [];
    appState.misconceptions.lo3 = [];
    
    // Extract LO1 misconceptions
    const lo1MisconceptionsMatch = xml.match(/<LO1Misconceptions>([\s\S]*?)<\/LO1Misconceptions>/);
    if (lo1MisconceptionsMatch) {
        const misconceptions1 = lo1MisconceptionsMatch[1].match(/<Misconception\d+>([\s\S]*?)<\/Misconception\d+>/g);
        if (misconceptions1) {
            misconceptions1.forEach(misconception => {
                const content = misconception.match(/<Misconception\d+>([\s\S]*?)<\/Misconception\d+>/)[1].trim();
                appState.misconceptions.lo1.push(content);
            });
        }
    }
    
    // Extract LO2 misconceptions
    const lo2MisconceptionsMatch = xml.match(/<LO2Misconceptions>([\s\S]*?)<\/LO2Misconceptions>/);
    if (lo2MisconceptionsMatch) {
        const misconceptions2 = lo2MisconceptionsMatch[1].match(/<Misconception\d+>([\s\S]*?)<\/Misconception\d+>/g);
        if (misconceptions2) {
            misconceptions2.forEach(misconception => {
                const content = misconception.match(/<Misconception\d+>([\s\S]*?)<\/Misconception\d+>/)[1].trim();
                appState.misconceptions.lo2.push(content);
            });
        }
    }
    
    // Extract LO3 misconceptions if LO3 exists
    if (appState.learningObjectives.lo3.exists) {
        const lo3MisconceptionsMatch = xml.match(/<LO3Misconceptions>([\s\S]*?)<\/LO3Misconceptions>/);
        if (lo3MisconceptionsMatch) {
            const misconceptions3 = lo3MisconceptionsMatch[1].match(/<Misconception\d+>([\s\S]*?)<\/Misconception\d+>/g);
            if (misconceptions3) {
                misconceptions3.forEach(misconception => {
                    const content = misconception.match(/<Misconception\d+>([\s\S]*?)<\/Misconception\d+>/)[1].trim();
                    appState.misconceptions.lo3.push(content);
                });
            }
        }
    }
}

// Preview misconceptions response
function previewMisconceptionsResponse() {
    if (!appState.responses.misconceptions.trim()) {
        alert('Please paste Claude\'s response before previewing');
        return;
    }
    
    // Format the response for the formatted view
    const formattedResponseHtml = formatResponse(appState.responses.misconceptions, 'misconceptions');
    document.getElementById('misconceptionsFormattedResponse').innerHTML = formattedResponseHtml;
    
    // Format the XML for the tagged view
    const taggedResponseHtml = formatXML(appState.responses.misconceptions);
    document.getElementById('misconceptionsTaggedResponse').innerHTML = taggedResponseHtml;
    
    // Show the preview
    document.getElementById('misconceptionsPreview').style.display = 'block';
    
    // Display misconceptions for editing
    displayMisconceptionsForEditing();
}

// Display misconceptions for editing
function displayMisconceptionsForEditing() {
    // Clear existing lists
    document.getElementById('lo1MisconceptionsList').innerHTML = '';
    document.getElementById('lo2MisconceptionsList').innerHTML = '';
    document.getElementById('lo3MisconceptionsList').innerHTML = '';
    
    // Populate LO1 misconceptions
    appState.misconceptions.lo1.forEach(misconception => {
        const li = document.createElement('li');
        li.textContent = misconception;
        document.getElementById('lo1MisconceptionsList').appendChild(li);
    });
    
    // Populate LO2 misconceptions
    appState.misconceptions.lo2.forEach(misconception => {
        const li = document.createElement('li');
        li.textContent = misconception;
        document.getElementById('lo2MisconceptionsList').appendChild(li);
    });
    
    // Populate LO3 misconceptions if LO3 exists
    if (appState.learningObjectives.lo3.exists) {
        appState.misconceptions.lo3.forEach(misconception => {
            const li = document.createElement('li');
            li.textContent = misconception;
            document.getElementById('lo3MisconceptionsList').appendChild(li);
        });
        document.getElementById('lo3MisconceptionsContainer').style.display = 'block';
    } else {
        document.getElementById('lo3MisconceptionsContainer').style.display = 'none';
    }
    
    // Show the container
    document.getElementById('misconceptionsEditContainer').style.display = 'block';
}

// Open Misconceptions Edit Modal
function openMisconceptionsEditModal(loNumber) {
    appState.editState.currentLO = loNumber;
    
    // Set the LO number in the dropdown
    document.getElementById('editMisconceptionsLoNumber').value = loNumber;
    
    // Get the current misconceptions
    const misconceptions = appState.misconceptions[`lo${loNumber}`];
    
    // Create a copy for editing
    appState.editState.tempMisconceptions = [...misconceptions];
    
    // Clear the form and populate with current misconceptions
    const container = document.getElementById('misconceptionsEditList');
    container.innerHTML = '';
    
    appState.editState.tempMisconceptions.forEach((misconception, index) => {
        addMisconceptionToForm(misconception, index);
    });
    
    // Show the modal
    document.getElementById('misconceptionsEditModal').classList.add('active');
}

// Add misconception to edit form
function addMisconceptionToForm(misconception = '', index) {
    const container = document.getElementById('misconceptionsEditList');
    
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';
    formGroup.style.display = 'flex';
    formGroup.style.alignItems = 'center';
    
    const textarea = document.createElement('textarea');
    textarea.className = 'form-control misconception-input';
    textarea.setAttribute('data-index', index);
    textarea.style.flexGrow = '1';
    textarea.value = misconception;
    textarea.placeholder = 'Enter misconception';
    textarea.rows = 2;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-outline btn-sm';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.style.marginLeft = '0.5rem';
    deleteBtn.style.alignSelf = 'flex-start';
    deleteBtn.addEventListener('click', () => removeMisconception(index));
    
    formGroup.appendChild(textarea);
    formGroup.appendChild(deleteBtn);
    container.appendChild(formGroup);
}

// Add new misconception
function addNewMisconception() {
    appState.editState.tempMisconceptions.push('');
    addMisconceptionToForm('', appState.editState.tempMisconceptions.length - 1);
}

// Remove misconception
function removeMisconception(index) {
    // Remove from temporary array
    appState.editState.tempMisconceptions.splice(index, 1);
    
    // Rebuild the form
    const container = document.getElementById('misconceptionsEditList');
    container.innerHTML = '';
    
    appState.editState.tempMisconceptions.forEach((misconception, idx) => {
        addMisconceptionToForm(misconception, idx);
    });
}

// Save misconceptions changes
function saveMisconceptionsChanges() {
    const loNumber = appState.editState.currentLO;
    
    // Get values from form
    const inputs = document.querySelectorAll('.misconception-input');
    const misconceptions = [];
    
    inputs.forEach(input => {
        const value = input.value.trim();
        if (value) {
            misconceptions.push(value);
        }
    });
    
    // Update the state
    appState.misconceptions[`lo${loNumber}`] = misconceptions;
    
    // Update the display
    const list = document.getElementById(`lo${loNumber}MisconceptionsList`);
    list.innerHTML = '';
    
    misconceptions.forEach(misconception => {
        const li = document.createElement('li');
        li.textContent = misconception;
        list.appendChild(li);
    });
    
    // Close the modal
    closeModal('misconceptionsEditModal');
}

// STEP 1D: PRIOR KNOWLEDGE FUNCTIONS

// Display the content summary for Prior Knowledge substep
function displayPriorKnowledgeSubstepSummary() {
    console.log("Displaying Prior Knowledge Substep Summary");
    console.log("Current misconceptions:", appState.misconceptions);
    
    let html = '<h4>Learning Objectives & Misconceptions</h4>';
    
    // Check if learning objectives and misconceptions exist
    if (appState.learningObjectives && 
        appState.learningObjectives.lo1 && 
        appState.learningObjectives.lo1.title &&
        appState.loTypes &&
        appState.loTypes.lo1 &&
        appState.misconceptions &&
        appState.misconceptions.lo1) {
        
        // LO1
        html += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective 1</span>
                <span id="summaryLo1Badge" class="lo-badge ${appState.learningObjectives.lo1.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo1.hasPractical ? 'Practical' : 'Theory'}</span>
            </div>
            <p><strong>${appState.learningObjectives.lo1.title}</strong></p>
            <p>${appState.learningObjectives.lo1.description}</p>
            <div style="margin-top: 0.5rem;">
                <p><strong>Assessment Objective:</strong> ${appState.loTypes.lo1.aoCategory} - ${appState.loTypes.lo1.specificType}</p>
                <p><strong>Misconceptions:</strong></p>
                <ul>
                    ${appState.misconceptions.lo1.map(m => `<li>${m}</li>`).join('')}
                </ul>
            </div>
        </div>`;
        
        // LO2
        if (appState.learningObjectives.lo2 && 
            appState.learningObjectives.lo2.title &&
            appState.loTypes.lo2 &&
            appState.misconceptions.lo2) {
            
            html += `<div class="lo-container">
                <div class="lo-header">
                    <span>Learning Objective 2</span>
                    <span id="summaryLo2Badge" class="lo-badge ${appState.learningObjectives.lo2.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo2.hasPractical ? 'Practical' : 'Theory'}</span>
                </div>
                <p><strong>${appState.learningObjectives.lo2.title}</strong></p>
                <p>${appState.learningObjectives.lo2.description}</p>
                <div style="margin-top: 0.5rem;">
                    <p><strong>Assessment Objective:</strong> ${appState.loTypes.lo2.aoCategory} - ${appState.loTypes.lo2.specificType}</p>
                    <p><strong>Misconceptions:</strong></p>
                    <ul>
                        ${appState.misconceptions.lo2.map(m => `<li>${m}</li>`).join('')}
                    </ul>
                </div>
            </div>`;
        }
        
        // LO3 if it exists
        if (appState.learningObjectives.lo3 && 
            appState.learningObjectives.lo3.exists && 
            appState.learningObjectives.lo3.title &&
            appState.loTypes.lo3 &&
            appState.misconceptions.lo3) {
            
            html += `<div class="lo-container">
                <div class="lo-header">
                    <span>Learning Objective 3</span>
                    <span id="summaryLo3Badge" class="lo-badge ${appState.learningObjectives.lo3.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo3.hasPractical ? 'Practical' : 'Theory'}</span>
                </div>
                <p><strong>${appState.learningObjectives.lo3.title}</strong></p>
                <p>${appState.learningObjectives.lo3.description}</p>
                <div style="margin-top: 0.5rem;">
                    <p><strong>Assessment Objective:</strong> ${appState.loTypes.lo3.aoCategory} - ${appState.loTypes.lo3.specificType}</p>
                    <p><strong>Misconceptions:</strong></p>
                    <ul>
                        ${appState.misconceptions.lo3.map(m => `<li>${m}</li>`).join('')}
                    </ul>
                </div>
            </div>`;
        }
    } else {
        html = '<p>Please complete Steps 1A, 1B, and 1C first to see your learning objectives, types, and misconceptions here.</p>';
    }
    
    // Update the content
    const contentElement = document.getElementById('loDSummaryContent');
    if (contentElement) {
        contentElement.innerHTML = html;
    } else {
        console.error("Could not find loDSummaryContent element");
    }
}

// Generate prior knowledge prompt
function generatePriorKnowledgePrompt() {
    if (!appState.responseTags.learningObjectives || !appState.responseTags.loTypes || !appState.responseTags.misconceptions) {
        alert('Please complete the previous steps first');
        return;
    }

    // Add information about practical components
    let practicalInfo = '\n\nPractical Information:\n';
    practicalInfo += `LO1 Has Practical Component: ${appState.learningObjectives.lo1.hasPractical ? 'Yes' : 'No'}\n`;
    practicalInfo += `LO2 Has Practical Component: ${appState.learningObjectives.lo2.hasPractical ? 'Yes' : 'No'}\n`;
    if (appState.learningObjectives.lo3.exists) {
        practicalInfo += `LO3 Has Practical Component: ${appState.learningObjectives.lo3.hasPractical ? 'Yes' : 'No'}\n`;
    }
    
    const prompt = `Based on the lesson overview, learning objective types, and misconceptions I provided earlier, I need you to identify the essential prior knowledge students must possess for each learning objective.

Here's the lesson overview:
${appState.responseTags.lessonInfo}

${appState.responseTags.learningObjectives}
${practicalInfo}

Here are the learning objective types:
${appState.responseTags.loTypes}

Here are the identified misconceptions:
${appState.responseTags.misconceptions}

For each learning objective, identify 2-4 specific pieces of prior knowledge that students must already understand before they can successfully engage with this learning objective. For any learning objectives with practical components, be sure to include at least one prior knowledge item related to practical skills or safety.

FORMAT YOUR RESPONSE USING THIS EXACT XML STRUCTURE:

<PriorKnowledge>
<LO1PriorKnowledge>
<Knowledge1>[Brief description of first essential prior knowledge item for LO1]</Knowledge1>
<Knowledge2>[Brief description of second essential prior knowledge item for LO1]</Knowledge2>
<Knowledge3>[Optional third prior knowledge item for LO1]</Knowledge3>
<Knowledge4>[Optional fourth prior knowledge item for LO1]</Knowledge4>
</LO1PriorKnowledge>

<LO2PriorKnowledge>
<Knowledge1>[Brief description of first essential prior knowledge item for LO2]</Knowledge1>
<Knowledge2>[Brief description of second essential prior knowledge item for LO2]</Knowledge2>
<Knowledge3>[Optional third prior knowledge item for LO2]</Knowledge3>
<Knowledge4>[Optional fourth prior knowledge item for LO2]</Knowledge4>
</LO2PriorKnowledge>

<!-- Include LO3 only if there was a third learning objective in the overview -->
<LO3PriorKnowledge>
<Knowledge1>[Brief description of first essential prior knowledge item for LO3]</Knowledge1>
<Knowledge2>[Brief description of second essential prior knowledge item for LO3]</Knowledge2>
<Knowledge3>[Optional third prior knowledge item for LO3]</Knowledge3>
<Knowledge4>[Optional fourth prior knowledge item for LO3]</Knowledge4>
</LO3PriorKnowledge>
</PriorKnowledge>

IMPORTANT: I need your response in two parts:
1. First, give me a clear, readable version of the response formatted for easy scanning
2. Then, provide the XML-tagged version exactly as specified above (this is what I'll use in subsequent steps)`;

    // Set prompt in textarea
    document.getElementById('priorKnowledgePromptTextarea').value = prompt;
}

// Handle prior knowledge response
function handlePriorKnowledgeResponse(e) {
    const response = e.target.value;
    appState.responses.priorKnowledge = response;
	// Ensure priorKnowledge object exists
	 if (!appState.priorKnowledge) {
		 console.log('Initializing priorKnowledge object');
		 appState.priorKnowledge = {
			 lo1: [],
			 lo2: [],
			 lo3: []
		 };
	 }
    
    // Extract XML content
    const priorKnowledgeMatch = extractXML(response, 'PriorKnowledge');
    
    if (priorKnowledgeMatch) {
        appState.responseTags.priorKnowledge = priorKnowledgeMatch;
        
        // Extract prior knowledge for each LO
        extractPriorKnowledge(priorKnowledgeMatch);
    }
    
    // Update button state
    document.getElementById('continueToReviewBtn').disabled = !priorKnowledgeMatch;
}

// Extract prior knowledge from XML
function extractPriorKnowledge(xml) {
    // Ensure priorKnowledge object exists
	 if (!appState.priorKnowledge) {
		 console.log('Initializing priorKnowledge object in extractPriorKnowledge');
		 appState.priorKnowledge = {
			 lo1: [],
			 lo2: [],
			 lo3: []
		 };
	 }
	 
	// Reset prior knowledge arrays
    appState.priorKnowledge.lo1 = [];
    appState.priorKnowledge.lo2 = [];
    appState.priorKnowledge.lo3 = [];
    
    // Extract LO1 prior knowledge
    const lo1PriorKnowledgeMatch = xml.match(/<LO1PriorKnowledge>([\s\S]*?)<\/LO1PriorKnowledge>/);
    if (lo1PriorKnowledgeMatch) {
        const knowledge1 = lo1PriorKnowledgeMatch[1].match(/<Knowledge\d+>([\s\S]*?)<\/Knowledge\d+>/g);
        if (knowledge1) {
            knowledge1.forEach(knowledge => {
                const content = knowledge.match(/<Knowledge\d+>([\s\S]*?)<\/Knowledge\d+>/)[1].trim();
                appState.priorKnowledge.lo1.push(content);
            });
        }
    }
    
    // Extract LO2 prior knowledge
    const lo2PriorKnowledgeMatch = xml.match(/<LO2PriorKnowledge>([\s\S]*?)<\/LO2PriorKnowledge>/);
    if (lo2PriorKnowledgeMatch) {
        const knowledge2 = lo2PriorKnowledgeMatch[1].match(/<Knowledge\d+>([\s\S]*?)<\/Knowledge\d+>/g);
        if (knowledge2) {
            knowledge2.forEach(knowledge => {
                const content = knowledge.match(/<Knowledge\d+>([\s\S]*?)<\/Knowledge\d+>/)[1].trim();
                appState.priorKnowledge.lo2.push(content);
            });
        }
    }
    
    // Extract LO3 prior knowledge if LO3 exists
    if (appState.learningObjectives.lo3.exists) {
        const lo3PriorKnowledgeMatch = xml.match(/<LO3PriorKnowledge>([\s\S]*?)<\/LO3PriorKnowledge>/);
        if (lo3PriorKnowledgeMatch) {
            const knowledge3 = lo3PriorKnowledgeMatch[1].match(/<Knowledge\d+>([\s\S]*?)<\/Knowledge\d+>/g);
            if (knowledge3) {
                knowledge3.forEach(knowledge => {
                    const content = knowledge.match(/<Knowledge\d+>([\s\S]*?)<\/Knowledge\d+>/)[1].trim();
                    appState.priorKnowledge.lo3.push(content);
                });
            }
        }
    }
}

// Preview prior knowledge response
function previewPriorKnowledgeResponse() {
    if (!appState.responses.priorKnowledge.trim()) {
        alert('Please paste Claude\'s response before previewing');
        return;
    }
    
    // Format the response for the formatted view
    const formattedResponseHtml = formatResponse(appState.responses.priorKnowledge, 'priorKnowledge');
    document.getElementById('priorKnowledgeFormattedResponse').innerHTML = formattedResponseHtml;
    
    // Format the XML for the tagged view
    const taggedResponseHtml = formatXML(appState.responses.priorKnowledge);
    document.getElementById('priorKnowledgeTaggedResponse').innerHTML = taggedResponseHtml;
    
    // Show the preview
    document.getElementById('priorKnowledgePreview').style.display = 'block';
    
    // Display prior knowledge for editing
    displayPriorKnowledgeForEditing();
}

// Display prior knowledge for editing
function displayPriorKnowledgeForEditing() {
    // Clear existing lists
    document.getElementById('lo1PriorKnowledgeList').innerHTML = '';
    document.getElementById('lo2PriorKnowledgeList').innerHTML = '';
    document.getElementById('lo3PriorKnowledgeList').innerHTML = '';
    
    // Populate LO1 prior knowledge
    appState.priorKnowledge.lo1.forEach(knowledge => {
        const li = document.createElement('li');
        li.textContent = knowledge;
        document.getElementById('lo1PriorKnowledgeList').appendChild(li);
    });
    
    // Populate LO2 prior knowledge
    appState.priorKnowledge.lo2.forEach(knowledge => {
        const li = document.createElement('li');
        li.textContent = knowledge;
        document.getElementById('lo2PriorKnowledgeList').appendChild(li);
    });
    
    // Populate LO3 prior knowledge if LO3 exists
    if (appState.learningObjectives.lo3.exists) {
        appState.priorKnowledge.lo3.forEach(knowledge => {
            const li = document.createElement('li');
            li.textContent = knowledge;
            document.getElementById('lo3PriorKnowledgeList').appendChild(li);
        });
        document.getElementById('lo3PriorKnowledgeContainer').style.display = 'block';
    } else {
        document.getElementById('lo3PriorKnowledgeContainer').style.display = 'none';
    }
    
    // Show the container
    document.getElementById('priorKnowledgeEditContainer').style.display = 'block';
}

// Open Prior Knowledge Edit Modal
function openPriorKnowledgeEditModal(loNumber) {
    appState.editState.currentLO = loNumber;
    
    // Set the LO number in the dropdown
    document.getElementById('editPriorKnowledgeLoNumber').value = loNumber;
    
    // Get the current prior knowledge items
    const priorKnowledge = appState.priorKnowledge[`lo${loNumber}`];
    
    // Create a copy for editing
    appState.editState.tempPriorKnowledge = [...priorKnowledge];
    
    // Clear the form and populate with current prior knowledge items
    const container = document.getElementById('priorKnowledgeEditList');
    container.innerHTML = '';
    
    appState.editState.tempPriorKnowledge.forEach((knowledge, index) => {
        addPriorKnowledgeToForm(knowledge, index);
    });
    
    // Show the modal
    document.getElementById('priorKnowledgeEditModal').classList.add('active');
}

// Add prior knowledge item to edit form
function addPriorKnowledgeToForm(knowledge = '', index) {
    const container = document.getElementById('priorKnowledgeEditList');
    
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';
    formGroup.style.display = 'flex';
    formGroup.style.alignItems = 'center';
    
    const textarea = document.createElement('textarea');
    textarea.className = 'form-control prior-knowledge-input';
    textarea.setAttribute('data-index', index);
    textarea.style.flexGrow = '1';
    textarea.value = knowledge;
    textarea.placeholder = 'Enter prior knowledge item';
    textarea.rows = 2;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-outline btn-sm';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.style.marginLeft = '0.5rem';
    deleteBtn.style.alignSelf = 'flex-start';
    deleteBtn.addEventListener('click', () => removePriorKnowledgeItem(index));
    
    formGroup.appendChild(textarea);
    formGroup.appendChild(deleteBtn);
    container.appendChild(formGroup);
}

// Add new prior knowledge item
function addNewPriorKnowledgeItem() {
    appState.editState.tempPriorKnowledge.push('');
    addPriorKnowledgeToForm('', appState.editState.tempPriorKnowledge.length - 1);
}

// Remove prior knowledge item
function removePriorKnowledgeItem(index) {
    // Remove from temporary array
    appState.editState.tempPriorKnowledge.splice(index, 1);
    
    // Rebuild the form
    const container = document.getElementById('priorKnowledgeEditList');
    container.innerHTML = '';
    
    appState.editState.tempPriorKnowledge.forEach((knowledge, idx) => {
        addPriorKnowledgeToForm(knowledge, idx);
    });
}

// Save prior knowledge changes
function savePriorKnowledgeChanges() {
    const loNumber = appState.editState.currentLO;
    
    // Get values from form
    const inputs = document.querySelectorAll('.prior-knowledge-input');
    const priorKnowledge = [];
    
    inputs.forEach(input => {
        const value = input.value.trim();
        if (value) {
            priorKnowledge.push(value);
        }
    });
    
    // Update the state
    appState.priorKnowledge[`lo${loNumber}`] = priorKnowledge;
    
    // Update the display
    const list = document.getElementById(`lo${loNumber}PriorKnowledgeList`);
    list.innerHTML = '';
    
    priorKnowledge.forEach(knowledge => {
        const li = document.createElement('li');
        li.textContent = knowledge;
        list.appendChild(li);
    });
    
    // Close the modal
    closeModal('priorKnowledgeEditModal');
}

// STEP 1E: REVIEW & EDIT

// Update Step 1E: Review & Edit
function updateStep1Review() {
    console.log("Updating Step 1 Review with current state:");
    console.log("Lesson Info:", appState.lessonInfo);
    console.log("Learning Objectives:", appState.learningObjectives);
    console.log("LO Types:", appState.loTypes);
    console.log("Misconceptions:", appState.misconceptions);
    console.log("Prior Knowledge:", appState.priorKnowledge);
    console.log("Response Tags:", appState.responseTags);

    // Lesson Information
    let lessonInfoHtml = `<h4>Lesson Information</h4>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray); width: 30%;"><strong>Subject:</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);">${appState.lessonInfo.subject || 'Not set'}</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);"><strong>Topic:</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);">${appState.lessonInfo.topic || 'Not set'}</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);"><strong>Exam Board:</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);">${appState.lessonInfo.provider || 'Not set'}</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);"><strong>Course:</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);">${appState.lessonInfo.course || 'Not set'}</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);"><strong>Level:</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);">${appState.lessonInfo.level || 'Not set'}</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);"><strong>Student Ability:</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);">${appState.lessonInfo.ability || 'Not set'}</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);"><strong>Lesson Number:</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);">${appState.lessonInfo.lessonNumber || 'Not set'}</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);"><strong>Lesson Title:</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);">${appState.lessonInfo.lessonTitle || 'Not set'}</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem;"><strong>Additional Info:</strong></td>
                <td style="padding: 0.5rem;">${appState.lessonInfo.description || 'None'}</td>
            </tr>
        </table>`;
    
    document.getElementById('lessonInfoReview').innerHTML = lessonInfoHtml;
    
    // Learning Objectives
    let loHtml = '';
    
    if (appState.learningObjectives && appState.learningObjectives.lo1 && appState.learningObjectives.lo1.title) {
        // LO1
        loHtml += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective 1</span>
                <span class="lo-badge ${appState.learningObjectives.lo1.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo1.hasPractical ? 'Practical' : 'Theory'}</span>
            </div>
            <p><strong>${appState.learningObjectives.lo1.title}</strong></p>
            <p>${appState.learningObjectives.lo1.description}</p>
        </div>`;
        
        // LO2
        if (appState.learningObjectives.lo2 && appState.learningObjectives.lo2.title) {
            loHtml += `<div class="lo-container">
                <div class="lo-header">
                    <span>Learning Objective 2</span>
                    <span class="lo-badge ${appState.learningObjectives.lo2.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo2.hasPractical ? 'Practical' : 'Theory'}</span>
                </div>
                <p><strong>${appState.learningObjectives.lo2.title}</strong></p>
                <p>${appState.learningObjectives.lo2.description}</p>
            </div>`;
        }
        
        // LO3 if it exists
        if (appState.learningObjectives.lo3 && appState.learningObjectives.lo3.exists && appState.learningObjectives.lo3.title) {
            loHtml += `<div class="lo-container">
                <div class="lo-header">
                    <span>Learning Objective 3</span>
                    <span class="lo-badge ${appState.learningObjectives.lo3.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo3.hasPractical ? 'Practical' : 'Theory'}</span>
                </div>
                <p><strong>${appState.learningObjectives.lo3.title}</strong></p>
                <p>${appState.learningObjectives.lo3.description}</p>
            </div>`;
        }
    } else {
        loHtml = '<p>Learning objectives not available. Please complete Step 1A first.</p>';
    }
    
    document.getElementById('learningObjectivesReview').innerHTML = loHtml;
    
    // Learning Objective Types
    let loTypesHtml = '';
    
    if (appState.loTypes && appState.loTypes.lo1 && appState.loTypes.lo1.aoCategory) {
        // LO1 Types
        loTypesHtml += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective 1 Types</span>
            </div>
            <p><strong>Assessment Objective:</strong> ${appState.loTypes.lo1.aoCategory}</p>
            <p><strong>Specific Type:</strong> ${appState.loTypes.lo1.specificType}</p>
            <p><strong>Justification:</strong> ${appState.loTypes.lo1.justification}</p>
        </div>`;
        
        // LO2 Types
        if (appState.loTypes.lo2 && appState.loTypes.lo2.aoCategory) {
            loTypesHtml += `<div class="lo-container">
                <div class="lo-header">
                    <span>Learning Objective 2 Types</span>
                </div>
                <p><strong>Assessment Objective:</strong> ${appState.loTypes.lo2.aoCategory}</p>
                <p><strong>Specific Type:</strong> ${appState.loTypes.lo2.specificType}</p>
                <p><strong>Justification:</strong> ${appState.loTypes.lo2.justification}</p>
            </div>`;
        }
        
        // LO3 Types if LO3 exists
        if (appState.learningObjectives.lo3 && appState.learningObjectives.lo3.exists && 
            appState.loTypes.lo3 && appState.loTypes.lo3.aoCategory) {
            loTypesHtml += `<div class="lo-container">
                <div class="lo-header">
                    <span>Learning Objective 3 Types</span>
                </div>
                <p><strong>Assessment Objective:</strong> ${appState.loTypes.lo3.aoCategory}</p>
                <p><strong>Specific Type:</strong> ${appState.loTypes.lo3.specificType}</p>
                <p><strong>Justification:</strong> ${appState.loTypes.lo3.justification}</p>
            </div>`;
        }
    } else {
        loTypesHtml = '<p>Learning objective types not available. Please complete Step 1B first.</p>';
    }
    
    document.getElementById('loTypesReview').innerHTML = loTypesHtml;
    
    // Misconceptions
    let misconceptionsHtml = '';
    
    if (appState.misconceptions && appState.misconceptions.lo1 && appState.misconceptions.lo1.length > 0) {
        // LO1 Misconceptions
        misconceptionsHtml += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective 1 Misconceptions</span>
            </div>
            <ul>
                ${appState.misconceptions.lo1.map(m => `<li>${m}</li>`).join('')}
            </ul>
        </div>`;
        
        // LO2 Misconceptions
        if (appState.misconceptions.lo2 && appState.misconceptions.lo2.length > 0) {
            misconceptionsHtml += `<div class="lo-container">
                <div class="lo-header">
                    <span>Learning Objective 2 Misconceptions</span>
                </div>
                <ul>
                    ${appState.misconceptions.lo2.map(m => `<li>${m}</li>`).join('')}
                </ul>
            </div>`;
        }
        
        // LO3 Misconceptions if LO3 exists
        if (appState.learningObjectives.lo3 && appState.learningObjectives.lo3.exists && 
            appState.misconceptions.lo3 && appState.misconceptions.lo3.length > 0) {
            misconceptionsHtml += `<div class="lo-container">
                <div class="lo-header">
                    <span>Learning Objective 3 Misconceptions</span>
                </div>
                <ul>
                    ${appState.misconceptions.lo3.map(m => `<li>${m}</li>`).join('')}
                </ul>
            </div>`;
        }
    } else {
        misconceptionsHtml = '<p>Misconceptions not available. Please complete Step 1C first.</p>';
    }
    
    document.getElementById('misconceptionsReview').innerHTML = misconceptionsHtml;
    
    // Prior Knowledge
    let priorKnowledgeHtml = '';
    
    if (appState.priorKnowledge && appState.priorKnowledge.lo1 && appState.priorKnowledge.lo1.length > 0) {
        // LO1 Prior Knowledge
        priorKnowledgeHtml += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective 1 Prior Knowledge</span>
            </div>
            <ul>
                ${appState.priorKnowledge.lo1.map(pk => `<li>${pk}</li>`).join('')}
            </ul>
        </div>`;
        
        // LO2 Prior Knowledge
        if (appState.priorKnowledge.lo2 && appState.priorKnowledge.lo2.length > 0) {
            priorKnowledgeHtml += `<div class="lo-container">
                <div class="lo-header">
                    <span>Learning Objective 2 Prior Knowledge</span>
                </div>
                <ul>
                    ${appState.priorKnowledge.lo2.map(pk => `<li>${pk}</li>`).join('')}
                </ul>
            </div>`;
        }
        
        // LO3 Prior Knowledge if LO3 exists
        if (appState.learningObjectives.lo3 && appState.learningObjectives.lo3.exists && 
            appState.priorKnowledge.lo3 && appState.priorKnowledge.lo3.length > 0) {
            priorKnowledgeHtml += `<div class="lo-container">
                <div class="lo-header">
                    <span>Learning Objective 3 Prior Knowledge</span>
                </div>
                <ul>
                    ${appState.priorKnowledge.lo3.map(pk => `<li>${pk}</li>`).join('')}
                </ul>
            </div>`;
        }
    } else {
        priorKnowledgeHtml = '<p>Prior knowledge not available. Please complete Step 1D first.</p>';
    }
    
    document.getElementById('priorKnowledgeReview').innerHTML = priorKnowledgeHtml;
    
    // Enable the finish button if all data is present, otherwise provide guidance
    const allComplete = 
        appState.responses.overview && 
        appState.responses.loTypes && 
        appState.responses.misconceptions && 
        appState.responses.priorKnowledge;
    
    document.getElementById('finishStep1Btn').disabled = !allComplete;
    
    if (!allComplete) {
        // Add warning message to inform the user what's missing
        let warningHtml = '<div class="alert alert-warning" style="margin-top: 1rem;">';
        warningHtml += '<p><strong>Missing information:</strong></p><ul>';
        
        if (!appState.responses.overview) warningHtml += '<li>Learning Objectives (Step 1A)</li>';
        if (!appState.responses.loTypes) warningHtml += '<li>Learning Objective Types (Step 1B)</li>';
        if (!appState.responses.misconceptions) warningHtml += '<li>Misconceptions (Step 1C)</li>';
        if (!appState.responses.priorKnowledge) warningHtml += '<li>Prior Knowledge (Step 1D)</li>';
        
        warningHtml += '</ul><p>Please complete the missing steps before continuing to Step 2.</p></div>';
        
        // Add warning after the button
        const finishBtn = document.getElementById('finishStep1Btn');
        let warningDiv = document.getElementById('step1ReviewWarning');
        
        if (!warningDiv) {
            warningDiv = document.createElement('div');
            warningDiv.id = 'step1ReviewWarning';
            finishBtn.parentNode.parentNode.appendChild(warningDiv);
        }
        
        warningDiv.innerHTML = warningHtml;
    } else {
        // Remove warning if it exists
        const warningDiv = document.getElementById('step1ReviewWarning');
        if (warningDiv) warningDiv.remove();
    }
}

// Add this code at the end of your app.js file

(function() {
    // Add a button to the top of the LO Types section to debug the state
    const interval = setInterval(function() {
        const loBSummaryContent = document.getElementById('loBSummaryContent');
        if (loBSummaryContent) {
            // Check if debug button already exists
            if (!document.getElementById('debugLOStateBtn')) {
                // Create a debug button
                const debugBtn = document.createElement('button');
                debugBtn.id = 'debugLOStateBtn';
                debugBtn.className = 'btn btn-outline btn-sm';
                debugBtn.style.marginBottom = '1rem';
                debugBtn.textContent = 'Debug LO State';
                debugBtn.addEventListener('click', debugLearningObjectives);
                
                // Insert at the top of the content
                loBSummaryContent.parentNode.insertBefore(debugBtn, loBSummaryContent);
            }
            clearInterval(interval);
        }
    }, 1000);
    
    // Function to debug learning objectives
    window.debugLearningObjectives = function() {
        console.log('Current learning objectives state:', JSON.stringify(appState.learningObjectives, null, 2));
        
        // Show an alert with the current state
        alert(
            'Learning Objectives Status:\n\n' +
            'LO1 Title: ' + appState.learningObjectives.lo1.title + '\n' +
            'LO1 Practical: ' + appState.learningObjectives.lo1.hasPractical + '\n\n' +
            'LO2 Title: ' + appState.learningObjectives.lo2.title + '\n' +
            'LO2 Practical: ' + appState.learningObjectives.lo2.hasPractical + '\n\n' +
            (appState.learningObjectives.lo3.exists ? 
                'LO3 Title: ' + appState.learningObjectives.lo3.title + '\n' +
                'LO3 Practical: ' + appState.learningObjectives.lo3.hasPractical + '\n\n' : '') +
            'Count: ' + appState.learningObjectives.count
        );
        
        // Try to refresh the display
        if (typeof displayLOTypesSubstepSummary === 'function') {
            displayLOTypesSubstepSummary();
            console.log('Called displayLOTypesSubstepSummary');
        } else if (typeof window.displayLOTypesSubstepSummary === 'function') {
            window.displayLOTypesSubstepSummary();
            console.log('Called window.displayLOTypesSubstepSummary');
        } else {
            console.warn('displayLOTypesSubstepSummary function not found');
        }
    };
    
    // Make displayLOTypesSubstepSummary globally available
    if (typeof displayLOTypesSubstepSummary === 'function' && typeof window.displayLOTypesSubstepSummary === 'undefined') {
        window.displayLOTypesSubstepSummary = displayLOTypesSubstepSummary;
        console.log('Made displayLOTypesSubstepSummary globally available');
    }
    
    console.log('Added LO debugging tools');
})();

// Add this function to help debug app state
function debugAppState() {
    console.group('Current App State');
    console.log('Current Step:', appState.currentMainStep, appState.currentSubStep);
    console.log('Learning Objectives:', appState.learningObjectives);
    console.log('LO Types:', appState.loTypes);
    console.log('Response - Overview:', appState.responses.overview ? 'Present' : 'Not present');
    console.log('Response - LOTypes:', appState.responses.loTypes ? 'Present' : 'Not present');
    console.log('Response Tags - LearningObjectives:', appState.responseTags.learningObjectives ? 'Present' : 'Not present');
    console.log('Response Tags - LOTypes:', appState.responseTags.loTypes ? 'Present' : 'Not present');
    console.groupEnd();
}

// Add a debug button in the UI
(function() {
    const interval = setInterval(function() {
        const header = document.querySelector('.app-header');
        if (header && !document.getElementById('debugStateBtn')) {
            const debugBtn = document.createElement('button');
            debugBtn.id = 'debugStateBtn';
            debugBtn.className = 'btn btn-sm';
            debugBtn.style.position = 'absolute';
            debugBtn.style.right = '10px';
            debugBtn.style.top = '10px';
            debugBtn.textContent = 'Debug State';
            debugBtn.addEventListener('click', debugAppState);
            header.appendChild(debugBtn);
            clearInterval(interval);
        }
    }, 1000);
})();
