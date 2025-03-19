// STEP 4: WORKSHEET GENERATION FUNCTIONALITY

// Initialize Step 4 when first accessed
function initializeStep4() {
    // Setup event listeners for Step 4
    setupStep4EventListeners();
    
    // Determine worksheet count based on LO count and allocation from Step 2
    determineWorksheetCount();
    
    // Initialize worksheet tabs
    initializeWorksheetTabs();
    
    // Prepare Step 4A (first substep)
    prepareReferenceMaterialsSubstep();
}

// Setup all event listeners for Step 4
function setupStep4EventListeners() {
    // Reference Materials (4A)
    document.getElementById('generateReferenceMaterialsPromptBtn').addEventListener('click', generateReferenceMaterialsPrompt);
    document.getElementById('copyReferenceMaterialsPromptBtn').addEventListener('click', () => copyToClipboard('referenceMaterialsPromptTextarea'));
    document.getElementById('previewReferenceMaterialsResponseBtn').addEventListener('click', () => previewResponse('referenceMaterials'));
    document.getElementById('referenceMaterialsResponseTextarea').addEventListener('input', handleReferenceMaterialsResponse);
    document.getElementById('continueToRetrievalBtn').addEventListener('click', () => switchSubstep(4, 'B'));
    document.getElementById('editDefinitionsBtn').addEventListener('click', () => openWorksheetEditModal('definitionsEditModal'));
    document.getElementById('editFormulasBtn').addEventListener('click', () => openWorksheetEditModal('formulasEditModal'));
    document.getElementById('editDiagramsBtn').addEventListener('click', () => openWorksheetEditModal('diagramsEditModal'));
    document.getElementById('editExamplesBtn').addEventListener('click', () => openWorksheetEditModal('examplesEditModal'));
    document.getElementById('saveDefinitionsBtn').addEventListener('click', saveDefinitions);
    document.getElementById('saveFormulasBtn').addEventListener('click', saveFormulas);
    document.getElementById('saveDiagramsBtn').addEventListener('click', saveDiagrams);
    document.getElementById('saveExamplesBtn').addEventListener('click', saveExamples);
    
    // Prior Knowledge Retrieval (4B)
    document.getElementById('generateRetrievalWorksheetPromptBtn').addEventListener('click', generateRetrievalWorksheetPrompt);
    document.getElementById('copyRetrievalWorksheetPromptBtn').addEventListener('click', () => copyToClipboard('retrievalWorksheetPromptTextarea'));
    document.getElementById('previewRetrievalWorksheetResponseBtn').addEventListener('click', () => previewResponse('retrievalWorksheet'));
    document.getElementById('retrievalWorksheetResponseTextarea').addEventListener('input', handleRetrievalWorksheetResponse);
    document.getElementById('continueToScaleQuestionsBtn').addEventListener('click', () => switchSubstep(4, 'C'));
    document.getElementById('editRetrievalWorksheetQuestionsBtn').addEventListener('click', () => openWorksheetEditModal('retrievalWorksheetQuestionsEditModal'));
    document.getElementById('saveRetrievalWorksheetQuestionsBtn').addEventListener('click', saveRetrievalWorksheetQuestions);
    
    // SCALE Questions (4C)
    document.getElementById('generateScaleQuestionsPromptBtn').addEventListener('click', generateScaleQuestionsPrompt);
    document.getElementById('copyScaleQuestionsPromptBtn').addEventListener('click', () => copyToClipboard('scaleQuestionsPromptTextarea'));
    document.getElementById('previewScaleQuestionsResponseBtn').addEventListener('click', () => previewResponse('scaleQuestions'));
    document.getElementById('scaleQuestionsResponseTextarea').addEventListener('input', handleScaleQuestionsResponse);
    document.getElementById('continueToApplicationQuestionsBtn').addEventListener('click', () => switchSubstep(4, 'D'));
    document.getElementById('editScaleQuestionsBtn').addEventListener('click', () => openWorksheetEditModal('scaleQuestionsEditModal'));
    document.getElementById('saveScaleQuestionsBtn').addEventListener('click', saveScaleQuestions);
    
    // Application Questions (4D)
    document.getElementById('generateApplicationQuestionsPromptBtn').addEventListener('click', generateApplicationQuestionsPrompt);
    document.getElementById('copyApplicationQuestionsPromptBtn').addEventListener('click', () => copyToClipboard('applicationQuestionsPromptTextarea'));
    document.getElementById('previewApplicationQuestionsResponseBtn').addEventListener('click', () => previewResponse('applicationQuestions'));
    document.getElementById('applicationQuestionsResponseTextarea').addEventListener('input', handleApplicationQuestionsResponse);
    document.getElementById('continueToExamTechniqueQuestionsBtn').addEventListener('click', () => switchSubstep(4, 'E'));
    document.getElementById('editApplicationQuestionsBtn').addEventListener('click', () => openWorksheetEditModal('applicationQuestionsEditModal'));
    document.getElementById('saveApplicationQuestionsBtn').addEventListener('click', saveApplicationQuestions);
    
    // Exam Technique Questions (4E)
    document.getElementById('generateExamTechniqueQuestionsPromptBtn').addEventListener('click', generateExamTechniqueQuestionsPrompt);
    document.getElementById('copyExamTechniqueQuestionsPromptBtn').addEventListener('click', () => copyToClipboard('examTechniqueQuestionsPromptTextarea'));
    document.getElementById('previewExamTechniqueQuestionsResponseBtn').addEventListener('click', () => previewResponse('examTechniqueQuestions'));
    document.getElementById('examTechniqueQuestionsResponseTextarea').addEventListener('input', handleExamTechniqueQuestionsResponse);
    document.getElementById('continueToExamStyleQuestionsBtn').addEventListener('click', () => switchSubstep(4, 'F'));
    document.getElementById('editExamTechniqueQuestionsBtn').addEventListener('click', () => openWorksheetEditModal('examTechniqueQuestionsEditModal'));
    document.getElementById('saveExamTechniqueQuestionsBtn').addEventListener('click', saveExamTechniqueQuestions);
    
    // Exam Style Questions (4F)
    document.getElementById('generateExamStyleQuestionsPromptBtn').addEventListener('click', generateExamStyleQuestionsPrompt);
    document.getElementById('copyExamStyleQuestionsPromptBtn').addEventListener('click', () => copyToClipboard('examStyleQuestionsPromptTextarea'));
    document.getElementById('previewExamStyleQuestionsResponseBtn').addEventListener('click', () => previewResponse('examStyleQuestions'));
    document.getElementById('examStyleQuestionsResponseTextarea').addEventListener('input', handleExamStyleQuestionsResponse);
    document.getElementById('continueToWorksheetFinalizationBtn').addEventListener('click', () => switchSubstep(4, 'G'));
    document.getElementById('editExamStyleQuestionsBtn').addEventListener('click', () => openWorksheetEditModal('examStyleQuestionsEditModal'));
    document.getElementById('saveExamStyleQuestionsBtn').addEventListener('click', saveExamStyleQuestions);
    
    // Worksheet Finalization (4G)
    document.getElementById('generateWorksheetFinalizationPromptBtn').addEventListener('click', generateWorksheetFinalizationPrompt);
    document.getElementById('copyWorksheetFinalizationPromptBtn').addEventListener('click', () => copyToClipboard('worksheetFinalizationPromptTextarea'));
    document.getElementById('previewWorksheetFinalizationResponseBtn').addEventListener('click', () => previewResponse('worksheetFinalization'));
    document.getElementById('worksheetFinalizationResponseTextarea').addEventListener('input', handleWorksheetFinalizationResponse);
    document.getElementById('applyFinalizationSettingsBtn').addEventListener('click', applyFinalizationSettings);
    document.getElementById('generateWorksheetPreviewBtn').addEventListener('click', generateWorksheetPreview);
    document.getElementById('finishStep4Btn').addEventListener('click', finishStep4);
    
    // Worksheet tab switching events
    document.querySelectorAll('.worksheet-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const worksheetNum = this.getAttribute('data-worksheet');
            const substep = this.closest('.substep-content').getAttribute('data-substep');
            switchWorksheetTab(worksheetNum, substep);
        });
    });
}

// Determine the number of worksheets based on LO count and allocation
function determineWorksheetCount() {
    // Default to 1 worksheet
    appState.worksheets.count = 1;
    
    // If we have 3 LOs and the allocation is not all the same worksheet
    if (appState.learningObjectives.lo3.exists) {
        const lo1Worksheet = appState.lessonStructure.worksheetAllocation.lo1;
        const lo2Worksheet = appState.lessonStructure.worksheetAllocation.lo2;
        const lo3Worksheet = appState.lessonStructure.worksheetAllocation.lo3;
        
        // Count distinct worksheet numbers
        const uniqueWorksheets = new Set([lo1Worksheet, lo2Worksheet, lo3Worksheet]).size;
        appState.worksheets.count = uniqueWorksheets;
    }
    
    // Update UI to reflect worksheet count
    updateWorksheetTabsVisibility();
}

// Initialize worksheet tabs UI
function initializeWorksheetTabs() {
    // For each substep with worksheet tabs
    const substeps = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    
    substeps.forEach(substep => {
        const tabsContainer = document.getElementById(`worksheetTabs${substep}`);
        if (!tabsContainer) return;
        
        // Clear existing tabs
        tabsContainer.innerHTML = '';
        
        // Add appropriate number of tabs
        if (appState.worksheets.count === 1) {
            tabsContainer.innerHTML = `
                <div class="worksheet-tab active" data-worksheet="1" data-substep="${substep}">Worksheet 1</div>
            `;
        } else {
            // Determine which LOs go on which worksheet
            const lo1Worksheet = appState.lessonStructure.worksheetAllocation.lo1;
            const lo2Worksheet = appState.lessonStructure.worksheetAllocation.lo2;
            const lo3Worksheet = appState.lessonStructure.worksheetAllocation.lo3;
            
            // Create tab labeling based on LO allocation
            let ws1Label = "Worksheet 1";
            let ws2Label = "Worksheet 2";
            
            if (lo1Worksheet === 1 && lo2Worksheet === 1 && lo3Worksheet === 2) {
                ws1Label = "Worksheet 1 (LO1, LO2)";
                ws2Label = "Worksheet 2 (LO3)";
            } else if (lo1Worksheet === 1 && lo2Worksheet === 2 && lo3Worksheet === 2) {
                ws1Label = "Worksheet 1 (LO1)";
                ws2Label = "Worksheet 2 (LO2, LO3)";
            } else if (lo1Worksheet === 1 && lo2Worksheet === 2 && lo3Worksheet === 1) {
                ws1Label = "Worksheet 1 (LO1, LO3)";
                ws2Label = "Worksheet 2 (LO2)";
            }
            
            tabsContainer.innerHTML = `
                <div class="worksheet-tab active" data-worksheet="1" data-substep="${substep}">${ws1Label}</div>
                <div class="worksheet-tab" data-worksheet="2" data-substep="${substep}">${ws2Label}</div>
            `;
        }
    });
}

// Update worksheet tabs visibility based on LO allocation
function updateWorksheetTabsVisibility() {
    document.querySelectorAll('.worksheet-tabs-container').forEach(container => {
        // Show all tabs container if we have multiple worksheets
        if (appState.worksheets.count > 1) {
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
    });
}

// Switch between worksheet tabs
function switchWorksheetTab(worksheetNum, substep) {
    // Update active tab
    document.querySelectorAll(`.worksheet-tab[data-substep="${substep}"]`).forEach(tab => {
        if (tab.getAttribute('data-worksheet') === worksheetNum) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Update active content
    document.querySelectorAll(`.worksheet-content[data-substep="${substep}"]`).forEach(content => {
        if (content.getAttribute('data-worksheet') === worksheetNum) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // Update current worksheet in state
    appState.worksheets.current = parseInt(worksheetNum);
    
    // Update UI based on which LOs are in the current worksheet
    updateUIForCurrentWorksheet(substep);
}

// Update UI elements based on which LOs are in the current worksheet
function updateUIForCurrentWorksheet(substep) {
    const currentWorksheet = appState.worksheets.current;
    
    // Get LOs that are in the current worksheet
    const losInWorksheet = getLOsInWorksheet(currentWorksheet);
    
    // Enable/disable sections based on LO allocation
    toggleWorksheetSectionsVisibility(substep, losInWorksheet);
}

// Get which LOs are in a specific worksheet
function getLOsInWorksheet(worksheetNum) {
    const result = [];
    
    if (appState.lessonStructure.worksheetAllocation.lo1 === worksheetNum) {
        result.push(1);
    }
    
    if (appState.lessonStructure.worksheetAllocation.lo2 === worksheetNum) {
        result.push(2);
    }
    
    if (appState.learningObjectives.lo3.exists && 
        appState.lessonStructure.worksheetAllocation.lo3 === worksheetNum) {
        result.push(3);
    }
    
    return result;
}

// Toggle visibility of worksheet sections based on LOs in worksheet
function toggleWorksheetSectionsVisibility(substep, losInWorksheet) {
    // Different logic based on substep
    switch(substep) {
        case 'A':
            // Reference materials are shared across worksheets
            break;
            
        case 'B':
            // Prior knowledge questions - show only relevant LO sections
            document.querySelectorAll('.retrieval-lo-container').forEach(container => {
                const loNum = parseInt(container.getAttribute('data-lo'));
                if (losInWorksheet.includes(loNum)) {
                    container.style.display = 'block';
                } else {
                    container.style.display = 'none';
                }
            });
            break;
            
        case 'C':
            // SCALE questions - show only relevant LO sections
            document.querySelectorAll('.scale-lo-container').forEach(container => {
                const loNum = parseInt(container.getAttribute('data-lo'));
                if (losInWorksheet.includes(loNum)) {
                    container.style.display = 'block';
                } else {
                    container.style.display = 'none';
                }
            });
            break;
            
        case 'D':
            // Application questions - show only relevant LO sections
            document.querySelectorAll('.application-lo-container').forEach(container => {
                const loNum = parseInt(container.getAttribute('data-lo'));
                if (losInWorksheet.includes(loNum)) {
                    container.style.display = 'block';
                } else {
                    container.style.display = 'none';
                }
            });
            break;
            
        case 'E':
            // Exam technique questions - show only relevant LO sections
            document.querySelectorAll('.exam-technique-lo-container').forEach(container => {
                const loNum = parseInt(container.getAttribute('data-lo'));
                if (losInWorksheet.includes(loNum)) {
                    container.style.display = 'block';
                } else {
                    container.style.display = 'none';
                }
            });
            break;
            
        case 'F':
            // Exam style questions - show only relevant LO sections
            document.querySelectorAll('.exam-style-lo-container').forEach(container => {
                const loNum = parseInt(container.getAttribute('data-lo'));
                if (losInWorksheet.includes(loNum)) {
                    container.style.display = 'block';
                } else {
                    container.style.display = 'none';
                }
            });
            break;
            
        case 'G':
            // Worksheet finalization - all controls apply to current worksheet
            break;
    }
}

//
// STEP 4A: REFERENCE MATERIALS
//

// Prepare the reference materials substep
function prepareReferenceMaterialsSubstep() {
    // Display learning objectives summary
    displayLearningObjectivesForWorksheets();
    
    // Show previously saved data if it exists
    if (appState.responseTags.referenceMaterials) {
        renderReferenceMaterials();
        document.getElementById('continueToRetrievalBtn').disabled = false;
    }
}

// Generate prompt for reference materials
function generateReferenceMaterialsPrompt() {
    // Get relevant data for the prompt
    const provider = appState.lessonInfo.provider;
    const subject = appState.lessonInfo.subject;
    const topic = appState.lessonInfo.topic;
    const level = appState.lessonInfo.level;
    const ability = appState.lessonInfo.ability;
    
    // Get learning objectives
    let loText = '';
    
    loText += `Learning Objective 1: ${appState.learningObjectives.lo1.title}\n`;
    loText += `Description: ${appState.learningObjectives.lo1.description}\n\n`;
    
    loText += `Learning Objective 2: ${appState.learningObjectives.lo2.title}\n`;
    loText += `Description: ${appState.learningObjectives.lo2.description}\n\n`;
    
    if (appState.learningObjectives.lo3.exists) {
        loText += `Learning Objective 3: ${appState.learningObjectives.lo3.title}\n`;
        loText += `Description: ${appState.learningObjectives.lo3.description}\n\n`;
    }
    
    // Create the prompt
    const prompt = `Please create comprehensive reference materials for a ${level} tier ${subject} GCSE worksheet focused on ${topic} for ${ability} students following the ${provider} specification. 

The worksheet will support these learning objectives:
${loText}

I need the following reference materials formatted with XML tags:

1. <definitions>: Create 3-5 clear definitions of key terms relevant to these learning objectives.
2. <formulas>: Provide any relevant formulas, equations, or mathematical relationships (with units).
3. <diagrams>: Describe 1-3 essential diagrams that would help understanding (detailed descriptions that could be illustrated).
4. <examples>: Provide 2-3 worked examples that demonstrate application of key concepts.

For each item, include:
- Brief title or label
- Clear, concise content appropriate for ${ability} ${level} students
- Explanation of relevance to the learning objectives
- Age-appropriate language and complexity

Please structure your response using the following XML format:
<referenceMaterials>
    <definitions>
        [List of definitions with titles and explanations]
    </definitions>
    <formulas>
        [List of formulas with titles, expressions, and explanations]
    </formulas>
    <diagrams>
        [List of diagram descriptions with titles and explanations]
    </diagrams>
    <examples>
        [List of worked examples with titles, steps, and explanations]
    </examples>
</referenceMaterials>`;

    // Set the prompt in the textarea
    document.getElementById('referenceMaterialsPromptTextarea').value = prompt;
}

// Handle response for reference materials
function handleReferenceMaterialsResponse() {
    const responseText = document.getElementById('referenceMaterialsResponseTextarea').value;
    if (!responseText) return;
    
    // Store response
    appState.responses.referenceMaterials = responseText;
    
    // Extract XML tags from response
    const referenceMaterialsMatch = /<referenceMaterials>([\s\S]*?)<\/referenceMaterials>/g.exec(responseText);
    
    if (referenceMaterialsMatch && referenceMaterialsMatch[1]) {
        appState.responseTags.referenceMaterials = referenceMaterialsMatch[0];
        
        // Parse other tags
        parseReferenceMaterialsContent(referenceMaterialsMatch[0]);
        
        // Render the content
        renderReferenceMaterials();
        
        // Enable continue button
        document.getElementById('continueToRetrievalBtn').disabled = false;
    }
}

// Parse reference materials content from XML
function parseReferenceMaterialsContent(xml) {
    // Parse definitions
    const definitionsMatch = /<definitions>([\s\S]*?)<\/definitions>/g.exec(xml);
    if (definitionsMatch && definitionsMatch[1]) {
        appState.worksheets.reference.definitions = parseDefinitions(definitionsMatch[1]);
    }
    
    // Parse formulas
    const formulasMatch = /<formulas>([\s\S]*?)<\/formulas>/g.exec(xml);
    if (formulasMatch && formulasMatch[1]) {
        appState.worksheets.reference.formulas = parseFormulas(formulasMatch[1]);
    }
    
    // Parse diagrams
    const diagramsMatch = /<diagrams>([\s\S]*?)<\/diagrams>/g.exec(xml);
    if (diagramsMatch && diagramsMatch[1]) {
        appState.worksheets.reference.diagrams = parseDiagrams(diagramsMatch[1]);
    }
    
    // Parse examples
    const examplesMatch = /<examples>([\s\S]*?)<\/examples>/g.exec(xml);
    if (examplesMatch && examplesMatch[1]) {
        appState.worksheets.reference.examples = parseExamples(examplesMatch[1]);
    }
}

// Parse definitions from XML content
function parseDefinitions(content) {
    const definitions = [];
    
    // Look for definition items
    const regex = /<definition>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<explanation>([\s\S]*?)<\/explanation>[\s\S]*?<\/definition>/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        definitions.push({
            title: match[1].trim(),
            explanation: match[2].trim()
        });
    }
    
    return definitions;
}

// Parse formulas from XML content
function parseFormulas(content) {
    const formulas = [];
    
    // Look for formula items
    const regex = /<formula>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<expression>([\s\S]*?)<\/expression>[\s\S]*?<explanation>([\s\S]*?)<\/explanation>[\s\S]*?<\/formula>/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        formulas.push({
            title: match[1].trim(),
            expression: match[2].trim(),
            explanation: match[3].trim()
        });
    }
    
    return formulas;
}

// Parse diagrams from XML content
function parseDiagrams(content) {
    const diagrams = [];
    
    // Look for diagram items
    const regex = /<diagram>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<description>([\s\S]*?)<\/description>[\s\S]*?<explanation>([\s\S]*?)<\/explanation>[\s\S]*?<\/diagram>/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        diagrams.push({
            title: match[1].trim(),
            description: match[2].trim(),
            explanation: match[3].trim()
        });
    }
    
    return diagrams;
}

// Parse examples from XML content
function parseExamples(content) {
    const examples = [];
    
    // Look for example items
    const regex = /<example>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<steps>([\s\S]*?)<\/steps>[\s\S]*?<explanation>([\s\S]*?)<\/explanation>[\s\S]*?<\/example>/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        examples.push({
            title: match[1].trim(),
            steps: match[2].trim(),
            explanation: match[3].trim()
        });
    }
    
    return examples;
}

// Render reference materials in the UI
function renderReferenceMaterials() {
    // Create UI for definitions
    const definitionsContent = document.getElementById('definitionsContent');
    definitionsContent.innerHTML = '';
    
    if (appState.worksheets.reference.definitions.length > 0) {
        appState.worksheets.reference.definitions.forEach(def => {
            const item = document.createElement('div');
            item.className = 'reference-item';
            item.innerHTML = `
                <div class="reference-title">${def.title}</div>
                <div class="reference-text">${def.explanation}</div>
            `;
            definitionsContent.appendChild(item);
        });
    } else {
        definitionsContent.innerHTML = '<p>No definitions available yet.</p>';
    }
    
    // Create UI for formulas
    const formulasContent = document.getElementById('formulasContent');
    formulasContent.innerHTML = '';
    
    if (appState.worksheets.reference.formulas.length > 0) {
        appState.worksheets.reference.formulas.forEach(formula => {
            const item = document.createElement('div');
            item.className = 'reference-item';
            item.innerHTML = `
                <div class="reference-title">${formula.title}</div>
                <div class="reference-formula">${formula.expression}</div>
                <div class="reference-text">${formula.explanation}</div>
            `;
            formulasContent.appendChild(item);
        });
    } else {
        formulasContent.innerHTML = '<p>No formulas available yet.</p>';
    }
    
    // Create UI for diagrams
    const diagramsContent = document.getElementById('diagramsContent');
    diagramsContent.innerHTML = '';
    
    if (appState.worksheets.reference.diagrams.length > 0) {
        appState.worksheets.reference.diagrams.forEach(diagram => {
            const item = document.createElement('div');
            item.className = 'reference-item';
            item.innerHTML = `
                <div class="reference-title">${diagram.title}</div>
                <div class="reference-text"><strong>Description:</strong> ${diagram.description}</div>
                <div class="reference-text">${diagram.explanation}</div>
            `;
            diagramsContent.appendChild(item);
        });
    } else {
        diagramsContent.innerHTML = '<p>No diagrams available yet.</p>';
    }
    
    // Create UI for examples
    const examplesContent = document.getElementById('examplesContent');
    examplesContent.innerHTML = '';
    
    if (appState.worksheets.reference.examples.length > 0) {
        appState.worksheets.reference.examples.forEach(example => {
            const item = document.createElement('div');
            item.className = 'reference-item';
            item.innerHTML = `
                <div class="reference-title">${example.title}</div>
                <div class="reference-text"><strong>Steps:</strong><br>${example.steps}</div>
                <div class="reference-text">${example.explanation}</div>
            `;
            examplesContent.appendChild(item);
        });
    } else {
        examplesContent.innerHTML = '<p>No examples available yet.</p>';
    }
    
    // Show edit container
    document.getElementById('referenceMaterialsEditContainer').style.display = 'block';
}

// Open the definitions edit modal
function openDefinitionsEditModal() {
    // Populate modal with existing definitions
    const container = document.getElementById('definitionsEditList');
    container.innerHTML = '';
    
    if (appState.worksheets.reference.definitions.length > 0) {
        appState.worksheets.reference.definitions.forEach((def, index) => {
            addDefinitionField(def.title, def.explanation, index);
        });
    } else {
        // Add an empty definition field if none exist
        addDefinitionField('', '', 0);
    }
    
    // Set temporary state
    appState.editState.tempDefinitions = [...appState.worksheets.reference.definitions];
    
    // Open the modal
    openWorksheetEditModal('definitionsEditModal');
}

// Add a new definition field to the modal
function addDefinitionField(title = '', explanation = '', index = -1) {
    const container = document.getElementById('definitionsEditList');
    const newIndex = index >= 0 ? index : container.children.length;
    
    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'edit-item-group';
    fieldGroup.innerHTML = `
        <div class="edit-item-header">
            <span>Definition ${newIndex + 1}</span>
            <button type="button" class="btn-icon" onclick="removeDefinitionField(${newIndex})">×</button>
        </div>
        <div class="form-group">
            <label>Term/Title:</label>
            <input type="text" class="form-control def-title" value="${title}" placeholder="Enter term or title">
        </div>
        <div class="form-group">
            <label>Explanation:</label>
            <textarea class="form-control def-explanation" rows="3" placeholder="Enter definition explanation">${explanation}</textarea>
        </div>
    `;
    container.appendChild(fieldGroup);
}

// Remove a definition field from the modal
function removeDefinitionField(index) {
    const container = document.getElementById('definitionsEditList');
    if (container.children[index]) {
        container.removeChild(container.children[index]);
        
        // Renumber remaining items
        Array.from(container.children).forEach((item, i) => {
            const header = item.querySelector('.edit-item-header span');
            if (header) {
                header.textContent = `Definition ${i + 1}`;
            }
            
            // Update remove button index
            const removeBtn = item.querySelector('.btn-icon');
            if (removeBtn) {
                removeBtn.setAttribute('onclick', `removeDefinitionField(${i})`);
            }
        });
    }
}

// Save definitions from the modal
function saveDefinitions() {
    const container = document.getElementById('definitionsEditList');
    const definitions = [];
    
    // Gather all definitions from form
    Array.from(container.children).forEach(item => {
        const titleInput = item.querySelector('.def-title');
        const explanationInput = item.querySelector('.def-explanation');
        
        if (titleInput && explanationInput && titleInput.value.trim()) {
            definitions.push({
                title: titleInput.value.trim(),
                explanation: explanationInput.value.trim()
            });
        }
    });
    
    // Update state
    appState.worksheets.reference.definitions = definitions;
    
    // Re-render
    renderReferenceMaterials();
    
    // Close modal
    closeModal('definitionsEditModal');
}

// Open edit modals for formulas, diagrams, and examples would follow similar patterns
// Adding implementations for formulas as example

// Open the formulas edit modal
function openFormulasEditModal() {
    // Populate modal with existing formulas
    const container = document.getElementById('formulasEditList');
    container.innerHTML = '';
    
    if (appState.worksheets.reference.formulas.length > 0) {
        appState.worksheets.reference.formulas.forEach((formula, index) => {
            addFormulaField(formula.title, formula.expression, formula.explanation, index);
        });
    } else {
        // Add an empty formula field if none exist
        addFormulaField('', '', '', 0);
    }
    
    // Set temporary state
    appState.editState.tempFormulas = [...appState.worksheets.reference.formulas];
    
    // Open the modal
    openWorksheetEditModal('formulasEditModal');
}

// Add a new formula field to the modal
function addFormulaField(title = '', expression = '', explanation = '', index = -1) {
    const container = document.getElementById('formulasEditList');
    const newIndex = index >= 0 ? index : container.children.length;
    
    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'edit-item-group';
    fieldGroup.innerHTML = `
        <div class="edit-item-header">
            <span>Formula ${newIndex + 1}</span>
            <button type="button" class="btn-icon" onclick="removeFormulaField(${newIndex})">×</button>
        </div>
        <div class="form-group">
            <label>Title:</label>
            <input type="text" class="form-control formula-title" value="${title}" placeholder="Enter formula title">
        </div>
        <div class="form-group">
            <label>Expression:</label>
            <input type="text" class="form-control formula-expression" value="${expression}" placeholder="Enter formula expression">
        </div>
        <div class="form-group">
            <label>Explanation:</label>
            <textarea class="form-control formula-explanation" rows="3" placeholder="Enter formula explanation">${explanation}</textarea>
        </div>
    `;
    container.appendChild(fieldGroup);
}

// Remove a formula field from the modal
function removeFormulaField(index) {
    const container = document.getElementById('formulasEditList');
    if (container.children[index]) {
        container.removeChild(container.children[index]);
        
        // Renumber remaining items
        Array.from(container.children).forEach((item, i) => {
            const header = item.querySelector('.edit-item-header span');
            if (header) {
                header.textContent = `Formula ${i + 1}`;
            }
            
            // Update remove button index
            const removeBtn = item.querySelector('.btn-icon');
            if (removeBtn) {
                removeBtn.setAttribute('onclick', `removeFormulaField(${i})`);
            }
        });
    }
}

// Save formulas from the modal
function saveFormulas() {
    const container = document.getElementById('formulasEditList');
    const formulas = [];
    
    // Gather all formulas from form
    Array.from(container.children).forEach(item => {
        const titleInput = item.querySelector('.formula-title');
        const expressionInput = item.querySelector('.formula-expression');
        const explanationInput = item.querySelector('.formula-explanation');
        
        if (titleInput && expressionInput && explanationInput && titleInput.value.trim()) {
            formulas.push({
                title: titleInput.value.trim(),
                expression: expressionInput.value.trim(),
                explanation: explanationInput.value.trim()
            });
        }
    });
    
    // Update state
    appState.worksheets.reference.formulas = formulas;
    
    // Re-render
    renderReferenceMaterials();
    
    // Close modal
    closeModal('formulasEditModal');
}

// Similar implementations would exist for diagrams and examples
// We'll implement skeleton functions as placeholders

// Diagram functions
function openDiagramsEditModal() { /* Implementation similar to definitions/formulas */ }
function addDiagramField() { /* Implementation similar to addDefinitionField */ }
function removeDiagramField() { /* Implementation similar to removeDefinitionField */ }
function saveDiagrams() { /* Implementation similar to saveDefinitions */ }

// Example functions
function openExamplesEditModal() { /* Implementation similar to definitions/formulas */ }
function addExampleField() { /* Implementation similar to addDefinitionField */ }
function removeExampleField() { /* Implementation similar to removeDefinitionField */ }
function saveExamples() { /* Implementation similar to saveDefinitions */ }

//
// STEP 4B: PRIOR KNOWLEDGE RETRIEVAL
//

// Prepare the retrieval worksheet substep
function prepareRetrievalWorksheetSubstep() {
    // Display prior knowledge summary for retrieval
    displayPriorKnowledgeForWorksheets();
    
    // Update worksheet tabs
    initializeWorksheetTabs();
    
    // Show previously saved data if it exists
    if (appState.responseTags.retrievalWorksheet) {
        renderRetrievalWorksheetQuestions();
        document.getElementById('continueToScaleQuestionsBtn').disabled = false;
    }
}

// Generate prompt for retrieval worksheet questions
function generateRetrievalWorksheetPrompt() {
    // Get relevant data for the prompt
    const provider = appState.lessonInfo.provider;
    const subject = appState.lessonInfo.subject;
    const topic = appState.lessonInfo.topic;
    const level = appState.lessonInfo.level;
    const ability = appState.lessonInfo.ability;
    
    // Get prior knowledge for each LO
    let priorKnowledgeText = '';
    
    priorKnowledgeText += `Learning Objective 1 Prior Knowledge:\n`;
    appState.priorKnowledge.lo1.forEach((item, index) => {
        priorKnowledgeText += `${index + 1}. ${item}\n`;
    });
    priorKnowledgeText += '\n';
    
    priorKnowledgeText += `Learning Objective 2 Prior Knowledge:\n`;
    appState.priorKnowledge.lo2.forEach((item, index) => {
        priorKnowledgeText += `${index + 1}. ${item}\n`;
    });
    priorKnowledgeText += '\n';
    
    if (appState.learningObjectives.lo3.exists) {
        priorKnowledgeText += `Learning Objective 3 Prior Knowledge:\n`;
        appState.priorKnowledge.lo3.forEach((item, index) => {
            priorKnowledgeText += `${index + 1}. ${item}\n`;
        });
        priorKnowledgeText += '\n';
    }
    
    // Get worksheet allocation info
    const worksheetCount = appState.worksheets.count;
    let worksheetAllocationText = '';
    
    if (worksheetCount > 1) {
        worksheetAllocationText = `
Learning objectives are allocated to worksheets as follows:
- Learning Objective 1: Worksheet ${appState.lessonStructure.worksheetAllocation.lo1}
- Learning Objective 2: Worksheet ${appState.lessonStructure.worksheetAllocation.lo2}`;
        
        if (appState.learningObjectives.lo3.exists) {
            worksheetAllocationText += `
- Learning Objective 3: Worksheet ${appState.lessonStructure.worksheetAllocation.lo3}`;
        }
    }
    
    // Create the prompt
    const prompt = `Please create retrieval practice questions for a ${level} tier ${subject} GCSE worksheet on ${topic} for ${ability} students following the ${provider} specification.

The worksheet will have ${worksheetCount} worksheet(s).${worksheetCount > 1 ? worksheetAllocationText : ''}

Base your questions on the following prior knowledge requirements for each learning objective:

${priorKnowledgeText}

Please create a total of 5-8 retrieval practice questions per worksheet, ensuring each learning objective has at least 2 questions that target its prior knowledge.

For each question:
1. Clearly indicate which learning objective's prior knowledge it relates to
2. Make sure it directly targets specific prior knowledge items
3. Include a variety of question types (multiple choice, short answer, fill-in-the-blank, true/false, matching)
4. Ensure questions are appropriately challenging for ${ability} ${level} students
5. Provide clear model answers

Please structure your response using the following XML format:
<retrievalWorksheet>
    <worksheet number="1">
        <questions>
            <question>
                <text>Question text here</text>
                <type>multiple-choice/short-answer/etc</type>
                <relatedLO>1</relatedLO>
                <priorKnowledgeReference>Specific prior knowledge item being tested</priorKnowledgeReference>
                <answer>Model answer here</answer>
                <options>
                    <option>Only for multiple choice questions</option>
                    <!-- More options as needed -->
                </options>
            </question>
            <!-- More questions -->
        </questions>
    </worksheet>
    ${worksheetCount > 1 ? `
    <worksheet number="2">
        <questions>
            <!-- Questions for worksheet 2 -->
        </questions>
    </worksheet>` : ''}
</retrievalWorksheet>`;

    // Set the prompt in the textarea
    document.getElementById('retrievalWorksheetPromptTextarea').value = prompt;
}

// Handle response for retrieval worksheet questions
function handleRetrievalWorksheetResponse() {
    const responseText = document.getElementById('retrievalWorksheetResponseTextarea').value;
    if (!responseText) return;
    
    // Store response
    appState.responses.retrievalWorksheet = responseText;
    
    // Extract XML tags from response
    const retrievalWorksheetMatch = /<retrievalWorksheet>([\s\S]*?)<\/retrievalWorksheet>/g.exec(responseText);
    
    if (retrievalWorksheetMatch && retrievalWorksheetMatch[1]) {
        appState.responseTags.retrievalWorksheet = retrievalWorksheetMatch[0];
        
        // Parse questions
        parseRetrievalWorksheetContent(retrievalWorksheetMatch[0]);
        
        // Render the content
        renderRetrievalWorksheetQuestions();
        
        // Enable continue button
        document.getElementById('continueToScaleQuestionsBtn').disabled = false;
    }
}

// Parse retrieval worksheet content from XML
function parseRetrievalWorksheetContent(xml) {
    // Initialize retrieval questions
    appState.worksheets.retrieval.worksheet1 = [];
    appState.worksheets.retrieval.worksheet2 = [];
    
    // Parse worksheet 1
    const worksheet1Match = /<worksheet number="1">([\s\S]*?)<\/worksheet>/g.exec(xml);
    if (worksheet1Match && worksheet1Match[1]) {
        const questionsMatch = /<questions>([\s\S]*?)<\/questions>/g.exec(worksheet1Match[1]);
        if (questionsMatch && questionsMatch[1]) {
            appState.worksheets.retrieval.worksheet1 = parseRetrievalQuestions(questionsMatch[1]);
        }
    }
    
    // Parse worksheet 2 if it exists
    const worksheet2Match = /<worksheet number="2">([\s\S]*?)<\/worksheet>/g.exec(xml);
    if (worksheet2Match && worksheet2Match[1]) {
        const questionsMatch = /<questions>([\s\S]*?)<\/questions>/g.exec(worksheet2Match[1]);
        if (questionsMatch && questionsMatch[1]) {
            appState.worksheets.retrieval.worksheet2 = parseRetrievalQuestions(questionsMatch[1]);
        }
    }
}

// Parse retrieval questions from XML content
function parseRetrievalQuestions(content) {
    const questions = [];
    
    // Look for question items
    const regex = /<question>([\s\S]*?)<\/question>/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        const questionContent = match[1];
        
        // Extract individual fields
        const textMatch = /<text>([\s\S]*?)<\/text>/g.exec(questionContent);
        const typeMatch = /<type>([\s\S]*?)<\/type>/g.exec(questionContent);
        const relatedLOMatch = /<relatedLO>([\s\S]*?)<\/relatedLO>/g.exec(questionContent);
        const priorKnowledgeMatch = /<priorKnowledgeReference>([\s\S]*?)<\/priorKnowledgeReference>/g.exec(questionContent);
        const answerMatch = /<answer>([\s\S]*?)<\/answer>/g.exec(questionContent);
        
        // Extract options for multiple choice
        const options = [];
        const optionsMatch = /<options>([\s\S]*?)<\/options>/g.exec(questionContent);
        if (optionsMatch && optionsMatch[1]) {
            const optionRegex = /<option>([\s\S]*?)<\/option>/g;
            let optionMatch;
            while ((optionMatch = optionRegex.exec(optionsMatch[1])) !== null) {
                options.push(optionMatch[1].trim());
            }
        }
        
        questions.push({
            text: textMatch ? textMatch[1].trim() : '',
            type: typeMatch ? typeMatch[1].trim() : '',
            relatedLO: relatedLOMatch ? parseInt(relatedLOMatch[1].trim()) : 1,
            priorKnowledgeReference: priorKnowledgeMatch ? priorKnowledgeMatch[1].trim() : '',
            answer: answerMatch ? answerMatch[1].trim() : '',
            options: options
        });
    }
    
    return questions;
}

// Render retrieval worksheet questions in the UI
function renderRetrievalWorksheetQuestions() {
    // Function to render questions for a specific worksheet
    const renderQuestionsForWorksheet = (worksheetNum) => {
        const questionsContainer = document.getElementById(`retrievalQuestionsWS${worksheetNum}`);
        if (!questionsContainer) return;
        
        // Clear container
        questionsContainer.innerHTML = '';
        
        // Get questions for this worksheet
        const questions = worksheetNum === 1 ? 
            appState.worksheets.retrieval.worksheet1 : 
            appState.worksheets.retrieval.worksheet2;
        
        if (questions.length === 0) {
            questionsContainer.innerHTML = '<p>No retrieval questions available for this worksheet.</p>';
            return;
        }
        
        // Group questions by learning objective
        const loQuestions = {
            1: [],
            2: [],
            3: []
        };
        
        questions.forEach(q => {
            if (q.relatedLO >= 1 && q.relatedLO <= 3) {
                loQuestions[q.relatedLO].push(q);
            }
        });
        
        // Render questions for each LO
        for (let lo = 1; lo <= 3; lo++) {
            // Skip if no questions for this LO or if LO3 doesn't exist
            if (loQuestions[lo].length === 0 || (lo === 3 && !appState.learningObjectives.lo3.exists)) {
                continue;
            }
            
            // Create container for this LO's questions
            const loContainer = document.createElement('div');
            loContainer.className = 'retrieval-lo-container';
            loContainer.setAttribute('data-lo', lo);
            
            // Create header
            const loHeader = document.createElement('div');
            loHeader.className = 'retrieval-lo-header';
            loHeader.innerHTML = `<h4>Learning Objective ${lo} Retrieval Questions</h4>`;
            loContainer.appendChild(loHeader);
            
            // Create questions list
            const questionsList = document.createElement('div');
            questionsList.className = 'retrieval-questions-list';
            
            loQuestions[lo].forEach((q, index) => {
                const questionItem = document.createElement('div');
                questionItem.className = 'retrieval-question-item';
                
                // Format based on question type
                let questionContent = '';
                
                if (q.type === 'multiple-choice') {
                    questionContent = `
                        <div class="question-text">${index + 1}. ${q.text}</div>
                        <div class="question-options">
                            ${q.options.map(opt => `<div class="question-option">${opt}</div>`).join('')}
                        </div>
                        <div class="question-answer"><strong>Answer:</strong> ${q.answer}</div>
                        <div class="question-metadata">
                            <span class="question-type">${q.type}</span>
                            <span class="question-prior-knowledge">Tests: ${q.priorKnowledgeReference}</span>
                        </div>
                    `;
                } else {
                    questionContent = `
                        <div class="question-text">${index + 1}. ${q.text}</div>
                        <div class="question-answer"><strong>Answer:</strong> ${q.answer}</div>
                        <div class="question-metadata">
                            <span class="question-type">${q.type}</span>
                            <span class="question-prior-knowledge">Tests: ${q.priorKnowledgeReference}</span>
                        </div>
                    `;
                }
                
                questionItem.innerHTML = questionContent;
                questionsList.appendChild(questionItem);
            });
            
            loContainer.appendChild(questionsList);
            questionsContainer.appendChild(loContainer);
        }
    };
    
    // Render for each worksheet
    renderQuestionsForWorksheet(1);
    if (appState.worksheets.count > 1) {
        renderQuestionsForWorksheet(2);
    }
    
    // Show edit container
    document.getElementById('retrievalWorksheetEditContainer').style.display = 'block';
    
    // Update UI based on current worksheet
    updateUIForCurrentWorksheet('B');
}

// Skipping edit functionality for brevity - would follow similar patterns to reference materials

//
// STEP 4C: SCALE QUESTIONS
//

// Prepare the SCALE questions substep
function prepareScaleQuestionsSubstep() {
    // Display learning objectives for SCALE questions
    displayLearningObjectivesForScaleQuestions();
    
    // Update worksheet tabs
    initializeWorksheetTabs();
    
    // Show previously saved data if it exists
    if (appState.responseTags.scaleQuestions) {
        renderScaleQuestions();
        document.getElementById('continueToApplicationQuestionsBtn').disabled = false;
    }
}

// Generate prompt for SCALE questions
function generateScaleQuestionsPrompt() {
    // Get relevant data for the prompt
    const provider = appState.lessonInfo.provider;
    const subject = appState.lessonInfo.subject;
    const topic = appState.lessonInfo.topic;
    const level = appState.lessonInfo.level;
    const ability = appState.lessonInfo.ability;
    
    // Get learning objectives
    let loText = '';
    
    loText += `Learning Objective 1: ${appState.learningObjectives.lo1.title}\n`;
    loText += `Description: ${appState.learningObjectives.lo1.description}\n`;
    loText += `Type: ${appState.loTypes.lo1.aoCategory} - ${appState.loTypes.lo1.specificType}\n\n`;
    
    loText += `Learning Objective 2: ${appState.learningObjectives.lo2.title}\n`;
    loText += `Description: ${appState.learningObjectives.lo2.description}\n`;
    loText += `Type: ${appState.loTypes.lo2.aoCategory} - ${appState.loTypes.lo2.specificType}\n\n`;
    
    if (appState.learningObjectives.lo3.exists) {
        loText += `Learning Objective 3: ${appState.learningObjectives.lo3.title}\n`;
        loText += `Description: ${appState.learningObjectives.lo3.description}\n`;
        loText += `Type: ${appState.loTypes.lo3.aoCategory} - ${appState.loTypes.lo3.specificType}\n\n`;
    }
    
    // Get worksheet allocation info
    const worksheetCount = appState.worksheets.count;
    let worksheetAllocationText = '';
    
    if (worksheetCount > 1) {
        worksheetAllocationText = `
Learning objectives are allocated to worksheets as follows:
- Learning Objective 1: Worksheet ${appState.lessonStructure.worksheetAllocation.lo1}
- Learning Objective 2: Worksheet ${appState.lessonStructure.worksheetAllocation.lo2}`;
        
        if (appState.learningObjectives.lo3.exists) {
            worksheetAllocationText += `
- Learning Objective 3: Worksheet ${appState.lessonStructure.worksheetAllocation.lo3}`;
        }
    }
    
    // Create the prompt
    const prompt = `Please create SCALE framework questions for ${level} tier ${subject} GCSE worksheets on ${topic} for ${ability} students following the ${provider} specification.

The worksheet will have ${worksheetCount} worksheet(s).${worksheetCount > 1 ? worksheetAllocationText : ''}

Base your questions on these learning objectives:
${loText}

I need you to create SCALE framework questions for each learning objective. The SCALE framework has 5 categories:
1. **S - Simple Recognition**: Questions that test recall of key terms, facts, or concepts
2. **C - Conceptual Understanding**: Questions that check understanding of concepts, relationships, or principles
3. **A - Application**: Questions that require applying knowledge to new situations or problems
4. **L - Linking Ideas**: Questions that connect different concepts or topics, exploring relationships
5. **E - Extended Thinking**: Questions that require deeper analysis, evaluation, or creation

For each learning objective, please create 2 questions for each SCALE category (10 questions per learning objective), with varying cognitive demand levels:
- 30% Low cognitive demand (simpler questions)
- 40% Medium cognitive demand
- 30% High cognitive demand (more challenging questions)

Please structure your response using the following XML format:
<scaleQuestions>
    <worksheet number="1">
        <learningObjective number="1">
            <question>
                <category>S/C/A/L/E</category>
                <cognitiveLevel>Low/Medium/High</cognitiveLevel>
                <text>Question text here</text>
                <answer>Model answer here</answer>
                <markScheme>Brief marking guidance</markScheme>
                <points>Number of marks (1-4)</points>
            </question>
            <!-- More questions -->
        </learningObjective>
        <!-- More learning objectives -->
    </worksheet>
    ${worksheetCount > 1 ? `
    <worksheet number="2">
        <!-- Similar structure for worksheet 2 -->
    </worksheet>` : ''}
</scaleQuestions>`;

    // Set the prompt in the textarea
    document.getElementById('scaleQuestionsPromptTextarea').value = prompt;
}

// Handle response for SCALE questions
function handleScaleQuestionsResponse() {
    const responseText = document.getElementById('scaleQuestionsResponseTextarea').value;
    if (!responseText) return;
    
    // Store response
    appState.responses.scaleQuestions = responseText;
    
    // Extract XML tags from response
    const scaleQuestionsMatch = /<scaleQuestions>([\s\S]*?)<\/scaleQuestions>/g.exec(responseText);
    
    if (scaleQuestionsMatch && scaleQuestionsMatch[1]) {
        appState.responseTags.scaleQuestions = scaleQuestionsMatch[0];
        
        // Parse SCALE questions
        parseScaleQuestionsContent(scaleQuestionsMatch[0]);
        
        // Render the content
        renderScaleQuestions();
        
        // Enable continue button
        document.getElementById('continueToApplicationQuestionsBtn').disabled = false;
    }
}

// Parse SCALE questions content from XML
function parseScaleQuestionsContent(xml) {
    // Initialize SCALE questions
    appState.worksheets.scale = {
        worksheet1: {
            lo1: [],
            lo2: [],
            lo3: []
        },
        worksheet2: {
            lo1: [],
            lo2: [],
            lo3: []
        }
    };
    
    // Parse worksheet 1
    const worksheet1Match = /<worksheet number="1">([\s\S]*?)<\/worksheet>/g.exec(xml);
    if (worksheet1Match && worksheet1Match[1]) {
        parseScaleQuestionsForWorksheet(worksheet1Match[1], 1);
    }
    
    // Parse worksheet 2 if it exists
    const worksheet2Match = /<worksheet number="2">([\s\S]*?)<\/worksheet>/g.exec(xml);
    if (worksheet2Match && worksheet2Match[1]) {
        parseScaleQuestionsForWorksheet(worksheet2Match[1], 2);
    }
}

// Parse SCALE questions for a specific worksheet
function parseScaleQuestionsForWorksheet(worksheetContent, worksheetNum) {
    // Parse each learning objective
    for (let lo = 1; lo <= 3; lo++) {
        if (lo === 3 && !appState.learningObjectives.lo3.exists) continue;
        
        const loMatch = new RegExp(`<learningObjective number="${lo}">([\\\s\\\S]*?)<\/learningObjective>`, 'g').exec(worksheetContent);
        if (loMatch && loMatch[1]) {
            const questions = parseScaleQuestionsForLO(loMatch[1]);
            
            // Store in appropriate location
            if (worksheetNum === 1) {
                appState.worksheets.scale.worksheet1[`lo${lo}`] = questions;
            } else {
                appState.worksheets.scale.worksheet2[`lo${lo}`] = questions;
            }
        }
    }
}

// Parse SCALE questions for a specific learning objective
function parseScaleQuestionsForLO(loContent) {
    const questions = [];
    
    // Look for question items
    const regex = /<question>([\s\S]*?)<\/question>/g;
    let match;
    
    while ((match = regex.exec(loContent)) !== null) {
        const questionContent = match[1];
        
        // Extract individual fields
        const categoryMatch = /<category>([\s\S]*?)<\/category>/g.exec(questionContent);
        const cognitiveLevelMatch = /<cognitiveLevel>([\s\S]*?)<\/cognitiveLevel>/g.exec(questionContent);
        const textMatch = /<text>([\s\S]*?)<\/text>/g.exec(questionContent);
        const answerMatch = /<answer>([\s\S]*?)<\/answer>/g.exec(questionContent);
        const markSchemeMatch = /<markScheme>([\s\S]*?)<\/markScheme>/g.exec(questionContent);
        const pointsMatch = /<points>([\s\S]*?)<\/points>/g.exec(questionContent);
        
        questions.push({
            category: categoryMatch ? categoryMatch[1].trim() : '',
            cognitiveLevel: cognitiveLevelMatch ? cognitiveLevelMatch[1].trim() : '',
            text: textMatch ? textMatch[1].trim() : '',
            answer: answerMatch ? answerMatch[1].trim() : '',
            markScheme: markSchemeMatch ? markSchemeMatch[1].trim() : '',
            points: pointsMatch ? parseInt(pointsMatch[1].trim()) : 1,
            selected: true // Default to selected
        });
    }
    
    return questions;
}

// Render SCALE questions in the UI
function renderScaleQuestions() {
    // Function to render questions for a specific worksheet
    const renderQuestionsForWorksheet = (worksheetNum) => {
        // For each learning objective
        for (let lo = 1; lo <= 3; lo++) {
            if (lo === 3 && !appState.learningObjectives.lo3.exists) continue;
            
            const container = document.getElementById(`scaleQuestionsWS${worksheetNum}LO${lo}`);
            if (!container) continue;
            
            // Get questions for this worksheet and LO
            const questions = worksheetNum === 1 ? 
                appState.worksheets.scale.worksheet1[`lo${lo}`] : 
                appState.worksheets.scale.worksheet2[`lo${lo}`];
            
            if (!questions || questions.length === 0) {
                container.innerHTML = '<p>No SCALE questions available for this learning objective.</p>';
                continue;
            }
            
            // Clear container
            container.innerHTML = '';
            
            // Group questions by SCALE category
            const categories = {
                'S': { title: 'Simple Recognition', questions: [] },
                'C': { title: 'Conceptual Understanding', questions: [] },
                'A': { title: 'Application', questions: [] },
                'L': { title: 'Linking Ideas', questions: [] },
                'E': { title: 'Extended Thinking', questions: [] }
            };
            
            questions.forEach(q => {
                const category = q.category.charAt(0); // Get first letter
                if (categories[category]) {
                    categories[category].questions.push(q);
                }
            });
            
            // Render questions for each category
            for (const [key, category] of Object.entries(categories)) {
                if (category.questions.length === 0) continue;
                
                const categoryContainer = document.createElement('div');
                categoryContainer.className = 'scale-category-container';
                
                // Create header
                const categoryHeader = document.createElement('div');
                categoryHeader.className = 'scale-category-header';
                categoryHeader.innerHTML = `<h5>${key} - ${category.title}</h5>`;
                categoryContainer.appendChild(categoryHeader);
                
                // Create questions list
                const questionsList = document.createElement('div');
                questionsList.className = 'scale-questions-list';
                
                category.questions.forEach((q, index) => {
                    const questionItem = document.createElement('div');
                    questionItem.className = 'scale-question-item';
                    
                    const questionContent = `
                        <div class="question-header">
                            <div class="checkbox-container">
                                <input type="checkbox" id="scaleQ-ws${worksheetNum}-lo${lo}-cat${key}-${index}" 
                                    ${q.selected ? 'checked' : ''} 
                                    onchange="toggleScaleQuestion(${worksheetNum}, ${lo}, '${key}', ${index})">
                                <label for="scaleQ-ws${worksheetNum}-lo${lo}-cat${key}-${index}">
                                    <span class="cognitive-level ${q.cognitiveLevel.toLowerCase()}">${q.cognitiveLevel}</span>
                                    <span class="question-points">${q.points} ${q.points === 1 ? 'mark' : 'marks'}</span>
                                </label>
                            </div>
                        </div>
                        <div class="question-text">${q.text}</div>
                        <div class="question-answer"><strong>Answer:</strong> ${q.answer}</div>
                        <div class="question-mark-scheme"><strong>Mark Scheme:</strong> ${q.markScheme}</div>
                    `;
                    
                    questionItem.innerHTML = questionContent;
                    questionsList.appendChild(questionItem);
                });
                
                categoryContainer.appendChild(questionsList);
                container.appendChild(categoryContainer);
            }
        }
    };
    
    // Render for each worksheet
    renderQuestionsForWorksheet(1);
    if (appState.worksheets.count > 1) {
        renderQuestionsForWorksheet(2);
    }
    
    // Show edit container
    document.getElementById('scaleQuestionsEditContainer').style.display = 'block';
    
    // Update UI based on current worksheet
    updateUIForCurrentWorksheet('C');
}

// Toggle selection of a SCALE question
function toggleScaleQuestion(worksheetNum, lo, category, index) {
    // Get the checkbox
    const checkbox = document.getElementById(`scaleQ-ws${worksheetNum}-lo${lo}-cat${category}-${index}`);
    
    // Get the questions array
    const questions = worksheetNum === 1 ? 
        appState.worksheets.scale.worksheet1[`lo${lo}`] : 
        appState.worksheets.scale.worksheet2[`lo${lo}`];
    
    // Find the question with matching category and index
    let questionIndex = -1;
    let currentIndex = -1;
    
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].category.charAt(0) === category) {
            currentIndex++;
            if (currentIndex === index) {
                questionIndex = i;
                break;
            }
        }
    }
    
    if (questionIndex >= 0) {
        // Update the selected state
        questions[questionIndex].selected = checkbox.checked;
    }
}

// Skipping remaining edit functionality for brevity

//
// STEP 4D-4F: APPLICATION QUESTIONS, EXAM TECHNIQUE, EXAM STYLE QUESTIONS
//
// These follow similar patterns to the above, so are omitted for brevity

//
// STEP 4G: WORKSHEET FINALIZATION
//

// Prepare the worksheet finalization substep
function prepareWorksheetFinalizationSubstep() {
    // Update worksheet tabs
    initializeWorksheetTabs();
    
    // Initialize finalization settings if not already done
    if (!appState.worksheets.finalization.worksheet1) {
        appState.worksheets.finalization.worksheet1 = getDefaultFinalizationSettings();
    }
    
    if (appState.worksheets.count > 1 && !appState.worksheets.finalization.worksheet2) {
        appState.worksheets.finalization.worksheet2 = getDefaultFinalizationSettings();
    }
    
    // Load settings into UI
    loadFinalizationSettings();
    
    // Show previously saved data if it exists
    if (appState.responseTags.worksheetFinalization) {
        document.getElementById('finishStep4Btn').disabled = false;
    }
}

// Get default finalization settings
function getDefaultFinalizationSettings() {
    return {
        answerDisplay: 'Separate',
        includeSentenceStarters: true,
        answerLineStyle: 'Single',
        showPoints: true,
        sectionLabeling: 'Numbered',
        paperSize: 'A4',
        orientation: 'Portrait'
    };
}

// Load finalization settings into the UI
function loadFinalizationSettings() {
    const loadSettingsForWorksheet = (worksheetNum) => {
        const settings = worksheetNum === 1 ?
            appState.worksheets.finalization.worksheet1 :
            appState.worksheets.finalization.worksheet2;
        
        if (!settings) return;
        
        // Answer display
        document.querySelector(`input[name="answerDisplay${worksheetNum}"][value="${settings.answerDisplay}"]`).checked = true;
        
        // Sentence starters
        document.getElementById(`includeSentenceStarters${worksheetNum}`).checked = settings.includeSentenceStarters;
        
        // Answer line style
        document.querySelector(`input[name="answerLineStyle${worksheetNum}"][value="${settings.answerLineStyle}"]`).checked = true;
        
        // Show points
        document.getElementById(`showPoints${worksheetNum}`).checked = settings.showPoints;
        
        // Section labeling
        document.querySelector(`input[name="sectionLabeling${worksheetNum}"][value="${settings.sectionLabeling}"]`).checked = true;
        
        // Paper size
        document.querySelector(`input[name="paperSize${worksheetNum}"][value="${settings.paperSize}"]`).checked = true;
        
        // Orientation
        document.querySelector(`input[name="orientation${worksheetNum}"][value="${settings.orientation}"]`).checked = true;
    };
    
    // Load settings for each worksheet
    loadSettingsForWorksheet(1);
    if (appState.worksheets.count > 1) {
        loadSettingsForWorksheet(2);
    }
}

// Apply finalization settings from UI to state
function applyFinalizationSettings() {
    const getSettingsForWorksheet = (worksheetNum) => {
        return {
            answerDisplay: document.querySelector(`input[name="answerDisplay${worksheetNum}"]:checked`).value,
            includeSentenceStarters: document.getElementById(`includeSentenceStarters${worksheetNum}`).checked,
            answerLineStyle: document.querySelector(`input[name="answerLineStyle${worksheetNum}"]:checked`).value,
            showPoints: document.getElementById(`showPoints${worksheetNum}`).checked,
            sectionLabeling: document.querySelector(`input[name="sectionLabeling${worksheetNum}"]:checked`).value,
            paperSize: document.querySelector(`input[name="paperSize${worksheetNum}"]:checked`).value,
            orientation: document.querySelector(`input[name="orientation${worksheetNum}"]:checked`).value
        };
    };
    
    // Save settings for each worksheet
    appState.worksheets.finalization.worksheet1 = getSettingsForWorksheet(1);
    if (appState.worksheets.count > 1) {
        appState.worksheets.finalization.worksheet2 = getSettingsForWorksheet(2);
    }
    
    // Show success message
    showAlert('Settings saved successfully!', 'success');
    
    // Enable generate preview button
    document.getElementById('generateWorksheetPreviewBtn').disabled = false;
}

// Generate worksheet preview
function generateWorksheetPreviewPrompt() {
    // Get relevant data for the prompt
    const provider = appState.lessonInfo.provider;
    const subject = appState.lessonInfo.subject;
    const topic = appState.lessonInfo.topic;
    const level = appState.lessonInfo.level;
    const ability = appState.lessonInfo.ability;
    
    // Create settings summary
    let settingsText = '';
    
    settingsText += `Worksheet 1 Settings:\n`;
    const ws1Settings = appState.worksheets.finalization.worksheet1;
    settingsText += `- Answer Display: ${ws1Settings.answerDisplay}\n`;
    settingsText += `- Sentence Starters: ${ws1Settings.includeSentenceStarters ? 'Included' : 'Not Included'}\n`;
    settingsText += `- Answer Line Style: ${ws1Settings.answerLineStyle}\n`;
    settingsText += `- Show Points: ${ws1Settings.showPoints ? 'Yes' : 'No'}\n`;
    settingsText += `- Section Labeling: ${ws1Settings.sectionLabeling}\n`;
    settingsText += `- Paper Size: ${ws1Settings.paperSize}\n`;
    settingsText += `- Orientation: ${ws1Settings.orientation}\n\n`;
    
    if (appState.worksheets.count > 1) {
        settingsText += `Worksheet 2 Settings:\n`;
        const ws2Settings = appState.worksheets.finalization.worksheet2;
        settingsText += `- Answer Display: ${ws2Settings.answerDisplay}\n`;
        settingsText += `- Sentence Starters: ${ws2Settings.includeSentenceStarters ? 'Included' : 'Not Included'}\n`;
        settingsText += `- Answer Line Style: ${ws2Settings.answerLineStyle}\n`;
        settingsText += `- Show Points: ${ws2Settings.showPoints ? 'Yes' : 'No'}\n`;
        settingsText += `- Section Labeling: ${ws2Settings.sectionLabeling}\n`;
        settingsText += `- Paper Size: ${ws2Settings.paperSize}\n`;
        settingsText += `- Orientation: ${ws2Settings.orientation}\n\n`;
    }
    
    // Create the prompt
    const prompt = `Please create a finalized worksheet layout preview for a ${level} tier ${subject} GCSE worksheet on ${topic} for ${ability} students following the ${provider} specification.

This worksheet will include all the components we've developed:
1. Reference materials (definitions, formulas, diagrams, examples)
2. Retrieval practice questions
3. SCALE framework questions
4. Application questions
5. Exam technique questions
6. Exam-style questions

Please apply these formatting preferences:
${settingsText}

Please generate a description of how the final worksheet(s) will look, including:
1. Overall structure and section sequence
2. How answer spaces will appear based on the selected answer line style
3. Where answers will be placed based on the answer display setting
4. How sections will be labeled based on the section labeling preference
5. How sentence starters will be incorporated (if selected)
6. Visual description of the layout with appropriate spacing and organization

Please structure your response using the following XML format:
<worksheetFinalization>
    <worksheet number="1">
        <previewDescription>
            [Detailed description of worksheet layout]
        </previewDescription>
        <sectionOrder>
            [List of sections in order]
        </sectionOrder>
        <formatNotes>
            [Special formatting considerations]
        </formatNotes>
    </worksheet>
    ${appState.worksheets.count > 1 ? `
    <worksheet number="2">
        <previewDescription>
            [Detailed description of worksheet layout]
        </previewDescription>
        <sectionOrder>
            [List of sections in order]
        </sectionOrder>
        <formatNotes>
            [Special formatting considerations]
        </formatNotes>
    </worksheet>` : ''}
</worksheetFinalization>`;

    // Set the prompt in the textarea
    document.getElementById('worksheetFinalizationPromptTextarea').value = prompt;
}

// Handle response for worksheet finalization
function handleWorksheetFinalizationResponse() {
    const responseText = document.getElementById('worksheetFinalizationResponseTextarea').value;
    if (!responseText) return;
    
    // Store response
    appState.responses.worksheetFinalization = responseText;
    
    // Extract XML tags from response
    const finalizationMatch = /<worksheetFinalization>([\s\S]*?)<\/worksheetFinalization>/g.exec(responseText);
    
    if (finalizationMatch && finalizationMatch[1]) {
        appState.responseTags.worksheetFinalization = finalizationMatch[0];
        
        // Parse finalization content
        parseWorksheetFinalizationContent(finalizationMatch[0]);
        
        // Render the preview
        renderWorksheetPreview();
        
        // Enable finish button
        document.getElementById('finishStep4Btn').disabled = false;
    }
}

// Parse worksheet finalization content from XML
function parseWorksheetFinalizationContent(xml) {
    // Initialize preview data
    appState.worksheets.preview = {
        worksheet1: {
            description: '',
            sectionOrder: [],
            formatNotes: ''
        },
        worksheet2: {
            description: '',
            sectionOrder: [],
            formatNotes: ''
        }
    };
    
    // Parse worksheet 1
    const worksheet1Match = /<worksheet number="1">([\s\S]*?)<\/worksheet>/g.exec(xml);
    if (worksheet1Match && worksheet1Match[1]) {
        const ws1Content = worksheet1Match[1];
        
        const descriptionMatch = /<previewDescription>([\s\S]*?)<\/previewDescription>/g.exec(ws1Content);
        if (descriptionMatch) {
            appState.worksheets.preview.worksheet1.description = descriptionMatch[1].trim();
        }
        
        const sectionOrderMatch = /<sectionOrder>([\s\S]*?)<\/sectionOrder>/g.exec(ws1Content);
        if (sectionOrderMatch) {
            appState.worksheets.preview.worksheet1.sectionOrder = sectionOrderMatch[1].trim()
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);
        }
        
        const formatNotesMatch = /<formatNotes>([\s\S]*?)<\/formatNotes>/g.exec(ws1Content);
        if (formatNotesMatch) {
            appState.worksheets.preview.worksheet1.formatNotes = formatNotesMatch[1].trim();
        }
    }
    
    // Parse worksheet 2 if it exists
    const worksheet2Match = /<worksheet number="2">([\s\S]*?)<\/worksheet>/g.exec(xml);
    if (worksheet2Match && worksheet2Match[1]) {
        const ws2Content = worksheet2Match[1];
        
        const descriptionMatch = /<previewDescription>([\s\S]*?)<\/previewDescription>/g.exec(ws2Content);
        if (descriptionMatch) {
            appState.worksheets.preview.worksheet2.description = descriptionMatch[1].trim();
        }
        
        const sectionOrderMatch = /<sectionOrder>([\s\S]*?)<\/sectionOrder>/g.exec(ws2Content);
        if (sectionOrderMatch) {
            appState.worksheets.preview.worksheet2.sectionOrder = sectionOrderMatch[1].trim()
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);
        }
        
        const formatNotesMatch = /<formatNotes>([\s\S]*?)<\/formatNotes>/g.exec(ws2Content);
        if (formatNotesMatch) {
            appState.worksheets.preview.worksheet2.formatNotes = formatNotesMatch[1].trim();
        }
    }
}

// Render worksheet preview
function renderWorksheetPreview() {
    // Function to render preview for a specific worksheet
    const renderPreviewForWorksheet = (worksheetNum) => {
        const previewContainer = document.getElementById(`worksheetPreviewWS${worksheetNum}`);
        if (!previewContainer) return;
        
        // Get preview data
        const preview = worksheetNum === 1 ?
            appState.worksheets.preview.worksheet1 :
            appState.worksheets.preview.worksheet2;
        
        if (!preview.description) {
            previewContainer.innerHTML = '<p>No preview available for this worksheet.</p>';
            return;
        }
        
        // Create preview content
        let previewContent = `
            <div class="preview-description">
                <h5>Worksheet Layout Preview</h5>
                <p>${preview.description.replace(/\n/g, '<br>')}</p>
            </div>
        `;
        
        if (preview.sectionOrder && preview.sectionOrder.length > 0) {
            previewContent += `
                <div class="preview-section-order">
                    <h5>Section Order</h5>
                    <ol>
                        ${preview.sectionOrder.map(section => `<li>${section}</li>`).join('')}
                    </ol>
                </div>
            `;
        }
        
        if (preview.formatNotes) {
            previewContent += `
                <div class="preview-format-notes">
                    <h5>Formatting Notes</h5>
                    <p>${preview.formatNotes.replace(/\n/g, '<br>')}</p>
                </div>
            `;
        }
        
        previewContainer.innerHTML = previewContent;
    };
    
    // Render for each worksheet
    renderPreviewForWorksheet(1);
    if (appState.worksheets.count > 1) {
        renderPreviewForWorksheet(2);
    }
    
    // Show preview container
    document.getElementById('worksheetPreviewContainer').style.display = 'block';
}

// Generate worksheet preview
function generateWorksheetPreview() {
    // First apply the settings
    applyFinalizationSettings();
    
    // Then generate the prompt
    generateWorksheetPreviewPrompt();
}

// Finish Step 4 and complete the lesson planner
function finishStep4() {
    // Make sure we have all the needed data
    if (!appState.responseTags.worksheetFinalization) {
        alert('Please complete all substeps before finalizing your worksheets');
        return;
    }
    
    // Update main step status
    document.querySelector('.main-step-4 .main-step-status').className = 'main-step-status status-completed';
    document.querySelector('.main-step-4 .main-step-status').textContent = 'Completed';
    
    // Collapse Step 4
    if (appState.mainStepExpanded[3]) {
        toggleMainStep(4);
    }
    
    // Show completion message
    const step4Content = document.getElementById('mainStepContent4');
    const step4Inner = step4Content.querySelector('.main-step-inner');
    
    step4Inner.innerHTML = `
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">Lesson Planning Complete</h3>
        </div>
        <div class="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <div>
                <p><strong>Congratulations! You have successfully completed your lesson plan.</strong></p>
                <p>Your comprehensive GCSE science lesson plan is now ready with all components:</p>
                <ul>
                    <li>Lesson Foundations</li>
                    <li>Teaching Approach</li>
                    <li>Slide Content</li>
                    <li>Worksheet Materials</li>
                </ul>
                <p class="mt-2">You can now export your materials or revisit any section to make further refinements.</p>
            </div>
        </div>
        
        <div class="export-options">
            <h4>Export Options</h4>
            <div class="export-buttons">
                <button class="btn btn-primary" onclick="exportFullLessonPlan()">Export Full Lesson Plan</button>
                <button class="btn btn-secondary" onclick="exportSlides()">Export Slides</button>
                <button class="btn btn-secondary" onclick="exportWorksheets()">Export Worksheets</button>
            </div>
        </div>
    </div>
    `;
    
    // Scroll to message
    document.getElementById('mainStep4').scrollIntoView({ behavior: 'smooth' });
}

// Display learning objectives for worksheets
function displayLearningObjectivesForWorksheets() {
    const container = document.getElementById('learningObjectivesForWorksheets');
    if (!container) return;
    
    let html = '<h4>Learning Objectives</h4>';
    
    // Show LO1
    html += `
    <div class="lo-summary">
        <div class="lo-summary-header">
            <span class="lo-number">LO1</span>
            <span class="lo-badge ${getBadgeClassForAO(appState.loTypes.lo1.aoCategory)}">${appState.loTypes.lo1.aoCategory}</span>
        </div>
        <p class="lo-title">${appState.learningObjectives.lo1.title}</p>
        <p class="lo-description">${appState.learningObjectives.lo1.description}</p>
    </div>
    `;
    
    // Show LO2
    html += `
    <div class="lo-summary">
        <div class="lo-summary-header">
            <span class="lo-number">LO2</span>
            <span class="lo-badge ${getBadgeClassForAO(appState.loTypes.lo2.aoCategory)}">${appState.loTypes.lo2.aoCategory}</span>
        </div>
        <p class="lo-title">${appState.learningObjectives.lo2.title}</p>
        <p class="lo-description">${appState.learningObjectives.lo2.description}</p>
    </div>
    `;
    
    // Show LO3 if it exists
    if (appState.learningObjectives.lo3.exists) {
        html += `
        <div class="lo-summary">
            <div class="lo-summary-header">
                <span class="lo-number">LO3</span>
                <span class="lo-badge ${getBadgeClassForAO(appState.loTypes.lo3.aoCategory)}">${appState.loTypes.lo3.aoCategory}</span>
            </div>
            <p class="lo-title">${appState.learningObjectives.lo3.title}</p>
            <p class="lo-description">${appState.learningObjectives.lo3.description}</p>
        </div>
        `;
    }
    
    // Show worksheet allocation if multiple worksheets
    if (appState.worksheets.count > 1) {
        html += `<h4 class="mt-4">Worksheet Allocation</h4>`;
        html += `<div class="allocation-info">`;
        
        html += `<p><strong>Worksheet 1:</strong> Learning Objective${getWorksheetLOs(1).length > 1 ? 's' : ''} ${getWorksheetLOs(1).map(lo => lo).join(', ')}</p>`;
        html += `<p><strong>Worksheet 2:</strong> Learning Objective${getWorksheetLOs(2).length > 1 ? 's' : ''} ${getWorksheetLOs(2).map(lo => lo).join(', ')}</p>`;
        
        html += `</div>`;
    }
    
    container.innerHTML = html;
}

// Get badge class for assessment objective
function getBadgeClassForAO(aoCategory) {
    switch(aoCategory) {
        case 'AO1': return 'badge-ao1';
        case 'AO2': return 'badge-ao2';
        case 'AO3': return 'badge-ao3';
        default: return '';
    }
}

// Get array of LO numbers in a specific worksheet
function getWorksheetLOs(worksheetNum) {
    const result = [];
    
    if (appState.lessonStructure.worksheetAllocation.lo1 === worksheetNum) {
        result.push(1);
    }
    
    if (appState.lessonStructure.worksheetAllocation.lo2 === worksheetNum) {
        result.push(2);
    }
    
    if (appState.learningObjectives.lo3.exists && 
        appState.lessonStructure.worksheetAllocation.lo3 === worksheetNum) {
        result.push(3);
    }
    
    return result;
}

// Display prior knowledge for worksheets
function displayPriorKnowledgeForWorksheets() {
    const container = document.getElementById('priorKnowledgeForWorksheets');
    if (!container) return;
    
    let html = '<h4>Prior Knowledge</h4>';
    
    // Show LO1 Prior Knowledge
    html += `
    <div class="lo-prior-knowledge">
        <div class="lo-prior-knowledge-header">
            <span>Learning Objective 1 Prior Knowledge</span>
        </div>
        <ul>
            ${appState.priorKnowledge.lo1.map(item => `<li>${item}</li>`).join('')}
        </ul>
    </div>
    `;
    
    // Show LO2 Prior Knowledge
    html += `
    <div class="lo-prior-knowledge">
        <div class="lo-prior-knowledge-header">
            <span>Learning Objective 2 Prior Knowledge</span>
        </div>
        <ul>
            ${appState.priorKnowledge.lo2.map(item => `<li>${item}</li>`).join('')}
        </ul>
    </div>
    `;
    
    // Show LO3 Prior Knowledge if it exists
    if (appState.learningObjectives.lo3.exists) {
        html += `
        <div class="lo-prior-knowledge">
            <div class="lo-prior-knowledge-header">
                <span>Learning Objective 3 Prior Knowledge</span>
            </div>
            <ul>
                ${appState.priorKnowledge.lo3.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
        `;
    }
    
    container.innerHTML = html;
}

// Display learning objectives for SCALE questions
function displayLearningObjectivesForScaleQuestions() {
    // This would be similar to displayLearningObjectivesForWorksheets but with
    // emphasis on SCALE-relevant information
}

// Utility function to show alert message
function showAlert(message, type = 'info') {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-float`;
    alertContainer.innerHTML = `
        <div>${message}</div>
        <button type="button" class="alert-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(alertContainer);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (alertContainer.parentElement) {
            alertContainer.remove();
        }
    }, 3000);
}

// Export functions (placeholders)
function exportFullLessonPlan() {
    alert('Export functionality will be implemented in a future version.');
}

function exportSlides() {
    alert('Slides export functionality will be implemented in a future version.');
}

function exportWorksheets() {
    alert('Worksheets export functionality will be implemented in a future version.');
}