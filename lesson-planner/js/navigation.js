// Toggle main step expansion
window.toggleMainStep = function(stepNumber) {
    console.log('Toggling main step', stepNumber);
    const stepIndex = stepNumber - 1;
    const mainStep = document.getElementById(`mainStep${stepNumber}`);
    const mainStepContent = document.getElementById(`mainStepContent${stepNumber}`);
    
    if (!mainStep || !mainStepContent) {
        console.error(`Could not find main step ${stepNumber} elements`);
        return;
    }
    
    if (mainStep.classList.contains('expanded')) {
        mainStep.classList.remove('expanded');
        mainStepContent.style.height = '0';
        appState.mainStepExpanded[stepIndex] = false;
    } else {
        mainStep.classList.add('expanded');
        mainStepContent.style.height = 'auto';
        appState.mainStepExpanded[stepIndex] = true;
    }
}

// Scroll the substep navigation
window.scrollSubstepNav = function(direction) {
    const currentStep = appState.currentMainStep;
    const nav = document.querySelector(`.main-step-${currentStep} .substeps-nav`);
    
    if (!nav) return;
    
    const scrollAmount = 200; // Pixels to scroll
    
    if (direction === 'left') {
        nav.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        nav.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// Handle navigation scroll indicators
function checkSubstepNavScroll() {
    document.querySelectorAll('.substeps-nav').forEach(nav => {
        const hasScrollbar = nav.scrollWidth > nav.clientWidth;
        
        // Get the left and right scroll indicators
        const leftIndicator = nav.querySelector('.nav-scroll-left');
        const rightIndicator = nav.querySelector('.nav-scroll-right');
        
        // Show/hide indicators based on presence of scrollbar
        if (hasScrollbar) {
            if (leftIndicator) leftIndicator.style.display = 'flex';
            if (rightIndicator) rightIndicator.style.display = 'flex';
        } else {
            if (leftIndicator) leftIndicator.style.display = 'none';
            if (rightIndicator) rightIndicator.style.display = 'none';
        }
    });
}

// Switch to a specific substep
window.switchSubstep = function(mainStep, subStep) {
    console.log('Switching to substep', mainStep, subStep);
    
    // Update state
    appState.currentMainStep = mainStep;
    appState.currentSubStep = subStep;
    
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
        appState.mainStepExpanded[mainStep - 1] = true;
    }
    
    // Update substep tabs
    document.querySelectorAll('.substep-tab').forEach(tab => {
        if (tab.getAttribute('data-step') == mainStep && tab.getAttribute('data-substep') == subStep) {
            tab.classList.add('active');
            // Make sure the active tab is visible (scroll to it if necessary)
            const nav = tab.closest('.substeps-nav');
            if (nav) {
                const tabRect = tab.getBoundingClientRect();
                const navRect = nav.getBoundingClientRect();
                
                // Check if tab is not fully visible
                if (tabRect.left < navRect.left || tabRect.right > navRect.right) {
                    tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }
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
    
    // Prepare content for specific substeps - Step 1
    if (mainStep === 1) {
        if (subStep === 'B') {
            prepareLOTypesSubstep();
        } else if (subStep === 'C') {
            prepareMisconceptionsSubstep();
        } else if (subStep === 'D') {
            preparePriorKnowledgeSubstep();
        } else if (subStep === 'E') {
            prepareReviewSubstep();
        }
    }
    
    // Prepare content for specific substeps - Step 1
    if (mainStep === 1) {
        if (subStep === 'B') {
            prepareLOTypesSubstep();
        } else if (subStep === 'C') {
            prepareMisconceptionsSubstep();
        } else if (subStep === 'D') {
            preparePriorKnowledgeSubstep();
        } else if (subStep === 'E') {
            prepareReviewSubstep();
        }
    }
    
    // Prepare content for specific substeps - Step 2
    if (mainStep === 2) {
        if (subStep === 'A') {
            prepareFrameworksSubstep();
        } else if (subStep === 'B') {
            prepareExamTechniquesSubstep();
        } else if (subStep === 'C') {
            prepareLessonStructureSubstep();
        } else if (subStep === 'D') {
            preparePracticalRequirementsSubstep();
        } else if (subStep === 'E') {
            prepareFrayerModelSubstep();
        } else if (subStep === 'F') {
            prepareStep2ReviewSubstep();
        }
    }
    
	// Prepare content for specific substeps - Step 3
	if (mainStep === 3) {
		if (subStep === 'A') {
			prepareRetrievalPracticeSubstep();
		} else if (subStep === 'B') {
			prepareTeachingInputSubstep();
		} else if (subStep === 'C') {
			prepareFormativeAssessmentSubstep();
		} else if (subStep === 'D') {
			prepareSlideReviewSubstep();
		}
	}
	
	// Prepare content for specific substeps - Step 4
    if (mainStep === 4) {
        if (subStep === 'A') {
            prepareReferenceMaterialsSubstep();
        } else if (subStep === 'B') {
            prepareRetrievalWorksheetSubstep();
        } else if (subStep === 'C') {
            prepareScaleQuestionsSubstep();
        } else if (subStep === 'D') {
            prepareApplicationQuestionsSubstep();
        } else if (subStep === 'E') {
            prepareExamTechniqueQuestionsSubstep();
        } else if (subStep === 'F') {
            prepareExamStyleQuestionsSubstep();
        } else if (subStep === 'G') {
            prepareWorksheetFinalizationSubstep();
        }
    }
	
    // Scroll to top of the main step
    mainStepElement.scrollIntoView({ behavior: 'smooth' });
    
    // Check if we need to show scroll indicators
    checkSubstepNavScroll();
}

// Update step indicators
function updateStepIndicators() {
    // Update main step status
    document.querySelectorAll('.main-step-status').forEach((statusElement, index) => {
        const stepNumber = index + 1;
        
        if (stepNumber < appState.currentMainStep) {
            statusElement.className = 'main-step-status status-completed';
            statusElement.textContent = 'Completed';
        } else if (stepNumber === appState.currentMainStep) {
            statusElement.className = 'main-step-status status-in-progress';
            statusElement.textContent = 'In Progress';
        } else {
            statusElement.className = 'main-step-status status-not-started';
            statusElement.textContent = 'Not Started';
        }
    });
}

// Prepare LO Types Substep
function prepareLOTypesSubstep() {
    // Display the current learning objectives
    displayLOTypesSubstepSummary();
}

// Prepare Misconceptions Substep
function prepareMisconceptionsSubstep() {
    // Display the current learning objectives and types
    displayMisconceptionsSubstepSummary();
}

// Prepare Prior Knowledge Substep
function preparePriorKnowledgeSubstep() {
    // Display the current learning objectives and misconceptions
    displayPriorKnowledgeSubstepSummary();
}

// Prepare Review Substep
function prepareReviewSubstep() {
    // Display all components for review
    updateStep1Review();
}

// Finish Step 1 and move to Step 2
function finishStep1() {
    // Make sure we have all the needed data
    if (!appState.responseTags.learningObjectives || !appState.responseTags.loTypes || 
        !appState.responseTags.misconceptions || !appState.responseTags.priorKnowledge) {
        alert('Please complete all substeps before continuing to Step 2');
        return;
    }
    
    // Update main step status
    appState.currentMainStep = 2;
    appState.currentSubStep = 'A';
    updateStepIndicators();
    
    // Update Step 1 status
    document.querySelector('.main-step-1 .main-step-status').className = 'main-step-status status-completed';
    document.querySelector('.main-step-1 .main-step-status').textContent = 'Completed';
    
    // Update Step 2 status
    document.querySelector('.main-step-2 .main-step-status').className = 'main-step-status status-in-progress';
    document.querySelector('.main-step-2 .main-step-status').textContent = 'In Progress';
    
    // Initialize Step 2A content
    initializeStep2();
    
    // Switch to Step 2A
    switchSubstep(2, 'A');
}

// Finish Step 2 and move to Step 3
function finishStep2() {
    // Update main step status
    appState.currentMainStep = 3;
    appState.currentSubStep = 'A';
    updateStepIndicators();
    
    // Update Step 2 status
    document.querySelector('.main-step-2 .main-step-status').className = 'main-step-status status-completed';
    document.querySelector('.main-step-2 .main-step-status').textContent = 'Completed';
    
    // Update Step 3 status
    document.querySelector('.main-step-3 .main-step-status').className = 'main-step-status status-in-progress';
    document.querySelector('.main-step-3 .main-step-status').textContent = 'In Progress';
    
    // Initialize Step 3 content (placeholder for now)
    const step3Content = document.getElementById('mainStepContent3');
    
    step3Content.innerHTML = `
    <div class="main-step-inner">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Slide Generation</h3>
            </div>
            <div class="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <div>
                    <p><strong>Step 2 completed successfully!</strong></p>
                    <p>You have now defined your teaching approach. Step 3 (Slide Generation) will be available in the next version of the application.</p>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Toggle to show Step 3
    if (!appState.mainStepExpanded[2]) {
        toggleMainStep(3);
    }
    
    // Scroll to Step 3
    document.getElementById('mainStep3').scrollIntoView({ behavior: 'smooth' });
// Prepare Retrieval Practice Substep
function prepareRetrievalPracticeSubstep() {
    initializeStep3A();
}

// Prepare Teaching Input Substep
function prepareTeachingInputSubstep() {
    initializeStep3B();
}

// Prepare Formative Assessment Substep
function prepareFormativeAssessmentSubstep() {
    initializeStep3C();
}

// Prepare Slide Review Substep
function prepareSlideReviewSubstep() {
    initializeStep3D();
}

// Initialize Step 3
function initializeStep3() {
    // Set up the substep navigation and content
    const step3Content = document.getElementById('mainStepContent3');
    
    step3Content.innerHTML = `
    <div class="main-step-inner">
        <!-- Substeps Navigation -->
        <div class="substeps-nav">
            <div class="nav-scroll-indicator nav-scroll-left" onclick="scrollSubstepNav('left')">◀</div>
            <div class="substep-tab active" data-step="3" data-substep="A" onclick="switchSubstep(3, 'A')">3A: Retrieval Practice</div>
            <div class="substep-tab" data-step="3" data-substep="B" onclick="switchSubstep(3, 'B')">3B: Teaching Input</div>
            <div class="substep-tab" data-step="3" data-substep="C" onclick="switchSubstep(3, 'C')">3C: Formative Assessment</div>
            <div class="substep-tab" data-step="3" data-substep="D" onclick="switchSubstep(3, 'D')">3D: Review & Edit</div>
            <div class="nav-scroll-indicator nav-scroll-right" onclick="scrollSubstepNav('right')">▶</div>
        </div>
        
        <!-- Substep 3A: Retrieval Practice Slides -->
        <div class="substep-content active" data-step="3" data-substep="A">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Retrieval Practice Slides</h3>
                </div>
                
                <div class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <div>
                        Create retrieval practice questions based on the prior knowledge needed for this lesson. These will be used at the beginning of the lesson to activate students' existing knowledge.
                    </div>
                </div>
                
                <!-- Prior Knowledge Summary for Retrieval -->
                <div id="priorKnowledgeForRetrieval" class="response-display" style="max-height: none; margin-bottom: 1.5rem;">
                    <p>Please complete Step 1D first to see prior knowledge here.</p>
                </div>
                
                <div class="prompt-response-container">
                    <div class="prompt-area">
                        <div class="area-header">
                            <h4 class="area-title">Generate Retrieval Questions</h4>
                            <button id="generateRetrievalPromptBtn" class="btn btn-secondary btn-sm">Generate Prompt</button>
                        </div>
                        <div class="textarea-container">
                            <textarea id="retrievalPromptTextarea" class="prompt-textarea" readonly placeholder="First complete Step 1D to generate this prompt..."></textarea>
                            <button id="copyRetrievalPromptBtn" class="copy-btn">Copy</button>
                        </div>
                    </div>
                    
                    <div class="response-area">
                        <div class="area-header">
                            <h4 class="area-title">Claude's Response</h4>
                            <button id="previewRetrievalResponseBtn" class="btn btn-outline btn-sm">Preview</button>
                        </div>
                        <div class="textarea-container">
                            <textarea id="retrievalResponseTextarea" class="response-textarea" placeholder="Paste Claude's response here..."></textarea>
                        </div>
                        <p class="response-instructions">Paste Claude's full response including all XML tags</p>
                        
                        <div id="retrievalPreview" class="response-preview" style="display: none;">
                            <div class="response-tabs">
                                <div class="response-tab active" data-tab="retrievalFormatted">Formatted</div>
                                <div class="response-tab" data-tab="retrievalTagged">Tagged</div>
                            </div>
                            <div class="response-display">
                                <div class="response-content active" id="retrievalFormattedResponse"></div>
                                <div class="response-content" id="retrievalTaggedResponse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Retrieval Questions with Edit Feature -->
                <div id="retrievalEditContainer" style="margin-top: 2rem; display: none;">
                    <div class="edit-header">
                        <h4>Retrieval Practice Questions</h4>
                        <button class="btn btn-outline" id="editRetrievalQuestionsBtn">Edit Questions</button>
                    </div>
                </div>
                
                <div class="nav-buttons">
                    <button class="btn btn-outline" onclick="switchSubstep(2, 'F')">Back to Step 2</button>
                    <div class="nav-buttons-right">
                        <button id="continueToTeachingInputBtn" class="btn btn-primary" disabled>Continue to Teaching Input</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Substep 3B: Teaching Input Slides -->
        <div class="substep-content" data-step="3" data-substep="B">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Teaching Input Slides</h3>
                </div>
                
                <div class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <div>
                        Create teaching input slides that follow the frameworks chosen in Step 2. These slides will form the main content of your lesson.
                    </div>
                </div>
                
                <!-- Learning Objectives Summary for Teaching -->
                <div id="learningObjectivesForTeaching" class="response-display" style="max-height: none; margin-bottom: 1.5rem;">
                    <p>Please complete previous steps first to see learning objectives here.</p>
                </div>
                
                <div class="prompt-response-container">
                    <div class="prompt-area">
                        <div class="area-header">
                            <h4 class="area-title">Generate Teaching Slides</h4>
                            <button id="generateTeachingInputPromptBtn" class="btn btn-secondary btn-sm">Generate Prompt</button>
                        </div>
                        <div class="textarea-container">
                            <textarea id="teachingInputPromptTextarea" class="prompt-textarea" readonly placeholder="First complete previous steps to generate this prompt..."></textarea>
                            <button id="copyTeachingInputPromptBtn" class="copy-btn">Copy</button>
                        </div>
                    </div>
                    
                    <div class="response-area">
                        <div class="area-header">
                            <h4 class="area-title">Claude's Response</h4>
                            <button id="previewTeachingInputResponseBtn" class="btn btn-outline btn-sm">Preview</button>
                        </div>
                        <div class="textarea-container">
                            <textarea id="teachingInputResponseTextarea" class="response-textarea" placeholder="Paste Claude's response here..."></textarea>
                        </div>
                        <p class="response-instructions">Paste Claude's full response including all XML tags</p>
                        
                        <div id="teachingInputPreview" class="response-preview" style="display: none;">
                            <div class="response-tabs">
                                <div class="response-tab active" data-tab="teachingInputFormatted">Formatted</div>
                                <div class="response-tab" data-tab="teachingInputTagged">Tagged</div>
                            </div>
                            <div class="response-display">
                                <div class="response-content active" id="teachingInputFormattedResponse"></div>
                                <div class="response-content" id="teachingInputTaggedResponse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Teaching Slides with Edit Feature -->
                <div id="teachingInputEditContainer" style="margin-top: 2rem; display: none;">
                    <div class="edit-header">
                        <h4>Teaching Input Slides</h4>
                        <button class="btn btn-outline" id="editTeachingSlidesBtn">Edit Slides</button>
                    </div>
                </div>
                
                <div class="nav-buttons">
                    <button class="btn btn-outline" onclick="switchSubstep(3, 'A')">Back</button>
                    <div class="nav-buttons-right">
                        <button id="continueToFormativeAssessmentBtn" class="btn btn-primary" disabled>Continue to Formative Assessment</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Substep 3C: Formative Assessment Slides -->
        <div class="substep-content" data-step="3" data-substep="C">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Formative Assessment Slides</h3>
                </div>
                
                <div class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <div>
                        Create formative assessment questions to check student understanding during or after teaching. These questions should align with the learning objectives and address common misconceptions.
                    </div>
                </div>
                
                <!-- Misconceptions Summary for Formative Assessment -->
                <div id="misconceptionsForFormative" class="response-display" style="max-height: none; margin-bottom: 1.5rem;">
                    <p>Please complete previous steps first to see misconceptions here.</p>
                </div>
                
                <div class="prompt-response-container">
                    <div class="prompt-area">
                        <div class="area-header">
                            <h4 class="area-title">Generate Assessment Questions</h4>
                            <button id="generateFormativePromptBtn" class="btn btn-secondary btn-sm">Generate Prompt</button>
                        </div>
                        <div class="textarea-container">
                            <textarea id="formativePromptTextarea" class="prompt-textarea" readonly placeholder="First complete previous steps to generate this prompt..."></textarea>
                            <button id="copyFormativePromptBtn" class="copy-btn">Copy</button>
                        </div>
                    </div>
                    
                    <div class="response-area">
                        <div class="area-header">
                            <h4 class="area-title">Claude's Response</h4>
                            <button id="previewFormativeResponseBtn" class="btn btn-outline btn-sm">Preview</button>
                        </div>
                        <div class="textarea-container">
                            <textarea id="formativeResponseTextarea" class="response-textarea" placeholder="Paste Claude's response here..."></textarea>
                        </div>
                        <p class="response-instructions">Paste Claude's full response including all XML tags</p>
                        
                        <div id="formativePreview" class="response-preview" style="display: none;">
                            <div class="response-tabs">
                                <div class="response-tab active" data-tab="formativeFormatted">Formatted</div>
                                <div class="response-tab" data-tab="formativeTagged">Tagged</div>
                            </div>
                            <div class="response-display">
                                <div class="response-content active" id="formativeFormattedResponse"></div>
                                <div class="response-content" id="formativeTaggedResponse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Formative Questions with Edit Feature -->
                <div id="formativeEditContainer" style="margin-top: 2rem; display: none;">
                    <div class="edit-header">
                        <h4>Formative Assessment Questions</h4>
                        <button class="btn btn-outline" id="editFormativeQuestionsBtn">Edit Questions</button>
                    </div>
                </div>
                
                <div class="nav-buttons">
                    <button class="btn btn-outline" onclick="switchSubstep(3, 'B')">Back</button>
                    <div class="nav-buttons-right">
                        <button id="continueToSlideReviewBtn" class="btn btn-primary" disabled>Continue to Review</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Substep 3D: Review & Edit -->
        <div class="substep-content" data-step="3" data-substep="D">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Review Slide Components</h3>
                </div>
                
                <div class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <div>
                        Review all slide components and ensure they form a cohesive lesson. You can make any necessary edits before finalizing your slides.
                    </div>
                </div>
                
                <div id="slidesReview">
                    <div class="review-section">
                        <h4>Retrieval Practice Slides</h4>
                        <div class="response-display" id="retrievalSlidesReview">
                            <p>Complete Step 3A to see retrieval practice slides.</p>
                        </div>
                    </div>
                    
                    <div class="review-section">
                        <h4>Teaching Input Slides</h4>
                        <div class="response-display" id="teachingSlidesReview">
                            <p>Complete Step 3B to see teaching input slides.</p>
                        </div>
                    </div>
                    
                    <div class="review-section">
                        <h4>Formative Assessment Slides</h4>
                        <div class="response-display" id="formativeSlidesReview">
                            <p>Complete Step 3C to see formative assessment slides.</p>
                        </div>
                    </div>
                    
                    <div class="review-section">
                        <h4>Complete Slide Sequence</h4>
                        <div class="response-display" id="slideSequenceReview">
                            <p>Complete all of Step 3 to see the slide sequence.</p>
                        </div>
                    </div>
                </div>
                
                <div class="nav-buttons">
                    <button class="btn btn-outline" onclick="switchSubstep(3, 'C')">Back</button>
                    <div class="nav-buttons-right">
                        <button id="finishStep3Btn" class="btn btn-secondary" disabled>Complete & Continue to Step 4</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Initialize first substep
    prepareStep3A();
}

// Finish Step 3 and move to Step 4
function finishStep3() {
    // Make sure we have all the needed data
    if (!appState.responseTags.retrievalQuestions || !appState.responseTags.teachingSlides || 
        !appState.responseTags.formativeAssessment) {
        alert('Please complete all substeps before continuing to Step 4');
        return;
    }
    
    // Update main step status
    appState.currentMainStep = 4;
    appState.currentSubStep = 'A';
    updateStepIndicators();
    
    // Update Step 3 status
    document.querySelector('.main-step-3 .main-step-status').className = 'main-step-status status-completed';
    document.querySelector('.main-step-3 .main-step-status').textContent = 'Completed';
    
    // Update Step 4 status
    document.querySelector('.main-step-4 .main-step-status').className = 'main-step-status status-in-progress';
    document.querySelector('.main-step-4 .main-step-status').textContent = 'In Progress';
    
    // Initialize Step 4 content (placeholder for now)
    const step4Content = document.getElementById('mainStepContent4');
    
    step4Content.innerHTML = `
    <div class="main-step-inner">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Worksheet Generation</h3>
            </div>
            <div class="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <div>
                    <p><strong>Step 3 completed successfully!</strong></p>
                    <p>You have now generated all slide content for your lesson. Step 4 (Worksheet Generation) will be available in the next version of the application.</p>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Toggle to show Step 4
    if (!appState.mainStepExpanded[3]) {
        toggleMainStep(4);
    }
    
    // Scroll to Step 4
    document.getElementById('mainStep4').scrollIntoView({ behavior: 'smooth' });
	
// Finish Step 4 and move to Step 5
function finishStep4() {
    // Make sure we have all the needed data
    if (!appState.responseTags.referenceMaterials || !appState.responseTags.retrievalWorksheet || 
        !appState.responseTags.scaleQuestions || !appState.responseTags.applicationQuestions) {
        alert('Please complete all substeps before continuing to Step 5');
        return;
    }
    
    // Update main step status
    appState.currentMainStep = 5;
    appState.currentSubStep = 'A';
    updateStepIndicators();
    
    // Update Step 4 status
    document.querySelector('.main-step-4 .main-step-status').className = 'main-step-status status-completed';
    document.querySelector('.main-step-4 .main-step-status').textContent = 'Completed';
    
    // Update Step 5 status
    document.querySelector('.main-step-5 .main-step-status').className = 'main-step-status status-in-progress';
    document.querySelector('.main-step-5 .main-step-status').textContent = 'In Progress';
    
    // Toggle to show Step 5
    if (!appState.mainStepExpanded[4]) {
        toggleMainStep(5);
    }
    
    // Scroll to Step 5
    document.getElementById('mainStep5').scrollIntoView({ behavior: 'smooth' });
}

// Update slide count display
function updateSlideCountDisplay() {
    // Count retrieval slides
    let retrievalCount = 0;
    if (appState.slides.retrieval && appState.slides.retrieval.questions) {
        retrievalCount = appState.slides.retrieval.questions.length;
    }
    
    // Count teaching slides
    let teachingCount = 0;
    for (let loNum = 1; loNum <= 3; loNum++) {
        if (loNum === 3 && !appState.learningObjectives.lo3.exists) continue;
        
        const loKey = 'lo' + loNum;
        if (appState.slides.teaching && appState.slides.teaching[loKey] && appState.slides.teaching[loKey].slides) {
            teachingCount += appState.slides.teaching[loKey].slides.length;
        }
    }
    
    // Count formative assessment slides
    let formativeCount = 0;
    for (let loNum = 1; loNum <= 3; loNum++) {
        if (loNum === 3 && !appState.learningObjectives.lo3.exists) continue;
        
        const loKey = 'lo' + loNum;
        if (appState.slides.formative && appState.slides.formative[loKey] && appState.slides.formative[loKey].questions) {
            formativeCount += appState.slides.formative[loKey].questions.length;
        }
    }
    
    // Calculate total (including title, section headers, and conclusion)
    const sectionCount = 2 + (appState.learningObjectives.lo3.exists ? 3 : 2); // Retrieval + LOs
    const totalCount = 1 + retrievalCount + sectionCount + teachingCount + formativeCount + 1; // Title + Content + Conclusion
    
    // Update the display
    document.getElementById('retrievalSlideCount').textContent = retrievalCount;
    document.getElementById('teachingSlideCount').textContent = teachingCount;
    document.getElementById('formativeSlideCount').textContent = formativeCount;
    document.getElementById('totalSlideCount').textContent = totalCount;
}

// Update worksheet summaries
function updateWorksheetSummaries() {
    const container = document.getElementById('worksheetsPreviewContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 1; i <= appState.worksheets.count; i++) {
        const worksheetKey = `worksheet${i}`;
        
        // Count sections and questions
        let sectionCount = 0;
        let questionCount = 0;
        
        // Reference materials
        if (appState.worksheets.reference && shouldIncludeSection(i, 'reference')) {
            sectionCount++;
        }
        
        // Retrieval questions
        if (appState.worksheets.retrieval && appState.worksheets.retrieval[worksheetKey] && appState.worksheets.retrieval[worksheetKey].length > 0) {
            sectionCount++;
            questionCount += appState.worksheets.retrieval[worksheetKey].length;
        }
        
        // SCALE, Application, Exam Technique, and Exam Style questions
        for (let loNum = 1; loNum <= 3; loNum++) {
            if (loNum === 3 && !appState.learningObjectives.lo3.exists) continue;
            
            const loKey = 'lo' + loNum;
            // Check if this LO is allocated to this worksheet
            if (appState.lessonStructure.worksheetAllocation[loKey] != i) continue;
            
            // SCALE questions
            if (appState.worksheets.scale && appState.worksheets.scale[worksheetKey] && appState.worksheets.scale[worksheetKey][loKey]) {
                const selectedQuestions = appState.worksheets.scale[worksheetKey][loKey].filter(q => q.selected);
                if (selectedQuestions.length > 0) {
                    sectionCount++;
                    questionCount += selectedQuestions.length;
                }
            }
            
            // Application questions
            if (appState.worksheets.application && appState.worksheets.application[worksheetKey] && appState.worksheets.application[worksheetKey][loKey] && appState.worksheets.application[worksheetKey][loKey].length > 0) {
                sectionCount++;
                questionCount += appState.worksheets.application[worksheetKey][loKey].length;
            }
            
            // Exam Technique questions
            if (appState.worksheets.examTechnique && appState.worksheets.examTechnique[worksheetKey] && appState.worksheets.examTechnique[worksheetKey][loKey] && appState.worksheets.examTechnique[worksheetKey][loKey].length > 0) {
                sectionCount++;
                questionCount += appState.worksheets.examTechnique[worksheetKey][loKey].length;
            }
            
            // Exam Style questions
            if (appState.worksheets.examStyle && appState.worksheets.examStyle[worksheetKey] && appState.worksheets.examStyle[worksheetKey][loKey] && appState.worksheets.examStyle[worksheetKey][loKey].length > 0) {
                sectionCount++;
                questionCount += appState.worksheets.examStyle[worksheetKey][loKey].length;
            }
        }
        
        // Create worksheet summary
        const worksheetSummary = document.createElement('div');
        worksheetSummary.className = 'worksheet-summary';
        worksheetSummary.innerHTML = `
            <h5>Worksheet ${i}</h5>
            <p><strong>Sections:</strong> ${sectionCount}</p>
            <p><strong>Questions:</strong> ${questionCount}</p>
            <p><strong>Allocated LOs:</strong> ${getWorksheetLOsList(i)}</p>
        `;
        
        container.appendChild(worksheetSummary);
    }
}

// Get list of LOs allocated to a worksheet
function getWorksheetLOsList(worksheetNum) {
    const los = [];
    
    for (let loNum = 1; loNum <= 3; loNum++) {
        if (loNum === 3 && !appState.learningObjectives.lo3.exists) continue;
        
        const loKey = 'lo' + loNum;
        if (appState.lessonStructure.worksheetAllocation[loKey] == worksheetNum) {
            los.push(loNum);
        }
    }
    
    return los.length > 0 ? los.join(', ') : 'None';
}

// Update package summary
function updatePackageSummary() {
    document.getElementById('packageLessonTitle').textContent = appState.lessonInfo.lessonTitle || '-';
    document.getElementById('packageSubject').textContent = appState.lessonInfo.subject || '-';
    document.getElementById('packageTopic').textContent = appState.lessonInfo.topic || '-';
    document.getElementById('packageProvider').textContent = appState.lessonInfo.provider || '-';
    document.getElementById('packageLevel').textContent = appState.lessonInfo.level || '-';
    
    // Slide count (reuse value from slide count display)
    document.getElementById('packageSlideCount').textContent = document.getElementById('totalSlideCount').textContent;
    
    // Worksheet count
    document.getElementById('packageWorksheetCount').textContent = appState.worksheets.count;
}
	
	// Set up the substep navigation and content for Step 4
    const step4Content = document.getElementById('mainStepContent4');
    
    step4Content.innerHTML = `
    <div class="main-step-inner">
        <!-- Substeps Navigation -->
        <div class="substeps-nav">
            <div class="nav-scroll-indicator nav-scroll-left" onclick="scrollSubstepNav('left')">◀</div>
            <div class="substep-tab active" data-step="4" data-substep="A" onclick="switchSubstep(4, 'A')">4A: Reference Materials</div>
            <div class="substep-tab" data-step="4" data-substep="B" onclick="switchSubstep(4, 'B')">4B: Prior Knowledge Retrieval</div>
            <div class="substep-tab" data-step="4" data-substep="C" onclick="switchSubstep(4, 'C')">4C: SCALE Questions</div>
            <div class="substep-tab" data-step="4" data-substep="D" onclick="switchSubstep(4, 'D')">4D: Application Questions</div>
            <div class="substep-tab" data-step="4" data-substep="E" onclick="switchSubstep(4, 'E')">4E: Exam Technique Questions</div>
            <div class="substep-tab" data-step="4" data-substep="F" onclick="switchSubstep(4, 'F')">4F: Exam Style Questions</div>
            <div class="substep-tab" data-step="4" data-substep="G" onclick="switchSubstep(4, 'G')">4G: Worksheet Finalization</div>
            <div class="nav-scroll-indicator nav-scroll-right" onclick="scrollSubstepNav('right')">▶</div>
        </div>
        
        <!-- Substep content will be loaded dynamically -->
        <div id="step4Content">
            <p>Loading Step 4 content...</p>
        </div>
    </div>
    `;
    
    // Initialize Step 4
    initializeStep4();
	
// Prepare Step 4A substep
function prepareReferenceMaterialsSubstep() {
    initializeStep4A();
}

// Prepare Step 4B substep
function prepareRetrievalWorksheetSubstep() {
    initializeStep4B();
}

// Prepare Step 4C substep
function prepareScaleQuestionsSubstep() {
    initializeStep4C();
}

// Prepare Step 4D substep
function prepareApplicationQuestionsSubstep() {
    initializeStep4D();
}

// Prepare Step 4E substep
function prepareExamTechniqueQuestionsSubstep() {
    initializeStep4E();
}

// Prepare Step 4F substep
function prepareExamStyleQuestionsSubstep() {
    initializeStep4F();
}

// Prepare Step 4G substep
function prepareWorksheetFinalizationSubstep() {
    initializeStep4G();
}
}