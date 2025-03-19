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
    const lo1Match = xml.match(/<LO1>[\s\S]*?<Title>([\s\S]*?)<\/Title>[\s\S]*?<Description>([\s\S]*?)<\/Description>[\s\S]*?<\/LO1>/);
    if (lo1Match) {
        appState.learningObjectives.lo1.title = lo1Match[1].trim();
        appState.learningObjectives.lo1.description = lo1Match[2].trim();
        appState.learningObjectives.count = 1;
    }
    
    // Extract LO2
    const lo2Match = xml.match(/<LO2>[\s\S]*?<Title>([\s\S]*?)<\/Title>[\s\S]*?<Description>([\s\S]*?)<\/Description>[\s\S]*?<\/LO2>/);
    if (lo2Match) {
        appState.learningObjectives.lo2.title = lo2Match[1].trim();
        appState.learningObjectives.lo2.description = lo2Match[2].trim();
        appState.learningObjectives.count = 2;
    }
    
    // Extract LO3 if present
    const lo3Match = xml.match(/<LO3>[\s\S]*?<Title>([\s\S]*?)<\/Title>[\s\S]*?<Description>([\s\S]*?)<\/Description>[\s\S]*?<\/LO3>/);
    if (lo3Match) {
        appState.learningObjectives.lo3.title = lo3Match[1].trim();
        appState.learningObjectives.lo3.description = lo3Match[2].trim();
        appState.learningObjectives.lo3.exists = true;
        appState.learningObjectives.count = 3;
    }
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
    let html = '<h4>Learning Objectives</h4>';
    
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
    html += `<div class="lo-container">
        <div class="lo-header">
            <span>Learning Objective 2</span>
            <span id="summaryLo2Badge" class="lo-badge ${appState.learningObjectives.lo2.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo2.hasPractical ? 'Practical' : 'Theory'}</span>
        </div>
        <p><strong>${appState.learningObjectives.lo2.title}</strong></p>
        <p>${appState.learningObjectives.lo2.description}</p>
    </div>`;
    
    // LO3 if it exists
    if (appState.learningObjectives.lo3.exists) {
        html += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective 3</span>
                <span id="summaryLo3Badge" class="lo-badge ${appState.learningObjectives.lo3.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo3.hasPractical ? 'Practical' : 'Theory'}</span>
            </div>
            <p><strong>${appState.learningObjectives.lo3.title}</strong></p>
            <p>${appState.learningObjectives.lo3.description}</p>
        </div>`;
    }
    
    document.getElementById('loBSummaryContent').innerHTML = html;
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
    const response = e.target.value;
    appState.responses.loTypes = response;
    
    // Extract XML content
    const loTypesMatch = extractXML(response, 'LOTypes');
    
    if (loTypesMatch) {
        appState.responseTags.loTypes = loTypesMatch;
        
        // Extract LO types
        extractLOTypes(loTypesMatch);
    }
    
    // Update button state
    document.getElementById('continueToMisconceptionsBtn').disabled = !loTypesMatch;
}

// Extract LO types from XML
function extractLOTypes(xml) {
    // Extract LO1 type
    const lo1TypeMatch = xml.match(/<LO1Type>[\s\S]*?<AOCategory>([\s\S]*?)<\/AOCategory>[\s\S]*?<SpecificType>([\s\S]*?)<\/SpecificType>[\s\S]*?<Justification>([\s\S]*?)<\/Justification>[\s\S]*?<\/LO1Type>/);
    if (lo1TypeMatch) {
        appState.loTypes.lo1.aoCategory = lo1TypeMatch[1].trim();
        appState.loTypes.lo1.specificType = lo1TypeMatch[2].trim();
        appState.loTypes.lo1.justification = lo1TypeMatch[3].trim();
    }
    
    // Extract LO2 type
    const lo2TypeMatch = xml.match(/<LO2Type>[\s\S]*?<AOCategory>([\s\S]*?)<\/AOCategory>[\s\S]*?<SpecificType>([\s\S]*?)<\/SpecificType>[\s\S]*?<Justification>([\s\S]*?)<\/Justification>[\s\S]*?<\/LO2Type>/);
    if (lo2TypeMatch) {
        appState.loTypes.lo2.aoCategory = lo2TypeMatch[1].trim();
        appState.loTypes.lo2.specificType = lo2TypeMatch[2].trim();
        appState.loTypes.lo2.justification = lo2TypeMatch[3].trim();
    }
    
    // Extract LO3 type if present
    const lo3TypeMatch = xml.match(/<LO3Type>[\s\S]*?<AOCategory>([\s\S]*?)<\/AOCategory>[\s\S]*?<SpecificType>([\s\S]*?)<\/SpecificType>[\s\S]*?<Justification>([\s\S]*?)<\/Justification>[\s\S]*?<\/LO3Type>/);
    if (lo3TypeMatch && appState.learningObjectives.lo3.exists) {
        appState.loTypes.lo3.aoCategory = lo3TypeMatch[1].trim();
        appState.loTypes.lo3.specificType = lo3TypeMatch[2].trim();
        appState.loTypes.lo3.justification = lo3TypeMatch[3].trim();
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
    // LO1
    document.getElementById('lo1AOCategory').textContent = appState.loTypes.lo1.aoCategory;
    document.getElementById('lo1SpecificType').textContent = appState.loTypes.lo1.specificType;
    document.getElementById('lo1TypeJustification').textContent = appState.loTypes.lo1.justification;
    
    // LO2
    document.getElementById('lo2AOCategory').textContent = appState.loTypes.lo2.aoCategory;
    document.getElementById('lo2SpecificType').textContent = appState.loTypes.lo2.specificType;
    document.getElementById('lo2TypeJustification').textContent = appState.loTypes.lo2.justification;
    
    // LO3 if it exists
    if (appState.learningObjectives.lo3.exists) {
        document.getElementById('lo3TypeContainer').style.display = 'block';
        document.getElementById('lo3AOCategory').textContent = appState.loTypes.lo3.aoCategory;
        document.getElementById('lo3SpecificType').textContent = appState.loTypes.lo3.specificType;
        document.getElementById('lo3TypeJustification').textContent = appState.loTypes.lo3.justification;
    } else {
        document.getElementById('lo3TypeContainer').style.display = 'none';
    }
    
    // Show the container
    document.getElementById('loTypesEditContainer').style.display = 'block';
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
    let html = '<h4>Learning Objectives & Types</h4>';
    
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
    
    // LO3 if it exists
    if (appState.learningObjectives.lo3.exists) {
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
    
    document.getElementById('loCSummaryContent').innerHTML = html;
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
    let html = '<h4>Learning Objectives & Misconceptions</h4>';
    
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
    
    // LO3 if it exists
    if (appState.learningObjectives.lo3.exists) {
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
    
    document.getElementById('loDSummaryContent').innerHTML = html;
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
    // Lesson Information
    let lessonInfoHtml = `<h4>Lesson Information</h4>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray); width: 30%;"><strong>Subject:</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);">${appState.lessonInfo.subject}</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);"><strong>Topic:</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);">${appState.lessonInfo.topic}</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);"><strong>Exam Board:</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);">${appState.lessonInfo.provider}</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);"><strong>Course:</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);">${appState.lessonInfo.course}</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);"><strong>Level:</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);">${appState.lessonInfo.level}</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);"><strong>Student Ability:</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);">${appState.lessonInfo.ability}</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);"><strong>Lesson Number:</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);">${appState.lessonInfo.lessonNumber}</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);"><strong>Lesson Title:</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid var(--light-gray);">${appState.lessonInfo.lessonTitle}</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem;"><strong>Additional Info:</strong></td>
                <td style="padding: 0.5rem;">${appState.lessonInfo.description || 'None'}</td>
            </tr>
        </table>`;
    
    document.getElementById('lessonInfoReview').innerHTML = lessonInfoHtml;
    
    // Learning Objectives
    let loHtml = '';
    
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
    loHtml += `<div class="lo-container">
        <div class="lo-header">
            <span>Learning Objective 2</span>
            <span class="lo-badge ${appState.learningObjectives.lo2.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo2.hasPractical ? 'Practical' : 'Theory'}</span>
        </div>
        <p><strong>${appState.learningObjectives.lo2.title}</strong></p>
        <p>${appState.learningObjectives.lo2.description}</p>
    </div>`;
    
    // LO3 if it exists
    if (appState.learningObjectives.lo3.exists) {
        loHtml += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective 3</span>
                <span class="lo-badge ${appState.learningObjectives.lo3.hasPractical ? 'badge-practical' : ''}">${appState.learningObjectives.lo3.hasPractical ? 'Practical' : 'Theory'}</span>
            </div>
            <p><strong>${appState.learningObjectives.lo3.title}</strong></p>
            <p>${appState.learningObjectives.lo3.description}</p>
        </div>`;
    }
    
    document.getElementById('learningObjectivesReview').innerHTML = loHtml;
    
    // Learning Objective Types
    let loTypesHtml = '';
    
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
    loTypesHtml += `<div class="lo-container">
        <div class="lo-header">
            <span>Learning Objective 2 Types</span>
        </div>
        <p><strong>Assessment Objective:</strong> ${appState.loTypes.lo2.aoCategory}</p>
        <p><strong>Specific Type:</strong> ${appState.loTypes.lo2.specificType}</p>
        <p><strong>Justification:</strong> ${appState.loTypes.lo2.justification}</p>
    </div>`;
    
    // LO3 Types if LO3 exists
    if (appState.learningObjectives.lo3.exists) {
        loTypesHtml += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective 3 Types</span>
            </div>
            <p><strong>Assessment Objective:</strong> ${appState.loTypes.lo3.aoCategory}</p>
            <p><strong>Specific Type:</strong> ${appState.loTypes.lo3.specificType}</p>
            <p><strong>Justification:</strong> ${appState.loTypes.lo3.justification}</p>
        </div>`;
    }
    
    document.getElementById('loTypesReview').innerHTML = loTypesHtml;
    
    // Misconceptions
    let misconceptionsHtml = '';
    
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
    misconceptionsHtml += `<div class="lo-container">
        <div class="lo-header">
            <span>Learning Objective 2 Misconceptions</span>
        </div>
        <ul>
            ${appState.misconceptions.lo2.map(m => `<li>${m}</li>`).join('')}
        </ul>
    </div>`;
    
    // LO3 Misconceptions if LO3 exists
    if (appState.learningObjectives.lo3.exists) {
        misconceptionsHtml += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective 3 Misconceptions</span>
            </div>
            <ul>
                ${appState.misconceptions.lo3.map(m => `<li>${m}</li>`).join('')}
            </ul>
        </div>`;
    }
    
    document.getElementById('misconceptionsReview').innerHTML = misconceptionsHtml;
    
    // Prior Knowledge
    let priorKnowledgeHtml = '';
    
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
    priorKnowledgeHtml += `<div class="lo-container">
        <div class="lo-header">
            <span>Learning Objective 2 Prior Knowledge</span>
        </div>
        <ul>
            ${appState.priorKnowledge.lo2.map(pk => `<li>${pk}</li>`).join('')}
        </ul>
    </div>`;
    
    // LO3 Prior Knowledge if LO3 exists
    if (appState.learningObjectives.lo3.exists) {
        priorKnowledgeHtml += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective 3 Prior Knowledge</span>
            </div>
            <ul>
                ${appState.priorKnowledge.lo3.map(pk => `<li>${pk}</li>`).join('')}
            </ul>
        </div>`;
    }
    
    document.getElementById('priorKnowledgeReview').innerHTML = priorKnowledgeHtml;
    
    // Enable the finish button
    document.getElementById('finishStep1Btn').disabled = false;
}