// STEP 2A: TEACHING FRAMEWORKS FUNCTIONS

// Initialize Step 2 content
function initializeStep2() {
    const step2Content = document.getElementById('mainStepContent2');
    
    // Create the Step 2 inner structure
    step2Content.innerHTML = `
    <div class="main-step-inner">
        <!-- Substeps Navigation -->
        <div class="substeps-nav">
            <div class="nav-scroll-indicator nav-scroll-left" onclick="scrollSubstepNav('left')">◀</div>
            <div class="substep-tab active" data-step="2" data-substep="A" onclick="switchSubstep(2, 'A')">2A: Teaching Frameworks</div>
            <div class="substep-tab" data-step="2" data-substep="B" onclick="switchSubstep(2, 'B')">2B: Exam Techniques</div>
            <div class="substep-tab" data-step="2" data-substep="C" onclick="switchSubstep(2, 'C')">2C: Lesson Structure</div>
            <div class="substep-tab" data-step="2" data-substep="D" onclick="switchSubstep(2, 'D')">2D: Practical Requirements</div>
            <div class="substep-tab" data-step="2" data-substep="E" onclick="switchSubstep(2, 'E')">2E: Frayer Model</div>
            <div class="substep-tab" data-step="2" data-substep="F" onclick="switchSubstep(2, 'F')">2F: Review & Edit</div>
            <div class="nav-scroll-indicator nav-scroll-right" onclick="scrollSubstepNav('right')">▶</div>
        </div>

        <!-- Substep 2A: Teaching Frameworks -->
        <div class="substep-content active" data-step="2" data-substep="A">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Teaching Frameworks</h3>
                </div>
                
                <div class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <div>
                        Select appropriate teaching frameworks for each learning objective. These frameworks will guide how you structure your teaching and assessment.
                    </div>
                </div>
                
                <div id="frameworksLOSummary" class="response-display" style="max-height: none; margin-bottom: 1.5rem;">
                    <!-- Will be populated dynamically -->
                </div>
                
                <div id="framework-selection-content">
                    <!-- Will be populated dynamically -->
                </div>
                
                <div class="nav-buttons">
                    <button class="btn btn-outline" onclick="switchSubstep(1, 'E')">Back to Step 1</button>
                    <div class="nav-buttons-right">
                        <button id="continueToExamTechniquesBtn" class="btn btn-primary">Continue to Exam Techniques</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Substep 2B: Exam Techniques -->
        <div class="substep-content" data-step="2" data-substep="B">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Exam Techniques</h3>
                </div>
                
                <div class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <div>
                        Select specific exam techniques to explicitly teach for each learning objective. These techniques will help students structure their answers effectively.
                    </div>
                </div>
                
                <div id="examTechniquesLOSummary" class="response-display" style="max-height: none; margin-bottom: 1.5rem;">
                    <!-- Will be populated dynamically -->
                </div>
                
                <div id="exam-techniques-content">
                    <!-- Will be populated dynamically -->
                </div>
                
                <div class="nav-buttons">
                    <button class="btn btn-outline" onclick="switchSubstep(2, 'A')">Back</button>
                    <div class="nav-buttons-right">
                        <button id="continueToLessonStructureBtn" class="btn btn-primary">Continue to Lesson Structure</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Substep 2C: Lesson Structure -->
        <div class="substep-content" data-step="2" data-substep="C">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Lesson Structure</h3>
                </div>
                
                <div class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <div>
                        Organize your lesson with retrieval practice and a logical teaching sequence for your learning objectives.
                    </div>
                </div>
                
                <div id="lessonStructureLOSummary" class="response-display" style="max-height: none; margin-bottom: 1.5rem;">
                    <!-- Will be populated dynamically -->
                </div>
                
                <div id="lesson-structure-content">
                    <!-- Will be populated dynamically -->
                </div>
                
                <div class="nav-buttons">
                    <button class="btn btn-outline" onclick="switchSubstep(2, 'B')">Back</button>
                    <div class="nav-buttons-right">
                        <button id="continueToPracticalBtn" class="btn btn-primary">Continue to Practical Requirements</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Substep 2D: Practical Requirements -->
        <div class="substep-content" data-step="2" data-substep="D">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Practical Requirements</h3>
                </div>
                
                <div id="practicalAlert" class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <div>
                        Specify detailed requirements for practical activities in your lesson.
                    </div>
                </div>
                
                <div id="practicalLOSummary" class="response-display" style="max-height: none; margin-bottom: 1.5rem;">
                    <!-- Will be populated dynamically -->
                </div>
                
                <div id="practical-requirements-content">
                    <!-- Will be populated dynamically -->
                </div>
                
                <div class="nav-buttons">
                    <button class="btn btn-outline" onclick="switchSubstep(2, 'C')">Back</button>
                    <div class="nav-buttons-right">
                        <button id="continueToFrayerModelBtn" class="btn btn-primary">Continue to Frayer Model</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Substep 2E: Frayer Model -->
        <div class="substep-content" data-step="2" data-substep="E">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Frayer Model Assessment</h3>
                </div>
                
                <div class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <div>
                        Create Frayer models to help students understand key concepts in depth.
                    </div>
                </div>
                
                <div id="frayerModelLOSummary" class="response-display" style="max-height: none; margin-bottom: 1.5rem;">
                    <!-- Will be populated dynamically -->
                </div>
                
                <div id="frayer-model-content">
                    <!-- Will be populated dynamically -->
                </div>
                
                <div class="nav-buttons">
                    <button class="btn btn-outline" onclick="switchSubstep(2, 'D')">Back</button>
                    <div class="nav-buttons-right">
                        <button id="continueToStep2ReviewBtn" class="btn btn-primary">Continue to Review</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Substep 2F: Review & Edit -->
        <div class="substep-content" data-step="2" data-substep="F">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Review Teaching Approach</h3>
                </div>
                
                <div class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <div>
                        Review all the teaching approach elements you've defined. You can make any necessary edits before continuing to the next step.
                    </div>
                </div>
                
                <div id="approachReview">
                    <h4>Teaching Frameworks</h4>
                    <div class="response-display" id="frameworksReview">
                        <p>Complete all previous steps to see a summary here.</p>
                    </div>
                    
                    <h4 style="margin-top: 1.5rem;">Exam Techniques</h4>
                    <div class="response-display" id="examTechniquesReview">
                        <p>Complete all previous steps to see a summary here.</p>
                    </div>
                    
                    <h4 style="margin-top: 1.5rem;">Lesson Structure</h4>
                    <div class="response-display" id="lessonStructureReview">
                        <p>Complete all previous steps to see a summary here.</p>
                    </div>
                    
                    <h4 style="margin-top: 1.5rem;">Practical Requirements</h4>
                    <div class="response-display" id="practicalRequirementsReview">
                        <p>Complete all previous steps to see a summary here.</p>
                    </div>
                    
                    <h4 style="margin-top: 1.5rem;">Frayer Models</h4>
                    <div class="response-display" id="frayerModelsReview">
                        <p>Complete all previous steps to see a summary here.</p>
                    </div>
                </div>
                
                <div class="nav-buttons">
                    <button class="btn btn-outline" onclick="switchSubstep(2, 'E')">Back</button>
                    <div class="nav-buttons-right">
                        <button id="finishStep2Btn" class="btn btn-secondary">Complete & Continue to Step 3</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    
    // Add event listeners for Step 2 buttons
    document.getElementById('continueToExamTechniquesBtn').addEventListener('click', () => switchSubstep(2, 'B'));
    document.getElementById('continueToLessonStructureBtn').addEventListener('click', () => switchSubstep(2, 'C'));
    document.getElementById('continueToPracticalBtn').addEventListener('click', () => switchSubstep(2, 'D'));
    document.getElementById('continueToFrayerModelBtn').addEventListener('click', () => switchSubstep(2, 'E'));
    document.getElementById('continueToStep2ReviewBtn').addEventListener('click', () => switchSubstep(2, 'F'));
    document.getElementById('finishStep2Btn').addEventListener('click', finishStep2);
}

// Display the frameworks substep content
function prepareFrameworksSubstep() {
    // Update the LO summary
    let summaryHtml = '<h4>Learning Objectives</h4>';
    
    // LO1
    summaryHtml += `<div class="lo-container">
        <div class="lo-header">
            <span>Learning Objective 1</span>
            <span class="lo-badge ${appState.learningObjectives.lo1.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo1.hasPractical ? 'Practical' : 'Theory'}</span>
        </div>
        <p><strong>${appState.learningObjectives.lo1.title}</strong></p>
        <p>${appState.learningObjectives.lo1.description}</p>
        <div style="margin-top: 0.5rem;">
            <p><strong>Assessment Objective:</strong> ${appState.loTypes.lo1.aoCategory} - ${appState.loTypes.lo1.specificType}</p>
        </div>
    </div>`;
    
    // LO2
    summaryHtml += `<div class="lo-container">
        <div class="lo-header">
            <span>Learning Objective 2</span>
            <span class="lo-badge ${appState.learningObjectives.lo2.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo2.hasPractical ? 'Practical' : 'Theory'}</span>
        </div>
        <p><strong>${appState.learningObjectives.lo2.title}</strong></p>
        <p>${appState.learningObjectives.lo2.description}</p>
        <div style="margin-top: 0.5rem;">
            <p><strong>Assessment Objective:</strong> ${appState.loTypes.lo2.aoCategory} - ${appState.loTypes.lo2.specificType}</p>
        </div>
    </div>`;
    
    // LO3 if it exists
    if (appState.learningObjectives.lo3.exists) {
        summaryHtml += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective 3</span>
                <span class="lo-badge ${appState.learningObjectives.lo3.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo3.hasPractical ? 'Practical' : 'Theory'}</span>
            </div>
            <p><strong>${appState.learningObjectives.lo3.title}</strong></p>
            <p>${appState.learningObjectives.lo3.description}</p>
            <div style="margin-top: 0.5rem;">
                <p><strong>Assessment Objective:</strong> ${appState.loTypes.lo3.aoCategory} - ${appState.loTypes.lo3.specificType}</p>
            </div>
        </div>`;
    }
    
    document.getElementById('frameworksLOSummary').innerHTML = summaryHtml;
    
    // Create the framework selection interfaces
    let frameworksHtml = '';
    
    // LO1 Framework Selection
    frameworksHtml += `
    <div class="lo-container">
        <div class="lo-header">
            <span>Learning Objective 1 Framework</span>
            <button class="edit-button" id="editLO1FrameworkBtn">Edit</button>
        </div>
        <p>Select a primary teaching framework for this learning objective:</p>
        <div class="framework-selection">
    `;
    
    // Add framework options
    Object.entries(frameworkDescriptions).forEach(([framework, description]) => {
        frameworksHtml += `
        <div class="framework-card ${appState.frameworks.lo1.primaryFramework === framework ? 'selected' : ''}" onclick="selectFramework(1, '${framework}')">
            <div class="framework-card-header">${framework}</div>
            <div class="framework-card-description">${description}</div>
        </div>
        `;
    });
    
    frameworksHtml += `
        </div>
        
        <div class="supplementary-framework-selection">
            <div class="checkbox-container">
                <input type="checkbox" id="lo1BltUsed" ${appState.frameworks.lo1.bltUsed ? 'checked' : ''} onchange="toggleBltSupplementary(1)">
                <label for="lo1BltUsed">Apply Bloom's Taxonomy (BLT) supplementary approach</label>
            </div>
    `;
    
    // BLT levels (visible if BLT is used)
    if (appState.frameworks.lo1.bltUsed) {
        frameworksHtml += `
            <div id="lo1BltLevels" style="margin-left: 1.5rem; margin-top: 0.5rem;">
                <p>Select Bloom's Taxonomy levels to focus on:</p>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo1BltRemember" ${appState.frameworks.lo1.bltLevels.remember ? 'checked' : ''} onchange="toggleBltLevel(1, 'remember')">
                    <label for="lo1BltRemember">Remember</label>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo1BltUnderstand" ${appState.frameworks.lo1.bltLevels.understand ? 'checked' : ''} onchange="toggleBltLevel(1, 'understand')">
                    <label for="lo1BltUnderstand">Understand</label>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo1BltApply" ${appState.frameworks.lo1.bltLevels.apply ? 'checked' : ''} onchange="toggleBltLevel(1, 'apply')">
                    <label for="lo1BltApply">Apply</label>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo1BltAnalyze" ${appState.frameworks.lo1.bltLevels.analyze ? 'checked' : ''} onchange="toggleBltLevel(1, 'analyze')">
                    <label for="lo1BltAnalyze">Analyze</label>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo1BltEvaluate" ${appState.frameworks.lo1.bltLevels.evaluate ? 'checked' : ''} onchange="toggleBltLevel(1, 'evaluate')">
                    <label for="lo1BltEvaluate">Evaluate</label>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo1BltCreate" ${appState.frameworks.lo1.bltLevels.create ? 'checked' : ''} onchange="toggleBltLevel(1, 'create')">
                    <label for="lo1BltCreate">Create</label>
                </div>
            </div>
        `;
    } else {
        frameworksHtml += `<div id="lo1BltLevels" style="display: none;"></div>`;
    }
    
    frameworksHtml += `
        </div>
    </div>
    `;
    
    // LO2 Framework Selection (similar structure)
    frameworksHtml += `
    <div class="lo-container">
        <div class="lo-header">
            <span>Learning Objective 2 Framework</span>
            <button class="edit-button" id="editLO2FrameworkBtn">Edit</button>
        </div>
        <p>Select a primary teaching framework for this learning objective:</p>
        <div class="framework-selection">
    `;
    
    // Add framework options
    Object.entries(frameworkDescriptions).forEach(([framework, description]) => {
        frameworksHtml += `
        <div class="framework-card ${appState.frameworks.lo2.primaryFramework === framework ? 'selected' : ''}" onclick="selectFramework(2, '${framework}')">
            <div class="framework-card-header">${framework}</div>
            <div class="framework-card-description">${description}</div>
        </div>
        `;
    });
    
    frameworksHtml += `
        </div>
        
        <div class="supplementary-framework-selection">
            <div class="checkbox-container">
                <input type="checkbox" id="lo2BltUsed" ${appState.frameworks.lo2.bltUsed ? 'checked' : ''} onchange="toggleBltSupplementary(2)">
                <label for="lo2BltUsed">Apply Bloom's Taxonomy (BLT) supplementary approach</label>
            </div>
    `;
    
    // BLT levels (visible if BLT is used)
    if (appState.frameworks.lo2.bltUsed) {
        frameworksHtml += `
            <div id="lo2BltLevels" style="margin-left: 1.5rem; margin-top: 0.5rem;">
                <p>Select Bloom's Taxonomy levels to focus on:</p>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo2BltRemember" ${appState.frameworks.lo2.bltLevels.remember ? 'checked' : ''} onchange="toggleBltLevel(2, 'remember')">
                    <label for="lo2BltRemember">Remember</label>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo2BltUnderstand" ${appState.frameworks.lo2.bltLevels.understand ? 'checked' : ''} onchange="toggleBltLevel(2, 'understand')">
                    <label for="lo2BltUnderstand">Understand</label>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo2BltApply" ${appState.frameworks.lo2.bltLevels.apply ? 'checked' : ''} onchange="toggleBltLevel(2, 'apply')">
                    <label for="lo2BltApply">Apply</label>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo2BltAnalyze" ${appState.frameworks.lo2.bltLevels.analyze ? 'checked' : ''} onchange="toggleBltLevel(2, 'analyze')">
                    <label for="lo2BltAnalyze">Analyze</label>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo2BltEvaluate" ${appState.frameworks.lo2.bltLevels.evaluate ? 'checked' : ''} onchange="toggleBltLevel(2, 'evaluate')">
                    <label for="lo2BltEvaluate">Evaluate</label>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo2BltCreate" ${appState.frameworks.lo2.bltLevels.create ? 'checked' : ''} onchange="toggleBltLevel(2, 'create')">
                    <label for="lo2BltCreate">Create</label>
                </div>
            </div>
        `;
    } else {
        frameworksHtml += `<div id="lo2BltLevels" style="display: none;"></div>`;
    }
    
    frameworksHtml += `
        </div>
    </div>
    `;
    
    // LO3 Framework Selection (if LO3 exists)
    if (appState.learningObjectives.lo3.exists) {
        frameworksHtml += `
        <div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective 3 Framework</span>
                <button class="edit-button" id="editLO3FrameworkBtn">Edit</button>
            </div>
            <p>Select a primary teaching framework for this learning objective:</p>
            <div class="framework-selection">
        `;
        
        // Add framework options
        Object.entries(frameworkDescriptions).forEach(([framework, description]) => {
            frameworksHtml += `
            <div class="framework-card ${appState.frameworks.lo3.primaryFramework === framework ? 'selected' : ''}" onclick="selectFramework(3, '${framework}')">
                <div class="framework-card-header">${framework}</div>
                <div class="framework-card-description">${description}</div>
            </div>
            `;
        });
        
        frameworksHtml += `
            </div>
            
            <div class="supplementary-framework-selection">
                <div class="checkbox-container">
                    <input type="checkbox" id="lo3BltUsed" ${appState.frameworks.lo3.bltUsed ? 'checked' : ''} onchange="toggleBltSupplementary(3)">
                    <label for="lo3BltUsed">Apply Bloom's Taxonomy (BLT) supplementary approach</label>
                </div>
        `;
        
        // BLT levels (visible if BLT is used)
        if (appState.frameworks.lo3.bltUsed) {
            frameworksHtml += `
                <div id="lo3BltLevels" style="margin-left: 1.5rem; margin-top: 0.5rem;">
                    <p>Select Bloom's Taxonomy levels to focus on:</p>
                    <div class="checkbox-container">
                        <input type="checkbox" id="lo3BltRemember" ${appState.frameworks.lo3.bltLevels.remember ? 'checked' : ''} onchange="toggleBltLevel(3, 'remember')">
                        <label for="lo3BltRemember">Remember</label>
                    </div>
                    <div class="checkbox-container">
                        <input type="checkbox" id="lo3BltUnderstand" ${appState.frameworks.lo3.bltLevels.understand ? 'checked' : ''} onchange="toggleBltLevel(3, 'understand')">
                        <label for="lo3BltUnderstand">Understand</label>
                    </div>
                    <div class="checkbox-container">
                        <input type="checkbox" id="lo3BltApply" ${appState.frameworks.lo3.bltLevels.apply ? 'checked' : ''} onchange="toggleBltLevel(3, 'apply')">
                        <label for="lo3BltApply">Apply</label>
                    </div>
                    <div class="checkbox-container">
                        <input type="checkbox" id="lo3BltAnalyze" ${appState.frameworks.lo3.bltLevels.analyze ? 'checked' : ''} onchange="toggleBltLevel(3, 'analyze')">
                        <label for="lo3BltAnalyze">Analyze</label>
                    </div>
                    <div class="checkbox-container">
                        <input type="checkbox" id="lo3BltEvaluate" ${appState.frameworks.lo3.bltLevels.evaluate ? 'checked' : ''} onchange="toggleBltLevel(3, 'evaluate')">
                        <label for="lo3BltEvaluate">Evaluate</label>
                    </div>
                    <div class="checkbox-container">
                        <input type="checkbox" id="lo3BltCreate" ${appState.frameworks.lo3.bltLevels.create ? 'checked' : ''} onchange="toggleBltLevel(3, 'create')">
                        <label for="lo3BltCreate">Create</label>
                    </div>
                </div>
            `;
        } else {
            frameworksHtml += `<div id="lo3BltLevels" style="display: none;"></div>`;
        }
        
        frameworksHtml += `
            </div>
        </div>
        `;
    }
    
    // Add the frameworks HTML to the page
    document.getElementById('framework-selection-content').innerHTML = frameworksHtml;
    
    // Add event listeners for edit buttons
    document.getElementById('editLO1FrameworkBtn').addEventListener('click', () => openFrameworkEditModal(1));
    document.getElementById('editLO2FrameworkBtn').addEventListener('click', () => openFrameworkEditModal(2));
    if (appState.learningObjectives.lo3.exists) {
        document.getElementById('editLO3FrameworkBtn').addEventListener('click', () => openFrameworkEditModal(3));
    }
}

// Select a framework for a learning objective
function selectFramework(loNumber, framework) {
    // Update the state
    appState.frameworks[`lo${loNumber}`].primaryFramework = framework;
    
    // Update the UI
    const frameworkCards = document.querySelectorAll(`.lo-container:nth-child(${loNumber}) .framework-card`);
    frameworkCards.forEach(card => {
        if (card.querySelector('.framework-card-header').textContent === framework) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

// Toggle BLT supplementary framework
function toggleBltSupplementary(loNumber) {
    const checkbox = document.getElementById(`lo${loNumber}BltUsed`);
    const bltLevelsDiv = document.getElementById(`lo${loNumber}BltLevels`);
    
    // Update the state
    appState.frameworks[`lo${loNumber}`].bltUsed = checkbox.checked;
    
    // Show/hide BLT levels
    if (checkbox.checked) {
        // If showing levels, create the HTML if it doesn't exist
        if (bltLevelsDiv.innerHTML === '') {
            bltLevelsDiv.innerHTML = `
                <p>Select Bloom's Taxonomy levels to focus on:</p>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo${loNumber}BltRemember" onchange="toggleBltLevel(${loNumber}, 'remember')">
                    <label for="lo${loNumber}BltRemember">Remember</label>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo${loNumber}BltUnderstand" onchange="toggleBltLevel(${loNumber}, 'understand')">
                    <label for="lo${loNumber}BltUnderstand">Understand</label>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo${loNumber}BltApply" onchange="toggleBltLevel(${loNumber}, 'apply')">
                    <label for="lo${loNumber}BltApply">Apply</label>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo${loNumber}BltAnalyze" onchange="toggleBltLevel(${loNumber}, 'analyze')">
                    <label for="lo${loNumber}BltAnalyze">Analyze</label>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo${loNumber}BltEvaluate" onchange="toggleBltLevel(${loNumber}, 'evaluate')">
                    <label for="lo${loNumber}BltEvaluate">Evaluate</label>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="lo${loNumber}BltCreate" onchange="toggleBltLevel(${loNumber}, 'create')">
                    <label for="lo${loNumber}BltCreate">Create</label>
                </div>
            `;
        }
        
        bltLevelsDiv.style.display = 'block';
    } else {
        bltLevelsDiv.style.display = 'none';
    }
}

// Toggle a specific BLT level
function toggleBltLevel(loNumber, level) {
    const checkbox = document.getElementById(`lo${loNumber}Blt${level.charAt(0).toUpperCase() + level.slice(1)}`);
    
    // Update the state
    appState.frameworks[`lo${loNumber}`].bltLevels[level] = checkbox.checked;
}

// Open Framework Edit Modal
function openFrameworkEditModal(loNumber) {
    appState.editState.currentLO = loNumber;
    
    // Set the LO number in the dropdown
    document.getElementById('editFrameworkLoNumber').value = loNumber;
    
    // Get the current framework settings
    const framework = appState.frameworks[`lo${loNumber}`];
    
    // Set the values in the form
    document.getElementById('editPrimaryFramework').value = framework.primaryFramework;
    document.getElementById('editBltUsed').checked = framework.bltUsed;
    
    // Show/hide BLT levels based on BLT usage
    document.getElementById('bltLevelsContainer').style.display = framework.bltUsed ? 'block' : 'none';
    
    // Set BLT level checkboxes
    document.getElementById('editBltRemember').checked = framework.bltLevels.remember;
    document.getElementById('editBltUnderstand').checked = framework.bltLevels.understand;
    document.getElementById('editBltApply').checked = framework.bltLevels.apply;
    document.getElementById('editBltAnalyze').checked = framework.bltLevels.analyze;
    document.getElementById('editBltEvaluate').checked = framework.bltLevels.evaluate;
    document.getElementById('editBltCreate').checked = framework.bltLevels.create;
    
    // Show the modal
    document.getElementById('frameworkEditModal').classList.add('active');
}

// Save Framework changes
function saveFrameworkChanges() {
    const loNumber = appState.editState.currentLO;
    const primaryFramework = document.getElementById('editPrimaryFramework').value;
    const bltUsed = document.getElementById('editBltUsed').checked;
    
    // Get BLT levels if BLT is used
    let bltLevels = {
        remember: false,
        understand: false,
        apply: false,
        analyze: false,
        evaluate: false,
        create: false
    };
    
    if (bltUsed) {
        bltLevels.remember = document.getElementById('editBltRemember').checked;
        bltLevels.understand = document.getElementById('editBltUnderstand').checked;
        bltLevels.apply = document.getElementById('editBltApply').checked;
        bltLevels.analyze = document.getElementById('editBltAnalyze').checked;
        bltLevels.evaluate = document.getElementById('editBltEvaluate').checked;
        bltLevels.create = document.getElementById('editBltCreate').checked;
    }
    
    // Update the state
    appState.frameworks[`lo${loNumber}`].primaryFramework = primaryFramework;
    appState.frameworks[`lo${loNumber}`].bltUsed = bltUsed;
    appState.frameworks[`lo${loNumber}`].bltLevels = bltLevels;
    
    // Close the modal
    closeModal('frameworkEditModal');
    
    // Refresh the frameworks display
    prepareFrameworksSubstep();
}

// STEP 2B: EXAM TECHNIQUES FUNCTIONS

// Display the exam techniques substep content
function prepareExamTechniquesSubstep() {
    // Update the LO summary with frameworks included
    let summaryHtml = '<h4>Learning Objectives & Frameworks</h4>';
    
    // LO1
    summaryHtml += `<div class="lo-container">
        <div class="lo-header">
            <span>Learning Objective 1</span>
            <span class="lo-badge ${appState.learningObjectives.lo1.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo1.hasPractical ? 'Practical' : 'Theory'}</span>
        </div>
        <p><strong>${appState.learningObjectives.lo1.title}</strong></p>
        <div style="margin-top: 0.5rem;">
            <p><strong>Framework:</strong> ${appState.frameworks.lo1.primaryFramework}</p>
            ${appState.frameworks.lo1.bltUsed ? '<p><strong>BLT Supplementary:</strong> Yes</p>' : ''}
        </div>
    </div>`;
    
    // LO2
    summaryHtml += `<div class="lo-container">
        <div class="lo-header">
            <span>Learning Objective 2</span>
            <span class="lo-badge ${appState.learningObjectives.lo2.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo2.hasPractical ? 'Practical' : 'Theory'}</span>
        </div>
        <p><strong>${appState.learningObjectives.lo2.title}</strong></p>
        <div style="margin-top: 0.5rem;">
            <p><strong>Framework:</strong> ${appState.frameworks.lo2.primaryFramework}</p>
            ${appState.frameworks.lo2.bltUsed ? '<p><strong>BLT Supplementary:</strong> Yes</p>' : ''}
        </div>
    </div>`;
    
    // LO3 if it exists
    if (appState.learningObjectives.lo3.exists) {
        summaryHtml += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective 3</span>
                <span class="lo-badge ${appState.learningObjectives.lo3.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo3.hasPractical ? 'Practical' : 'Theory'}</span>
            </div>
            <p><strong>${appState.learningObjectives.lo3.title}</strong></p>
            <div style="margin-top: 0.5rem;">
                <p><strong>Framework:</strong> ${appState.frameworks.lo3.primaryFramework}</p>
                ${appState.frameworks.lo3.bltUsed ? '<p><strong>BLT Supplementary:</strong> Yes</p>' : ''}
            </div>
        </div>`;
    }
    
    document.getElementById('examTechniquesLOSummary').innerHTML = summaryHtml;
    
    // Create the exam techniques selection interfaces
    let techniquesHtml = '';
    
    // LO1 Exam Techniques Selection
    techniquesHtml += `
    <div class="lo-container">
        <div class="lo-header">
            <span>Learning Objective 1 Exam Techniques</span>
            <button class="edit-button" id="editLO1TechniquesBtn">Edit</button>
        </div>
        <p>Select exam techniques to explicitly teach for this learning objective:</p>
        <div class="technique-selection">
            <div class="technique-badge ${appState.examTechniques.lo1.BLT ? 'selected' : ''}" onclick="toggleTechnique(1, 'BLT')">
                BLT - Because, Link, Therefore
            </div>
            <div class="technique-badge ${appState.examTechniques.lo1.EVERY ? 'selected' : ''}" onclick="toggleTechnique(1, 'EVERY')">
                EVERY - Equation, Values, Equals, Rearrange, Y=Answer
            </div>
            <div class="technique-badge ${appState.examTechniques.lo1.MEMES ? 'selected' : ''}" onclick="toggleTechnique(1, 'MEMES')">
                MEMES - Method, Equipment, Measurements, Evaluation, Safety
            </div>
            <div class="technique-badge ${appState.examTechniques.lo1.GRAPH ? 'selected' : ''}" onclick="toggleTechnique(1, 'GRAPH')">
                GRAPH - Grid, Right scale, Axis labeled, Plot, Head (title)
            </div>
        </div>
        
        <div style="margin-top: 1rem;">
            <label class="form-label" for="lo1ExamNotes">Additional Notes (Optional):</label>
            <textarea id="lo1ExamNotes" class="form-control" rows="2" placeholder="Add any specific instructions or focus areas for exam technique"
                onchange="updateExamNotes(1)">${appState.examTechniques.lo1.notes}</textarea>
        </div>
    </div>
    `;
    
    // LO2 Exam Techniques Selection
    techniquesHtml += `
    <div class="lo-container">
        <div class="lo-header">
            <span>Learning Objective 2 Exam Techniques</span>
            <button class="edit-button" id="editLO2TechniquesBtn">Edit</button>
        </div>
        <p>Select exam techniques to explicitly teach for this learning objective:</p>
        <div class="technique-selection">
            <div class="technique-badge ${appState.examTechniques.lo2.BLT ? 'selected' : ''}" onclick="toggleTechnique(2, 'BLT')">
                BLT - Because, Link, Therefore
            </div>
            <div class="technique-badge ${appState.examTechniques.lo2.EVERY ? 'selected' : ''}" onclick="toggleTechnique(2, 'EVERY')">
                EVERY - Equation, Values, Equals, Rearrange, Y=Answer
            </div>
            <div class="technique-badge ${appState.examTechniques.lo2.MEMES ? 'selected' : ''}" onclick="toggleTechnique(2, 'MEMES')">
                MEMES - Method, Equipment, Measurements, Evaluation, Safety
            </div>
            <div class="technique-badge ${appState.examTechniques.lo2.GRAPH ? 'selected' : ''}" onclick="toggleTechnique(2, 'GRAPH')">
                GRAPH - Grid, Right scale, Axis labeled, Plot, Head (title)
            </div>
        </div>
        
        <div style="margin-top: 1rem;">
            <label class="form-label" for="lo2ExamNotes">Additional Notes (Optional):</label>
            <textarea id="lo2ExamNotes" class="form-control" rows="2" placeholder="Add any specific instructions or focus areas for exam technique"
                onchange="updateExamNotes(2)">${appState.examTechniques.lo2.notes}</textarea>
        </div>
    </div>
    `;
    
    // LO3 Exam Techniques Selection (if LO3 exists)
    if (appState.learningObjectives.lo3.exists) {
        techniquesHtml += `
        <div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective 3 Exam Techniques</span>
                <button class="edit-button" id="editLO3TechniquesBtn">Edit</button>
            </div>
            <p>Select exam techniques to explicitly teach for this learning objective:</p>
            <div class="technique-selection">
                <div class="technique-badge ${appState.examTechniques.lo3.BLT ? 'selected' : ''}" onclick="toggleTechnique(3, 'BLT')">
                    BLT - Because, Link, Therefore
                </div>
                <div class="technique-badge ${appState.examTechniques.lo3.EVERY ? 'selected' : ''}" onclick="toggleTechnique(3, 'EVERY')">
                    EVERY - Equation, Values, Equals, Rearrange, Y=Answer
                </div>
                <div class="technique-badge ${appState.examTechniques.lo3.MEMES ? 'selected' : ''}" onclick="toggleTechnique(3, 'MEMES')">
                    MEMES - Method, Equipment, Measurements, Evaluation, Safety
                </div>
                <div class="technique-badge ${appState.examTechniques.lo3.GRAPH ? 'selected' : ''}" onclick="toggleTechnique(3, 'GRAPH')">
                    GRAPH - Grid, Right scale, Axis labeled, Plot, Head (title)
                </div>
            </div>
            
            <div style="margin-top: 1rem;">
                <label class="form-label" for="lo3ExamNotes">Additional Notes (Optional):</label>
                <textarea id="lo3ExamNotes" class="form-control" rows="2" placeholder="Add any specific instructions or focus areas for exam technique"
                    onchange="updateExamNotes(3)">${appState.examTechniques.lo3.notes}</textarea>
            </div>
        </div>
        `;
    }
    
    // Add the exam techniques HTML to the page
    document.getElementById('exam-techniques-content').innerHTML = techniquesHtml;
    
    // Add event listeners for edit buttons
    document.getElementById('editLO1TechniquesBtn').addEventListener('click', () => openExamTechniqueEditModal(1));
    document.getElementById('editLO2TechniquesBtn').addEventListener('click', () => openExamTechniqueEditModal(2));
    if (appState.learningObjectives.lo3.exists) {
        document.getElementById('editLO3TechniquesBtn').addEventListener('click', () => openExamTechniqueEditModal(3));
    }
}

// Toggle an exam technique selection
function toggleTechnique(loNumber, technique) {
    // Toggle the state
    appState.examTechniques[`lo${loNumber}`][technique] = !appState.examTechniques[`lo${loNumber}`][technique];
    
    // Update the UI
    const badge = document.querySelector(`.lo-container:nth-child(${loNumber}) .technique-badge:contains('${technique}')`);
    if (appState.examTechniques[`lo${loNumber}`][technique]) {
        badge.classList.add('selected');
    } else {
        badge.classList.remove('selected');
    }
}

// Update exam technique notes
function updateExamNotes(loNumber) {
    const notes = document.getElementById(`lo${loNumber}ExamNotes`).value;
    appState.examTechniques[`lo${loNumber}`].notes = notes;
}

// Open Exam Technique Edit Modal
function openExamTechniqueEditModal(loNumber) {
    appState.editState.currentLO = loNumber;
    
    // Set the LO number in the dropdown
    document.getElementById('editTechniqueLoNumber').value = loNumber;
    
    // Get the current exam technique settings
    const techniques = appState.examTechniques[`lo${loNumber}`];
    
    // Set checkboxes
    document.getElementById('editTechniqueBLT').checked = techniques.BLT;
    document.getElementById('editTechniqueEVERY').checked = techniques.EVERY;
    document.getElementById('editTechniqueMEMES').checked = techniques.MEMES;
    document.getElementById('editTechniqueGRAPH').checked = techniques.GRAPH;
    
    // Set notes
    document.getElementById('editExamNotes').value = techniques.notes;
    
    // Show the modal
    document.getElementById('examTechniqueEditModal').classList.add('active');
}

// Save Exam Technique changes
function saveExamTechniqueChanges() {
    const loNumber = appState.editState.currentLO;
    
    // Get checkbox values
    const blt = document.getElementById('editTechniqueBLT').checked;
    const every = document.getElementById('editTechniqueEVERY').checked;
    const memes = document.getElementById('editTechniqueMEMES').checked;
    const graph = document.getElementById('editTechniqueGRAPH').checked;
    
    // Get notes
    const notes = document.getElementById('editExamNotes').value;
    
    // Update the state
    appState.examTechniques[`lo${loNumber}`].BLT = blt;
    appState.examTechniques[`lo${loNumber}`].EVERY = every;
    appState.examTechniques[`lo${loNumber}`].MEMES = memes;
    appState.examTechniques[`lo${loNumber}`].GRAPH = graph;
    appState.examTechniques[`lo${loNumber}`].notes = notes;
    
    // Close the modal
    closeModal('examTechniqueEditModal');
    
    // Refresh the exam techniques display
    prepareExamTechniquesSubstep();
}