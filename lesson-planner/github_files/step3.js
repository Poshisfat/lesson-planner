// ===== STEP 3: SLIDE GENERATION FUNCTIONALITY =====

// ===== SUBSTEP 3A: RETRIEVAL PRACTICE SLIDES =====

// Initialize Step 3A (Retrieval Practice Slides)
function initializeStep3A() {
    // Generate the retrieval practice prompt when button is clicked
    document.getElementById('generateRetrievalPromptBtn').addEventListener('click', generateRetrievalPracticePrompt);
    
    // Copy retrieval practice prompt to clipboard
    document.getElementById('copyRetrievalPromptBtn').addEventListener('click', () => {
        copyToClipboard('retrievalPromptTextarea');
    });
    
    // Preview retrieval practice response
    document.getElementById('previewRetrievalResponseBtn').addEventListener('click', () => {
        previewRetrievalPracticeResponse();
    });
    
    // Switch between formatted and tagged response views
    document.querySelectorAll('#retrievalPreview .response-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            document.querySelectorAll('#retrievalPreview .response-tab').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('#retrievalPreview .response-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}Response`).classList.add('active');
        });
    });
    
    // Enable continue button when response is processed
    document.getElementById('retrievalResponseTextarea').addEventListener('input', function() {
        processRetrievalPracticeResponse(this.value);
        document.getElementById('continueToTeachingInputBtn').disabled = !this.value.trim();
    });
    
    // Add event listeners for editing retrieval questions
    document.getElementById('editRetrievalQuestionsBtn').addEventListener('click', openRetrievalQuestionsModal);
    document.getElementById('saveRetrievalQuestionsBtn').addEventListener('click', saveRetrievalQuestions);
    
    // Load prior knowledge from Step 1D
    loadPriorKnowledgeForRetrieval();
}

// Generate the retrieval practice prompt
function generateRetrievalPracticePrompt() {
    if (!validateStep3ARequirements()) return;
    
    // Get prior knowledge from Step 1
    const priorKnowledge = appState.priorKnowledge;
    const loCount = appState.learningObjectives.count;
    
    // Create the retrieval practice prompt
    let prompt = `You are an expert science teacher creating slide content for a GCSE lesson. 

I need you to create 5-10 retrieval practice questions for the beginning of my lesson on "${appState.lessonInfo.lessonTitle}".

Course Details:
- Exam Board: ${appState.lessonInfo.provider}
- Subject: ${appState.lessonInfo.subject}
- Topic: ${appState.lessonInfo.topic}
- Level: ${appState.lessonInfo.level}
- Student Ability: ${appState.lessonInfo.ability}

These retrieval questions should be based on the prior knowledge needed for this lesson:

`;

    // Add prior knowledge for each learning objective
    for (let i = 1; i <= loCount; i++) {
        prompt += `For Learning Objective ${i}: "${appState.learningObjectives[`lo${i}`].title}"\n`;
        
        if (priorKnowledge[`lo${i}`].length > 0) {
            priorKnowledge[`lo${i}`].forEach(item => {
                prompt += `- ${item}\n`;
            });
        } else {
            prompt += "- No specific prior knowledge identified\n";
        }
        
        prompt += "\n";
    }
    
    // Add requirements for the slide
    prompt += `Create 5-10 retrieval practice questions that:
1. Test the essential prior knowledge
2. Progress from simple recall to application
3. Include a mix of multiple choice and short answer questions
4. Are clear and concise

For each question, please provide:
- The question text
- Question type (multiple choice, short answer, true/false, etc.)
- Correct answer
- Any distractors for multiple choice questions
- Brief explanation of why this question is relevant

Output your response in this XML format:
<retrievalQuestions>
  <question>
    <text>Question text goes here</text>
    <type>multiple-choice/short-answer/true-false</type>
    <answer>Correct answer</answer>
    <distractors>
      <distractor>Wrong answer 1</distractor>
      <distractor>Wrong answer 2</distractor>
      <distractor>Wrong answer 3</distractor>
    </distractors>
    <explanation>Explanation of why this is important</explanation>
    <priorKnowledgeLink>Which aspect of prior knowledge this tests</priorKnowledgeLink>
  </question>
  <!-- Repeat for each question -->
</retrievalQuestions>

Additionally, suggest 2-3 slide layout formats that would work well for these retrieval questions with examples of each.`;

    // Set the prompt in the textarea
    document.getElementById('retrievalPromptTextarea').value = prompt;
}

// Preview the retrieval practice response
function previewRetrievalPracticeResponse() {
    const responseText = document.getElementById('retrievalResponseTextarea').value.trim();
    if (!responseText) {
        alert('Please paste Claude\'s response first');
        return;
    }
    
    // Display tagged response
    document.getElementById('retrievalTaggedResponse').innerHTML = escapeHTML(responseText);
    
    // Process and display formatted response
    processRetrievalPracticeResponse(responseText);
    
    // Show the preview
    document.getElementById('retrievalPreview').style.display = 'block';
    document.getElementById('retrievalEditContainer').style.display = 'block';
}

// Process the retrieval practice response
function processRetrievalPracticeResponse(responseText) {
    try {
        // Extract the XML content
        const xmlMatch = responseText.match(/<retrievalQuestions>[\s\S]*?<\/retrievalQuestions>/);
        if (!xmlMatch) {
            console.error('No retrievalQuestions tag found in the response');
            return;
        }
        
        const xmlContent = xmlMatch[0];
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
        
        // Store in appState
        appState.responseTags.retrievalQuestions = xmlContent;
        appState.responses.retrieval = responseText;
        
        // Parse questions from XML
        const questionNodes = xmlDoc.querySelectorAll('question');
        appState.slides.retrieval.questions = [];
        
        questionNodes.forEach((questionNode, index) => {
            const question = {
                text: getXmlChildText(questionNode, 'text') || '',
                type: getXmlChildText(questionNode, 'type') || '',
                answer: getXmlChildText(questionNode, 'answer') || '',
                distractors: [],
                explanation: getXmlChildText(questionNode, 'explanation') || '',
                priorKnowledgeLink: getXmlChildText(questionNode, 'priorKnowledgeLink') || ''
            };
            
            // Get distractors if they exist
            const distractorNodes = questionNode.querySelectorAll('distractors > distractor');
            distractorNodes.forEach(distractor => {
                question.distractors.push(distractor.textContent.trim());
            });
            
            appState.slides.retrieval.questions.push(question);
        });
        
        // Generate formatted HTML for preview
        let formattedHTML = '<h4>Retrieval Practice Questions</h4>';
        
        appState.slides.retrieval.questions.forEach((question, index) => {
            formattedHTML += `
            <div class="preview-question">
                <div class="question-header">
                    <h5>Question ${index + 1} (${question.type})</h5>
                </div>
                <p><strong>Question:</strong> ${question.text}</p>
                <p><strong>Answer:</strong> ${question.answer}</p>`;
                
            if (question.distractors && question.distractors.length > 0) {
                formattedHTML += `<p><strong>Distractors:</strong></p>
                <ul>`;
                question.distractors.forEach(distractor => {
                    formattedHTML += `<li>${distractor}</li>`;
                });
                formattedHTML += `</ul>`;
            }
            
            formattedHTML += `
                <p><strong>Explanation:</strong> ${question.explanation}</p>
                <p><strong>Prior Knowledge Link:</strong> ${question.priorKnowledgeLink}</p>
            </div>`;
        });
        
        // Add suggested layouts if found
        const layoutMatch = responseText.match(/slide layout formats?([^<]*)/i);
        if (layoutMatch) {
            formattedHTML += `<h4>Suggested Slide Layouts</h4>
            <div class="layout-suggestions">
                <p>${layoutMatch[1].trim()}</p>
            </div>`;
        }
        
        document.getElementById('retrievalFormattedResponse').innerHTML = formattedHTML;
        
        // Update the retrieval question edit UI
        updateRetrievalQuestionsEditUI();
        
        return true;
    } catch (error) {
        console.error('Error processing retrieval practice response:', error);
        document.getElementById('retrievalFormattedResponse').innerHTML = '<p class="error">Error processing the response. Please check the format.</p>';
        return false;
    }
}

// Load prior knowledge for retrieval
function loadPriorKnowledgeForRetrieval() {
    if (!appState.priorKnowledge.lo1.length) return;
    
    let priorKnowledgeHTML = '<h4>Prior Knowledge to Test</h4><div class="prior-knowledge-list">';
    
    for (let i = 1; i <= appState.learningObjectives.count; i++) {
        priorKnowledgeHTML += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective ${i}</span>
            </div>
            <p><strong>${appState.learningObjectives[`lo${i}`].title}</strong></p>
            <ul>`;
            
        appState.priorKnowledge[`lo${i}`].forEach(item => {
            priorKnowledgeHTML += `<li>${item}</li>`;
        });
        
        priorKnowledgeHTML += `</ul></div>`;
    }
    
    priorKnowledgeHTML += '</div>';
    
    document.getElementById('priorKnowledgeForRetrieval').innerHTML = priorKnowledgeHTML;
}

// Update the retrieval questions edit UI
function updateRetrievalQuestionsEditUI() {
    const questionsContainer = document.getElementById('retrievalQuestionsContainer');
    questionsContainer.innerHTML = '';
    
    appState.slides.retrieval.questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'retrieval-question';
        questionElement.innerHTML = `
            <div class="question-header">
                <h5>Question ${index + 1}</h5>
                <div class="question-actions">
                    <button class="btn btn-sm btn-outline" onclick="moveRetrievalQuestion(${index}, 'up')" ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button class="btn btn-sm btn-outline" onclick="moveRetrievalQuestion(${index}, 'down')" ${index === appState.slides.retrieval.questions.length - 1 ? 'disabled' : ''}>↓</button>
                    <button class="btn btn-sm btn-outline delete-btn" onclick="removeRetrievalQuestion(${index})">×</button>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Question Text:</label>
                <textarea class="form-control question-text" rows="2">${question.text}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Question Type:</label>
                <select class="form-control question-type">
                    <option value="multiple-choice" ${question.type === 'multiple-choice' ? 'selected' : ''}>Multiple Choice</option>
                    <option value="short-answer" ${question.type === 'short-answer' ? 'selected' : ''}>Short Answer</option>
                    <option value="true-false" ${question.type === 'true-false' ? 'selected' : ''}>True/False</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Correct Answer:</label>
                <input type="text" class="form-control question-answer" value="${question.answer}">
            </div>
            <div class="distractors-container ${question.type !== 'multiple-choice' ? 'hidden' : ''}">
                <label class="form-label">Distractors:</label>
                <div class="distractors-list">
                    ${question.distractors.map((distractor, i) => `
                        <div class="distractor-item">
                            <input type="text" class="form-control distractor-text" value="${distractor}">
                            <button class="btn btn-sm btn-outline delete-btn" onclick="removeDistractor(${index}, ${i})">×</button>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-outline btn-sm" onclick="addDistractor(${index})">+ Add Distractor</button>
            </div>
            <div class="form-group">
                <label class="form-label">Explanation:</label>
                <textarea class="form-control question-explanation" rows="2">${question.explanation}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Prior Knowledge Link:</label>
                <input type="text" class="form-control question-link" value="${question.priorKnowledgeLink}">
            </div>
        `;
        
        questionsContainer.appendChild(questionElement);
    });
    
    // Add change listeners for question type to show/hide distractors
    document.querySelectorAll('.question-type').forEach((select, index) => {
        select.addEventListener('change', function() {
            const distractorsContainer = this.closest('.retrieval-question').querySelector('.distractors-container');
            if (this.value === 'multiple-choice') {
                distractorsContainer.classList.remove('hidden');
            } else {
                distractorsContainer.classList.add('hidden');
            }
        });
    });
    
    // Add "Add Question" button
    const addButton = document.createElement('button');
    addButton.className = 'btn btn-primary';
    addButton.textContent = '+ Add New Question';
    addButton.onclick = addRetrievalQuestion;
    questionsContainer.appendChild(addButton);
}

// Open retrieval questions edit modal
function openRetrievalQuestionsModal() {
    // Set up temporary state
    appState.editState.tempRetrievalQuestions = JSON.parse(JSON.stringify(appState.slides.retrieval.questions));
    
    // Update the edit UI
    updateRetrievalQuestionsEditUI();
    
    // Show the modal
    document.getElementById('retrievalQuestionsEditModal').style.display = 'flex';
}

// Save retrieval questions
function saveRetrievalQuestions() {
    // Collect edited data from UI
    const questionElements = document.querySelectorAll('.retrieval-question');
    appState.slides.retrieval.questions = [];
    
    questionElements.forEach((element, index) => {
        const type = element.querySelector('.question-type').value;
        const distractors = [];
        
        if (type === 'multiple-choice') {
            element.querySelectorAll('.distractor-text').forEach(input => {
                if (input.value.trim()) {
                    distractors.push(input.value.trim());
                }
            });
        }
        
        const question = {
            text: element.querySelector('.question-text').value.trim(),
            type: type,
            answer: element.querySelector('.question-answer').value.trim(),
            distractors: distractors,
            explanation: element.querySelector('.question-explanation').value.trim(),
            priorKnowledgeLink: element.querySelector('.question-link').value.trim()
        };
        
        appState.slides.retrieval.questions.push(question);
    });
    
    // Update the preview
    processRetrievalPracticeResponse(appState.responses.retrieval);
    
    // Close the modal
    closeModal('retrievalQuestionsEditModal');
}

// Add a new retrieval question
function addRetrievalQuestion() {
    appState.slides.retrieval.questions.push({
        text: '',
        type: 'multiple-choice',
        answer: '',
        distractors: ['', '', ''],
        explanation: '',
        priorKnowledgeLink: ''
    });
    
    updateRetrievalQuestionsEditUI();
}

// Remove a retrieval question
function removeRetrievalQuestion(index) {
    if (confirm('Are you sure you want to remove this question?')) {
        appState.slides.retrieval.questions.splice(index, 1);
        updateRetrievalQuestionsEditUI();
    }
}

// Move a retrieval question up or down
function moveRetrievalQuestion(index, direction) {
    const questions = appState.slides.retrieval.questions;
    
    if (direction === 'up' && index > 0) {
        [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]];
    } else if (direction === 'down' && index < questions.length - 1) {
        [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
    }
    
    updateRetrievalQuestionsEditUI();
}

// Add a distractor to a question
function addDistractor(questionIndex) {
    const question = appState.slides.retrieval.questions[questionIndex];
    question.distractors.push('');
    updateRetrievalQuestionsEditUI();
}

// Remove a distractor from a question
function removeDistractor(questionIndex, distractorIndex) {
    const question = appState.slides.retrieval.questions[questionIndex];
    question.distractors.splice(distractorIndex, 1);
    updateRetrievalQuestionsEditUI();
}

// Validate requirements for Step 3A
function validateStep3ARequirements() {
    if (!appState.responseTags.priorKnowledge) {
        alert('Please complete Step 1D (Prior Knowledge) first');
        return false;
    }
    return true;
}

// ===== SUBSTEP 3B: TEACHING INPUT SLIDES =====

// Initialize Step 3B (Teaching Input Slides)
function initializeStep3B() {
    // Generate the teaching input prompt when button is clicked
    document.getElementById('generateTeachingInputPromptBtn').addEventListener('click', generateTeachingInputPrompt);
    
    // Copy teaching input prompt to clipboard
    document.getElementById('copyTeachingInputPromptBtn').addEventListener('click', () => {
        copyToClipboard('teachingInputPromptTextarea');
    });
    
    // Preview teaching input response
    document.getElementById('previewTeachingInputResponseBtn').addEventListener('click', () => {
        previewTeachingInputResponse();
    });
    
    // Switch between formatted and tagged response views
    document.querySelectorAll('#teachingInputPreview .response-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            document.querySelectorAll('#teachingInputPreview .response-tab').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('#teachingInputPreview .response-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}Response`).classList.add('active');
        });
    });
    
    // Enable continue button when response is processed
    document.getElementById('teachingInputResponseTextarea').addEventListener('input', function() {
        processTeachingInputResponse(this.value);
        document.getElementById('continueToFormativeAssessmentBtn').disabled = !this.value.trim();
    });
    
    // Add event listeners for editing teaching slides
    document.getElementById('editTeachingSlidesBtn').addEventListener('click', openTeachingSlidesModal);
    document.getElementById('saveTeachingSlidesBtn').addEventListener('click', saveTeachingSlides);
    
    // Display learning objectives summary for teaching slides
    displayLearningObjectivesForTeaching();
}

// Generate the teaching input prompt
function generateTeachingInputPrompt() {
    if (!validateStep3BRequirements()) return;
    
    // Get learning objectives, types, and frameworks
    const learningObjectives = appState.learningObjectives;
    const loTypes = appState.loTypes;
    const frameworks = appState.frameworks;
    const misconceptions = appState.misconceptions;
    const practicalRequirements = appState.practicalRequirements;
    const frayerModels = appState.frayerModels;
    
    // Create the teaching input prompt
    let prompt = `You are an expert science teacher creating slide content for a GCSE lesson. 

I need you to create teaching input slides for my lesson on "${appState.lessonInfo.lessonTitle}".

Course Details:
- Exam Board: ${appState.lessonInfo.provider}
- Subject: ${appState.lessonInfo.subject}
- Topic: ${appState.lessonInfo.topic}
- Level: ${appState.lessonInfo.level}
- Student Ability: ${appState.lessonInfo.ability}

Here are the learning objectives for this lesson:
`;

    // Add learning objectives and their frameworks
    for (let i = 1; i <= learningObjectives.count; i++) {
        prompt += `\nLearning Objective ${i}: "${learningObjectives[`lo${i}`].title}"
- Description: ${learningObjectives[`lo${i}`].description}
- Assessment Type: ${loTypes[`lo${i}`].aoCategory} (${loTypes[`lo${i}`].specificType})
- Teaching Framework: ${frameworks[`lo${i}`].primaryFramework}`;

        // Add BLT information if used
        if (frameworks[`lo${i}`].bltUsed) {
            const bltLevels = frameworks[`lo${i}`].bltLevels;
            prompt += `
- Using Bloom's Taxonomy levels: ${Object.entries(bltLevels)
                .filter(([level, used]) => used)
                .map(([level]) => level.charAt(0).toUpperCase() + level.slice(1))
                .join(', ')}`;
        }
        
        // Add practical information if applicable
        if (learningObjectives[`lo${i}`].hasPractical && practicalRequirements[`lo${i}`].title) {
            prompt += `
- Includes Practical: "${practicalRequirements[`lo${i}`].title}"`;
        }
        
        // Add Frayer Model information if applicable
        if (frayerModels[`lo${i}`].term) {
            prompt += `
- Includes Frayer Model for: "${frayerModels[`lo${i}`].term}"`;
        }
        
        // Add key misconceptions to address
        if (misconceptions[`lo${i}`].length > 0) {
            prompt += `
- Key Misconceptions to Address:`;
            misconceptions[`lo${i}`].forEach(misconception => {
                prompt += `
  * ${misconception}`;
            });
        }
    }
    
    // Add slide structure and requirements
    prompt += `\n\nFor each learning objective, please create the following slide content:

1. An engaging introduction slide that hooks students' interest
2. Key teaching input slides that follow the specified framework for each objective
3. Clear explanations that address the identified misconceptions
4. Visual elements descriptions or diagrams where appropriate

Follow these specific framework guidelines:
- For CER (Claim, Evidence, Reasoning): Structure content with clear claims, supporting evidence, and scientific reasoning
- For POE (Predict, Observe, Explain): Create slides that prompt prediction, show observation, and guide explanation
- For SOLO Taxonomy: Progress from unistructural to extended abstract understanding
- For PEEL (Point, Evidence, Explain, Link): Organize content with main points, evidence, explanations, and links to broader concepts
- For SEEC (State, Explain, Example, Connection): Present statements, explanations, examples, and connections

`;

    // Add practical requirements if any learning objective has practical
    const hasPractical = Object.values(learningObjectives)
        .some(lo => typeof lo === 'object' && lo.hasPractical);
    
    if (hasPractical) {
        prompt += `Include practical slides for any learning objective marked with a practical. For these, include:
- Aim of the practical
- Equipment list
- Step-by-step procedure
- Safety considerations
- Data collection tables or result expectations

`;
    }
    
    // Add Frayer Model requirements if any exists
    const hasFrayer = Object.values(frayerModels)
        .some(model => typeof model === 'object' && model.term);
    
    if (hasFrayer) {
        prompt += `Include Frayer Model slides for any terms identified. For these, include:
- Central concept/term
- Definition
- Examples
- Non-examples
- Essential characteristics

`;
    }
    
    // Add output format requirements
    prompt += `Output your response in this XML format:
<teachingSlides>
  <learningObjective number="1">
    <title>${learningObjectives.lo1.title}</title>
    <slides>
      <slide type="introduction">
        <title>Slide title</title>
        <content>Slide content goes here</content>
        <visualElements>Description of any visuals, diagrams, or images</visualElements>
        <notes>Teacher notes for delivery</notes>
      </slide>
      <!-- Additional slides for this learning objective -->
    </slides>
  </learningObjective>
  <!-- Repeat for each learning objective -->
</teachingSlides>

For each slide, specify the slide type as one of:
- introduction (hook/engagement)
- keyContent (main teaching points)
- framework (structure based on the teaching framework)
- practical (for practical activities)
- frayerModel (for concept definitions)
- misconception (addressing common errors)
- summary (reviewing key points)

Create approximately 4-6 slides per learning objective, ensuring a logical flow of information.`;

    // Set the prompt in the textarea
    document.getElementById('teachingInputPromptTextarea').value = prompt;
}

// Preview the teaching input response
function previewTeachingInputResponse() {
    const responseText = document.getElementById('teachingInputResponseTextarea').value.trim();
    if (!responseText) {
        alert('Please paste Claude\'s response first');
        return;
    }
    
    // Display tagged response
    document.getElementById('teachingInputTaggedResponse').innerHTML = escapeHTML(responseText);
    
    // Process and display formatted response
    processTeachingInputResponse(responseText);
    
    // Show the preview
    document.getElementById('teachingInputPreview').style.display = 'block';
    document.getElementById('teachingInputEditContainer').style.display = 'block';
}

// Process the teaching input response
function processTeachingInputResponse(responseText) {
    try {
        // Extract the XML content
        const xmlMatch = responseText.match(/<teachingSlides>[\s\S]*?<\/teachingSlides>/);
        if (!xmlMatch) {
            console.error('No teachingSlides tag found in the response');
            return;
        }
        
        const xmlContent = xmlMatch[0];
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
        
        // Store in appState
        appState.responseTags.teachingSlides = xmlContent;
        appState.responses.teachingInput = responseText;
        
        // Parse learning objectives and slides from XML
        const loNodes = xmlDoc.querySelectorAll('learningObjective');
        appState.slides.teaching = {};
        
        loNodes.forEach(loNode => {
            const loNumber = loNode.getAttribute('number');
            const loTitle = getXmlChildText(loNode, 'title') || '';
            const slideNodes = loNode.querySelectorAll('slides > slide');
            
            appState.slides.teaching[`lo${loNumber}`] = {
                title: loTitle,
                slides: []
            };
            
            slideNodes.forEach(slideNode => {
                const slide = {
                    type: slideNode.getAttribute('type') || '',
                    title: getXmlChildText(slideNode, 'title') || '',
                    content: getXmlChildText(slideNode, 'content') || '',
                    visualElements: getXmlChildText(slideNode, 'visualElements') || '',
                    notes: getXmlChildText(slideNode, 'notes') || ''
                };
                
                appState.slides.teaching[`lo${loNumber}`].slides.push(slide);
            });
        });
        
        // Generate formatted HTML for preview
        let formattedHTML = '<h4>Teaching Input Slides</h4>';
        
        for (let i = 1; i <= appState.learningObjectives.count; i++) {
            if (!appState.slides.teaching[`lo${i}`]) continue;
            
            formattedHTML += `
            <div class="lo-container">
                <div class="lo-header">
                    <h5>Learning Objective ${i}: ${appState.slides.teaching[`lo${i}`].title}</h5>
                </div>
                <div class="slides-container">`;
                
            appState.slides.teaching[`lo${i}`].slides.forEach((slide, slideIndex) => {
                formattedHTML += `
                <div class="slide-preview">
                    <div class="slide-header">
                        <span class="slide-type">${slide.type}</span>
                        <span class="slide-number">Slide ${slideIndex + 1}</span>
                    </div>
                    <h6>${slide.title}</h6>
                    <div class="slide-content">
                        <p>${slide.content.replace(/\n/g, '<br>')}</p>
                    </div>
                    ${slide.visualElements ? `
                    <div class="slide-visuals">
                        <p><strong>Visual Elements:</strong> ${slide.visualElements}</p>
                    </div>` : ''}
                    ${slide.notes ? `
                    <div class="slide-notes">
                        <p><strong>Teacher Notes:</strong> ${slide.notes}</p>
                    </div>` : ''}
                </div>`;
            });
                
            formattedHTML += `
                </div>
            </div>`;
        }
        
        document.getElementById('teachingInputFormattedResponse').innerHTML = formattedHTML;
        
        return true;
    } catch (error) {
        console.error('Error processing teaching input response:', error);
        document.getElementById('teachingInputFormattedResponse').innerHTML = '<p class="error">Error processing the response. Please check the format.</p>';
        return false;
    }
}

// Display learning objectives for teaching
function displayLearningObjectivesForTeaching() {
    if (!appState.learningObjectives.lo1.title) return;
    
    let loHTML = '<h4>Learning Objectives</h4><div class="lo-summary">';
    
    for (let i = 1; i <= appState.learningObjectives.count; i++) {
        const lo = appState.learningObjectives[`lo${i}`];
        const framework = appState.frameworks[`lo${i}`];
        
        loHTML += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective ${i}</span>
                <div>
                    <span class="framework-badge">${framework.primaryFramework}</span>
                    ${lo.hasPractical ? '<span class="practical-badge">Practical</span>' : ''}
                    ${appState.frayerModels[`lo${i}`].term ? '<span class="frayer-badge">Frayer</span>' : ''}
                </div>
            </div>
            <p><strong>${lo.title}</strong></p>
            <p>${lo.description}</p>
        </div>`;
    }
    
    loHTML += '</div>';
    
    document.getElementById('learningObjectivesForTeaching').innerHTML = loHTML;
}

// Open teaching slides edit modal
function openTeachingSlidesModal() {
    // Set up temporary state
    appState.editState.tempTeachingSlides = JSON.parse(JSON.stringify(appState.slides.teaching));
    
    // Update the edit UI
    updateTeachingSlidesEditUI();
    
    // Show the modal
    document.getElementById('teachingSlidesEditModal').style.display = 'flex';
}

// Update the teaching slides edit UI
function updateTeachingSlidesEditUI() {
    const slidesTabContainer = document.getElementById('teachingSlidesTabContainer');
    const slidesContentContainer = document.getElementById('teachingSlidesContentContainer');
    
    slidesTabContainer.innerHTML = '';
    slidesContentContainer.innerHTML = '';
    
    // Add tabs for each learning objective
    for (let i = 1; i <= appState.learningObjectives.count; i++) {
        if (!appState.slides.teaching[`lo${i}`]) continue;
        
        const tabElement = document.createElement('div');
        tabElement.className = `slides-tab ${i === 1 ? 'active' : ''}`;
        tabElement.setAttribute('data-lo', i);
        tabElement.textContent = `LO ${i}`;
        tabElement.onclick = function() {
            document.querySelectorAll('.slides-tab').forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.slides-content').forEach(content => content.classList.remove('active'));
            document.querySelector(`.slides-content[data-lo="${this.getAttribute('data-lo')}"]`).classList.add('active');
        };
        
        slidesTabContainer.appendChild(tabElement);
        
        // Add content for each learning objective
        const contentElement = document.createElement('div');
        contentElement.className = `slides-content ${i === 1 ? 'active' : ''}`;
        contentElement.setAttribute('data-lo', i);
        
        const slides = appState.slides.teaching[`lo${i}`].slides;
        
        contentElement.innerHTML = `
            <h5>${appState.learningObjectives[`lo${i}`].title}</h5>
            <div class="slides-list" id="slidesList${i}">
                ${slides.map((slide, slideIndex) => `
                <div class="slide-edit-item" data-slide="${slideIndex}">
                    <div class="slide-edit-header">
                        <span>${slide.type}: ${slide.title}</span>
                        <div class="slide-actions">
                            <button class="btn btn-sm btn-outline" onclick="moveTeachingSlide(${i}, ${slideIndex}, 'up')" ${slideIndex === 0 ? 'disabled' : ''}>↑</button>
                            <button class="btn btn-sm btn-outline" onclick="moveTeachingSlide(${i}, ${slideIndex}, 'down')" ${slideIndex === slides.length - 1 ? 'disabled' : ''}>↓</button>
                            <button class="btn btn-sm btn-outline" onclick="editTeachingSlide(${i}, ${slideIndex})">Edit</button>
                            <button class="btn btn-sm btn-outline delete-btn" onclick="removeTeachingSlide(${i}, ${slideIndex})">×</button>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
            <button class="btn btn-primary" onclick="addTeachingSlide(${i})">+ Add New Slide</button>
        `;
        
        slidesContentContainer.appendChild(contentElement);
    }
}

// Save teaching slides
function saveTeachingSlides() {
    // We don't need additional processing here since each edit is saved directly to state
    // Just close the modal
    closeModal('teachingSlidesEditModal');
    
    // Update the preview
    processTeachingInputResponse(appState.responses.teachingInput);
}

// Edit a teaching slide
function editTeachingSlide(loNumber, slideIndex) {
    const slide = appState.slides.teaching[`lo${loNumber}`].slides[slideIndex];
    
    // Set up the edit modal
    document.getElementById('editSlideLoNumber').value = loNumber;
    document.getElementById('editSlideIndex').value = slideIndex;
    document.getElementById('editSlideType').value = slide.type;
    document.getElementById('editSlideTitle').value = slide.title;
    document.getElementById('editSlideContent').value = slide.content;
    document.getElementById('editSlideVisuals').value = slide.visualElements;
    document.getElementById('editSlideNotes').value = slide.notes;
    
    // Show the modal
    document.getElementById('teachingSlideEditModal').style.display = 'flex';
}

// Save edited teaching slide
function saveTeachingSlide() {
    const loNumber = document.getElementById('editSlideLoNumber').value;
    const slideIndex = document.getElementById('editSlideIndex').value;
    
    // Update slide in state
    appState.slides.teaching[`lo${loNumber}`].slides[slideIndex] = {
        type: document.getElementById('editSlideType').value,
        title: document.getElementById('editSlideTitle').value,
        content: document.getElementById('editSlideContent').value,
        visualElements: document.getElementById('editSlideVisuals').value,
        notes: document.getElementById('editSlideNotes').value
    };
    
    // Close the modal
    closeModal('teachingSlideEditModal');
    
    // Update the edit UI
    updateTeachingSlidesEditUI();
}

// Add a new teaching slide
function addTeachingSlide(loNumber) {
    // Add a new slide to the LO
    appState.slides.teaching[`lo${loNumber}`].slides.push({
        type: 'keyContent',
        title: 'New Slide',
        content: '',
        visualElements: '',
        notes: ''
    });
    
    // Update the edit UI
    updateTeachingSlidesEditUI();
    
    // Edit the new slide
    const newSlideIndex = appState.slides.teaching[`lo${loNumber}`].slides.length - 1;
    editTeachingSlide(loNumber, newSlideIndex);
}

// Remove a teaching slide
function removeTeachingSlide(loNumber, slideIndex) {
    if (confirm('Are you sure you want to remove this slide?')) {
        appState.slides.teaching[`lo${loNumber}`].slides.splice(slideIndex, 1);
        updateTeachingSlidesEditUI();
    }
}

// Move a teaching slide up or down
function moveTeachingSlide(loNumber, slideIndex, direction) {
    const slides = appState.slides.teaching[`lo${loNumber}`].slides;
    
    if (direction === 'up' && slideIndex > 0) {
        [slides[slideIndex], slides[slideIndex - 1]] = [slides[slideIndex - 1], slides[slideIndex]];
    } else if (direction === 'down' && slideIndex < slides.length - 1) {
        [slides[slideIndex], slides[slideIndex + 1]] = [slides[slideIndex + 1], slides[slideIndex]];
    }
    
    updateTeachingSlidesEditUI();
}

// Validate requirements for Step 3B
function validateStep3BRequirements() {
    if (!appState.responseTags.priorKnowledge || !appState.responseTags.frameworks) {
        alert('Please complete Steps 1 and 2 first');
        return false;
    }
    
    if (!appState.responseTags.retrievalQuestions) {
        alert('Please complete Step 3A (Retrieval Practice) first');
        return false;
    }
    
    return true;
}

// ===== SUBSTEP 3C: FORMATIVE ASSESSMENT SLIDES =====

// Initialize Step 3C (Formative Assessment Slides)
function initializeStep3C() {
    // Generate the formative assessment prompt when button is clicked
    document.getElementById('generateFormativePromptBtn').addEventListener('click', generateFormativeAssessmentPrompt);
    
    // Copy formative assessment prompt to clipboard
    document.getElementById('copyFormativePromptBtn').addEventListener('click', () => {
        copyToClipboard('formativePromptTextarea');
    });
    
    // Preview formative assessment response
    document.getElementById('previewFormativeResponseBtn').addEventListener('click', () => {
        previewFormativeAssessmentResponse();
    });
    
    // Switch between formatted and tagged response views
    document.querySelectorAll('#formativePreview .response-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            document.querySelectorAll('#formativePreview .response-tab').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('#formativePreview .response-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}Response`).classList.add('active');
        });
    });
    
    // Enable continue button when response is processed
    document.getElementById('formativeResponseTextarea').addEventListener('input', function() {
        processFormativeAssessmentResponse(this.value);
        document.getElementById('continueToSlideReviewBtn').disabled = !this.value.trim();
    });
    
    // Add event listeners for editing formative assessment questions
    document.getElementById('editFormativeQuestionsBtn').addEventListener('click', openFormativeQuestionsModal);
    document.getElementById('saveFormativeQuestionsBtn').addEventListener('click', saveFormativeQuestions);
    
    // Display learning objectives and misconceptions for formative assessment
    displayLearningObjectivesForFormative();
}

// Generate the formative assessment prompt
function generateFormativeAssessmentPrompt() {
    if (!validateStep3CRequirements()) return;
    
    // Get learning objectives, types, and misconceptions
    const learningObjectives = appState.learningObjectives;
    const loTypes = appState.loTypes;
    const misconceptions = appState.misconceptions;
    const examTechniques = appState.examTechniques;
    
    // Create the formative assessment prompt
    let prompt = `You are an expert science teacher creating formative assessment slides for a GCSE lesson. 

I need you to create formative assessment questions for my lesson on "${appState.lessonInfo.lessonTitle}".

Course Details:
- Exam Board: ${appState.lessonInfo.provider}
- Subject: ${appState.lessonInfo.subject}
- Topic: ${appState.lessonInfo.topic}
- Level: ${appState.lessonInfo.level}
- Student Ability: ${appState.lessonInfo.ability}

Here are the learning objectives for this lesson:
`;

    // Add learning objectives and their assessment types
    for (let i = 1; i <= learningObjectives.count; i++) {
        prompt += `\nLearning Objective ${i}: "${learningObjectives[`lo${i}`].title}"
- Description: ${learningObjectives[`lo${i}`].description}
- Assessment Type: ${loTypes[`lo${i}`].aoCategory} (${loTypes[`lo${i}`].specificType})`;

        // Add exam techniques if any are selected
        const techniques = [];
        if (examTechniques[`lo${i}`].BLT) techniques.push('BLT (Because, Link, Therefore)');
        if (examTechniques[`lo${i}`].EVERY) techniques.push('EVERY (Equation, Values, Equals, Rearrange, Y=Answer)');
        if (examTechniques[`lo${i}`].MEMES) techniques.push('MEMES (Method, Equipment, Measurements, Evaluation, Safety)');
        if (examTechniques[`lo${i}`].GRAPH) techniques.push('GRAPH (Grid, Right scale, Axis labeled, Plot, Head)');
        
        if (techniques.length > 0) {
            prompt += `
- Exam Techniques: ${techniques.join(', ')}`;
        }
        
        // Add key misconceptions to address
        if (misconceptions[`lo${i}`].length > 0) {
            prompt += `
- Key Misconceptions to Address:`;
            misconceptions[`lo${i}`].forEach(misconception => {
                prompt += `
  * ${misconception}`;
            });
        }
    }
    
    // Add question requirements
    prompt += `\n\nFor each learning objective, please create the following formative assessment content:

1. 3-5 questions that assess student understanding of the key concepts
2. Questions that specifically target and address the common misconceptions
3. A mix of question types appropriate for the assessment objectives (AO1, AO2, AO3)
4. Questions that allow students to practice relevant exam techniques where applicable

Question types should include:
- Multiple choice questions
- Short answer questions
- Extended response questions
- Practical data analysis questions (where relevant)
- Calculation questions (for Physics or Chemistry)

Each question should:
- Clearly test one aspect of the learning objective
- Have an appropriate mark allocation
- Include a model answer and marking guidelines
- Include common errors to look for

Output your response in this XML format:
<formativeAssessment>
  <learningObjective number="1">
    <title>${learningObjectives.lo1.title}</title>
    <questions>
      <question>
        <text>Question text goes here</text>
        <type>multiple-choice/short-answer/extended-response/calculation/practical</type>
        <marks>Marks available (e.g., 3)</marks>
        <answer>Model answer</answer>
        <markingGuidelines>
          <point>1 mark for...</point>
          <point>1 mark for...</point>
          <point>1 mark for...</point>
        </markingGuidelines>
        <commonErrors>
          <error>Common mistake 1</error>
          <error>Common mistake 2</error>
        </commonErrors>
        <targetedMisconception>Which misconception this addresses (if any)</targetedMisconception>
      </question>
      <!-- Repeat for each question -->
    </questions>
  </learningObjective>
  <!-- Repeat for each learning objective -->
</formativeAssessment>

Please ensure the questions increase in difficulty and align with the assessment objectives for each learning objective.`;

    // Set the prompt in the textarea
    document.getElementById('formativePromptTextarea').value = prompt;
}

// Preview the formative assessment response
function previewFormativeAssessmentResponse() {
    const responseText = document.getElementById('formativeResponseTextarea').value.trim();
    if (!responseText) {
        alert('Please paste Claude\'s response first');
        return;
    }
    
    // Display tagged response
    document.getElementById('formativeTaggedResponse').innerHTML = escapeHTML(responseText);
    
    // Process and display formatted response
    processFormativeAssessmentResponse(responseText);
    
    // Show the preview
    document.getElementById('formativePreview').style.display = 'block';
    document.getElementById('formativeEditContainer').style.display = 'block';
}

// Process the formative assessment response
function processFormativeAssessmentResponse(responseText) {
    try {
        // Extract the XML content
        const xmlMatch = responseText.match(/<formativeAssessment>[\s\S]*?<\/formativeAssessment>/);
        if (!xmlMatch) {
            console.error('No formativeAssessment tag found in the response');
            return;
        }
        
        const xmlContent = xmlMatch[0];
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
        
        // Store in appState
        appState.responseTags.formativeAssessment = xmlContent;
        appState.responses.formative = responseText;
        
        // Parse learning objectives and questions from XML
        const loNodes = xmlDoc.querySelectorAll('learningObjective');
        appState.slides.formative = {};
        
        loNodes.forEach(loNode => {
            const loNumber = loNode.getAttribute('number');
            const loTitle = getXmlChildText(loNode, 'title') || '';
            const questionNodes = loNode.querySelectorAll('questions > question');
            
            appState.slides.formative[`lo${loNumber}`] = {
                title: loTitle,
                questions: []
            };
            
            questionNodes.forEach(questionNode => {
                const markingGuidelines = [];
                questionNode.querySelectorAll('markingGuidelines > point').forEach(point => {
                    markingGuidelines.push(point.textContent.trim());
                });
                
                const commonErrors = [];
                questionNode.querySelectorAll('commonErrors > error').forEach(error => {
                    commonErrors.push(error.textContent.trim());
                });
                
                const question = {
                    text: getXmlChildText(questionNode, 'text') || '',
                    type: getXmlChildText(questionNode, 'type') || '',
                    marks: getXmlChildText(questionNode, 'marks') || '',
                    answer: getXmlChildText(questionNode, 'answer') || '',
                    markingGuidelines: markingGuidelines,
                    commonErrors: commonErrors,
                    targetedMisconception: getXmlChildText(questionNode, 'targetedMisconception') || ''
                };
                
                appState.slides.formative[`lo${loNumber}`].questions.push(question);
            });
        });
        
        // Generate formatted HTML for preview
        let formattedHTML = '<h4>Formative Assessment Questions</h4>';
        
        for (let i = 1; i <= appState.learningObjectives.count; i++) {
            if (!appState.slides.formative[`lo${i}`]) continue;
            
            formattedHTML += `
            <div class="lo-container">
                <div class="lo-header">
                    <h5>Learning Objective ${i}: ${appState.slides.formative[`lo${i}`].title}</h5>
                </div>
                <div class="questions-container">`;
                
            appState.slides.formative[`lo${i}`].questions.forEach((question, questionIndex) => {
                formattedHTML += `
                <div class="question-preview">
                    <div class="question-header">
                        <span class="question-type">${question.type}</span>
                        <span class="question-marks">${question.marks} marks</span>
                    </div>
                    <p><strong>Question ${questionIndex + 1}:</strong> ${question.text}</p>
                    <p><strong>Answer:</strong> ${question.answer}</p>
                    
                    <div class="marking-guidelines">
                        <p><strong>Marking Guidelines:</strong></p>
                        <ul>`;
                
                question.markingGuidelines.forEach(guideline => {
                    formattedHTML += `<li>${guideline}</li>`;
                });
                
                formattedHTML += `
                        </ul>
                    </div>
                    
                    <div class="common-errors">
                        <p><strong>Common Errors:</strong></p>
                        <ul>`;
                
                question.commonErrors.forEach(error => {
                    formattedHTML += `<li>${error}</li>`;
                });
                
                formattedHTML += `
                        </ul>
                    </div>
                    
                    ${question.targetedMisconception ? `
                    <p><strong>Targeted Misconception:</strong> ${question.targetedMisconception}</p>` : ''}
                </div>`;
            });
                
            formattedHTML += `
                </div>
            </div>`;
        }
        
        document.getElementById('formativeFormattedResponse').innerHTML = formattedHTML;
        
        return true;
    } catch (error) {
        console.error('Error processing formative assessment response:', error);
        document.getElementById('formativeFormattedResponse').innerHTML = '<p class="error">Error processing the response. Please check the format.</p>';
        return false;
    }
}

// Display learning objectives and misconceptions for formative assessment
function displayLearningObjectivesForFormative() {
    if (!appState.learningObjectives.lo1.title) return;
    
    let loHTML = '<h4>Learning Objectives and Misconceptions</h4><div class="lo-summary">';
    
    for (let i = 1; i <= appState.learningObjectives.count; i++) {
        const lo = appState.learningObjectives[`lo${i}`];
        const loType = appState.loTypes[`lo${i}`];
        
        loHTML += `<div class="lo-container">
            <div class="lo-header">
                <span>Learning Objective ${i}</span>
                <div>
                    <span class="ao-badge">${loType.aoCategory}</span>
                </div>
            </div>
            <p><strong>${lo.title}</strong></p>
            <p>${lo.description}</p>
            
            <div class="misconceptions-summary">
                <p><strong>Key Misconceptions:</strong></p>
                <ul>`;
        
        if (appState.misconceptions[`lo${i}`].length > 0) {
            appState.misconceptions[`lo${i}`].forEach(misconception => {
                loHTML += `<li>${misconception}</li>`;
            });
        } else {
            loHTML += `<li>No misconceptions identified</li>`;
        }
        
        loHTML += `</ul>
            </div>
        </div>`;
    }
    
    loHTML += '</div>';
    
    document.getElementById('misconceptionsForFormative').innerHTML = loHTML;
}

// Open formative questions edit modal
function openFormativeQuestionsModal() {
    // Set up temporary state
    appState.editState.tempFormativeQuestions = JSON.parse(JSON.stringify(appState.slides.formative));
    
    // Update the edit UI
    updateFormativeQuestionsEditUI();
    
    // Show the modal
    document.getElementById('formativeQuestionsEditModal').style.display = 'flex';
}

// Update the formative questions edit UI
function updateFormativeQuestionsEditUI() {
    const questionsTabContainer = document.getElementById('formativeQuestionsTabContainer');
    const questionsContentContainer = document.getElementById('formativeQuestionsContentContainer');
    
    questionsTabContainer.innerHTML = '';
    questionsContentContainer.innerHTML = '';
    
    // Add tabs for each learning objective
    for (let i = 1; i <= appState.learningObjectives.count; i++) {
        if (!appState.slides.formative[`lo${i}`]) continue;
        
        const tabElement = document.createElement('div');
        tabElement.className = `questions-tab ${i === 1 ? 'active' : ''}`;
        tabElement.setAttribute('data-lo', i);
        tabElement.textContent = `LO ${i}`;
        tabElement.onclick = function() {
            document.querySelectorAll('.questions-tab').forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.questions-content').forEach(content => content.classList.remove('active'));
            document.querySelector(`.questions-content[data-lo="${this.getAttribute('data-lo')}"]`).classList.add('active');
        };
        
        questionsTabContainer.appendChild(tabElement);
        
        // Add content for each learning objective
        const contentElement = document.createElement('div');
        contentElement.className = `questions-content ${i === 1 ? 'active' : ''}`;
        contentElement.setAttribute('data-lo', i);
        
        const questions = appState.slides.formative[`lo${i}`].questions;
        
        contentElement.innerHTML = `
            <h5>${appState.learningObjectives[`lo${i}`].title}</h5>
            <div class="questions-list" id="questionsList${i}">
                ${questions.map((question, questionIndex) => `
                <div class="question-edit-item" data-question="${questionIndex}">
                    <div class="question-edit-header">
                        <span>${question.type} (${question.marks}): ${question.text.substring(0, 50)}${question.text.length > 50 ? '...' : ''}</span>
                        <div class="question-actions">
                            <button class="btn btn-sm btn-outline" onclick="moveFormativeQuestion(${i}, ${questionIndex}, 'up')" ${questionIndex === 0 ? 'disabled' : ''}>↑</button>
                            <button class="btn btn-sm btn-outline" onclick="moveFormativeQuestion(${i}, ${questionIndex}, 'down')" ${questionIndex === questions.length - 1 ? 'disabled' : ''}>↓</button>
                            <button class="btn btn-sm btn-outline" onclick="editFormativeQuestion(${i}, ${questionIndex})">Edit</button>
                            <button class="btn btn-sm btn-outline delete-btn" onclick="removeFormativeQuestion(${i}, ${questionIndex})">×</button>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
            <button class="btn btn-primary" onclick="addFormativeQuestion(${i})">+ Add New Question</button>
        `;
        
        questionsContentContainer.appendChild(contentElement);
    }
}

// Save formative questions
function saveFormativeQuestions() {
    // We don't need additional processing here since each edit is saved directly to state
    // Just close the modal
    closeModal('formativeQuestionsEditModal');
    
    // Update the preview
    processFormativeAssessmentResponse(appState.responses.formative);
}

// Edit a formative question
function editFormativeQuestion(loNumber, questionIndex) {
    const question = appState.slides.formative[`lo${loNumber}`].questions[questionIndex];
    
    // Set up the edit modal
    document.getElementById('editQuestionLoNumber').value = loNumber;
    document.getElementById('editQuestionIndex').value = questionIndex;
    document.getElementById('editQuestionText').value = question.text;
    document.getElementById('editQuestionType').value = question.type;
    document.getElementById('editQuestionMarks').value = question.marks;
    document.getElementById('editQuestionAnswer').value = question.answer;
    document.getElementById('editQuestionMisconception').value = question.targetedMisconception;
    
    // Clear existing guidelines and errors
    document.getElementById('markingGuidelinesContainer').innerHTML = '';
    document.getElementById('commonErrorsContainer').innerHTML = '';
    
    // Add marking guidelines
    question.markingGuidelines.forEach((guideline, index) => {
        addMarkingGuidelineField(guideline);
    });
    
    // Add at least one empty guideline if none exist
    if (question.markingGuidelines.length === 0) {
        addMarkingGuidelineField('');
    }
    
    // Add common errors
    question.commonErrors.forEach((error, index) => {
        addCommonErrorField(error);
    });
    
    // Add at least one empty error if none exist
    if (question.commonErrors.length === 0) {
        addCommonErrorField('');
    }
    
    // Show the modal
    document.getElementById('formativeQuestionEditModal').style.display = 'flex';
}

// Save edited formative question
function saveFormativeQuestion() {
    const loNumber = document.getElementById('editQuestionLoNumber').value;
    const questionIndex = document.getElementById('editQuestionIndex').value;
    
    // Collect marking guidelines
    const markingGuidelines = [];
    document.querySelectorAll('.marking-guideline-field').forEach(field => {
        const guidelineText = field.value.trim();
        if (guidelineText) {
            markingGuidelines.push(guidelineText);
        }
    });
    
    // Collect common errors
    const commonErrors = [];
    document.querySelectorAll('.common-error-field').forEach(field => {
        const errorText = field.value.trim();
        if (errorText) {
            commonErrors.push(errorText);
        }
    });
    
    // Update question in state
    appState.slides.formative[`lo${loNumber}`].questions[questionIndex] = {
        text: document.getElementById('editQuestionText').value.trim(),
        type: document.getElementById('editQuestionType').value,
        marks: document.getElementById('editQuestionMarks').value.trim(),
        answer: document.getElementById('editQuestionAnswer').value.trim(),
        markingGuidelines: markingGuidelines,
        commonErrors: commonErrors,
        targetedMisconception: document.getElementById('editQuestionMisconception').value.trim()
    };
    
    // Close the modal
    closeModal('formativeQuestionEditModal');
    
    // Update the edit UI
    updateFormativeQuestionsEditUI();
}

// Add a new formative question
function addFormativeQuestion(loNumber) {
    // Add a new question to the LO
    appState.slides.formative[`lo${loNumber}`].questions.push({
        text: '',
        type: 'short-answer',
        marks: '1',
        answer: '',
        markingGuidelines: [''],
        commonErrors: [''],
        targetedMisconception: ''
    });
    
    // Update the edit UI
    updateFormativeQuestionsEditUI();
    
    // Edit the new question
    const newQuestionIndex = appState.slides.formative[`lo${loNumber}`].questions.length - 1;
    editFormativeQuestion(loNumber, newQuestionIndex);
}

// Remove a formative question
function removeFormativeQuestion(loNumber, questionIndex) {
    if (confirm('Are you sure you want to remove this question?')) {
        appState.slides.formative[`lo${loNumber}`].questions.splice(questionIndex, 1);
        updateFormativeQuestionsEditUI();
    }
}

// Move a formative question up or down
function moveFormativeQuestion(loNumber, questionIndex, direction) {
    const questions = appState.slides.formative[`lo${loNumber}`].questions;
    
    if (direction === 'up' && questionIndex > 0) {
        [questions[questionIndex], questions[questionIndex - 1]] = [questions[questionIndex - 1], questions[questionIndex]];
    } else if (direction === 'down' && questionIndex < questions.length - 1) {
        [questions[questionIndex], questions[questionIndex + 1]] = [questions[questionIndex + 1], questions[questionIndex]];
    }
    
    updateFormativeQuestionsEditUI();
}

// Add a marking guideline field
function addMarkingGuidelineField(value = '') {
    const container = document.getElementById('markingGuidelinesContainer');
    
    const guidelineGroup = document.createElement('div');
    guidelineGroup.className = 'input-group';
    
    guidelineGroup.innerHTML = `
        <input type="text" class="form-control marking-guideline-field" value="${value}" placeholder="Enter marking guideline...">
        <button class="btn btn-outline delete-btn" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(guidelineGroup);
}

// Add a common error field
function addCommonErrorField(value = '') {
    const container = document.getElementById('commonErrorsContainer');
    
    const errorGroup = document.createElement('div');
    errorGroup.className = 'input-group';
    
    errorGroup.innerHTML = `
        <input type="text" class="form-control common-error-field" value="${value}" placeholder="Enter common error...">
        <button class="btn btn-outline delete-btn" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(errorGroup);
}

// Validate requirements for Step 3C
function validateStep3CRequirements() {
    if (!appState.responseTags.misconceptions) {
        alert('Please complete Step 1C (Misconceptions) first');
        return false;
    }
    
    if (!appState.responseTags.teachingSlides) {
        alert('Please complete Step 3B (Teaching Input) first');
        return false;
    }
    
    return true;
}

// ===== SUBSTEP 3D: REVIEW & EDIT =====

// Initialize Step 3D (Review & Edit)
function initializeStep3D() {
    // Display comprehensive slide review
    updateSlideReview();
    
    // Add event listener for completing Step 3
    document.getElementById('finishStep3Btn').addEventListener('click', finishStep3);
    
    // Enable continue button if all required components are present
    checkStep3Completion();
}

// Update the slide review
function updateSlideReview() {
    // Display retrieval practice slides
    updateRetrievalSlidesReview();
    
    // Display teaching input slides
    updateTeachingSlidesReview();
    
    // Display formative assessment slides
    updateFormativeSlidesReview();
    
    // Display slide sequence
    updateSlideSequenceReview();
}

// Update retrieval slides review
function updateRetrievalSlidesReview() {
    if (!appState.slides.retrieval || !appState.slides.retrieval.questions) {
        document.getElementById('retrievalSlidesReview').innerHTML = '<p>Complete Step 3A to see retrieval practice slides.</p>';
        return;
    }
    
    let html = `<h5>Retrieval Practice (${appState.slides.retrieval.questions.length} questions)</h5>
    <div class="slides-review-container">`;
    
    appState.slides.retrieval.questions.forEach((question, index) => {
        html += `
        <div class="slide-review-item">
            <div class="slide-review-header">
                <span class="slide-number">Q${index + 1}</span>
                <span class="slide-type">${question.type}</span>
            </div>
            <p>${question.text}</p>
        </div>`;
    });
    
    html += `</div>`;
    
    document.getElementById('retrievalSlidesReview').innerHTML = html;
}

// Update teaching slides review
function updateTeachingSlidesReview() {
    if (!appState.slides.teaching || Object.keys(appState.slides.teaching).length === 0) {
        document.getElementById('teachingSlidesReview').innerHTML = '<p>Complete Step 3B to see teaching input slides.</p>';
        return;
    }
    
    let html = '<h5>Teaching Input Slides</h5>';
    
    // Count total slides
    let totalSlides = 0;
    for (let i = 1; i <= appState.learningObjectives.count; i++) {
        if (appState.slides.teaching[`lo${i}`]) {
            totalSlides += appState.slides.teaching[`lo${i}`].slides.length;
        }
    }
    
    html += `<p><strong>Total Slides:</strong> ${totalSlides}</p>
    <div class="slides-review-container">`;
    
    for (let i = 1; i <= appState.learningObjectives.count; i++) {
        if (!appState.slides.teaching[`lo${i}`]) continue;
        
        html += `
        <div class="lo-review-section">
            <h6>LO ${i}: ${appState.learningObjectives[`lo${i}`].title}</h6>
            <div class="lo-slides-container">`;
        
        appState.slides.teaching[`lo${i}`].slides.forEach((slide, slideIndex) => {
            html += `
            <div class="slide-review-item">
                <div class="slide-review-header">
                    <span class="slide-number">Slide ${slideIndex + 1}</span>
                    <span class="slide-type">${slide.type}</span>
                </div>
                <p><strong>${slide.title}</strong></p>
            </div>`;
        });
        
        html += `</div>
        </div>`;
    }
    
    html += `</div>`;
    
    document.getElementById('teachingSlidesReview').innerHTML = html;
}

// Update formative slides review
function updateFormativeSlidesReview() {
    if (!appState.slides.formative || Object.keys(appState.slides.formative).length === 0) {
        document.getElementById('formativeSlidesReview').innerHTML = '<p>Complete Step 3C to see formative assessment slides.</p>';
        return;
    }
    
    let html = '<h5>Formative Assessment Questions</h5>';
    
    // Count total questions
    let totalQuestions = 0;
    for (let i = 1; i <= appState.learningObjectives.count; i++) {
        if (appState.slides.formative[`lo${i}`]) {
            totalQuestions += appState.slides.formative[`lo${i}`].questions.length;
        }
    }
    
    html += `<p><strong>Total Questions:</strong> ${totalQuestions}</p>
    <div class="slides-review-container">`;
    
    for (let i = 1; i <= appState.learningObjectives.count; i++) {
        if (!appState.slides.formative[`lo${i}`]) continue;
        
        html += `
        <div class="lo-review-section">
            <h6>LO ${i}: ${appState.learningObjectives[`lo${i}`].title}</h6>
            <div class="lo-questions-container">`;
        
        appState.slides.formative[`lo${i}`].questions.forEach((question, questionIndex) => {
            html += `
            <div class="slide-review-item">
                <div class="slide-review-header">
                    <span class="slide-number">Q${questionIndex + 1}</span>
                    <span class="slide-type">${question.type} (${question.marks})</span>
                </div>
                <p>${question.text.substring(0, 100)}${question.text.length > 100 ? '...' : ''}</p>
            </div>`;
        });
        
        html += `</div>
        </div>`;
    }
    
    html += `</div>`;
    
    document.getElementById('formativeSlidesReview').innerHTML = html;
}

// Update slide sequence review
function updateSlideSequenceReview() {
    if (!appState.slides.retrieval || !appState.slides.teaching || !appState.slides.formative) {
        document.getElementById('slideSequenceReview').innerHTML = '<p>Complete all of Step 3 to see the slide sequence.</p>';
        return;
    }
    
    let html = '<h5>Complete Slide Sequence</h5>';
    
    // Count total slides
    let totalSlides = 0;
    if (appState.slides.retrieval && appState.slides.retrieval.questions) {
        totalSlides += Math.ceil(appState.slides.retrieval.questions.length / 4); // Estimate 4 questions per slide
    }
    
    for (let i = 1; i <= appState.learningObjectives.count; i++) {
        if (appState.slides.teaching && appState.slides.teaching[`lo${i}`]) {
            totalSlides += appState.slides.teaching[`lo${i}`].slides.length;
        }
    }
    
    if (appState.slides.formative) {
        for (let i = 1; i <= appState.learningObjectives.count; i++) {
            if (appState.slides.formative[`lo${i}`]) {
                totalSlides += Math.ceil(appState.slides.formative[`lo${i}`].questions.length / 2); // Estimate 2 questions per slide
            }
        }
    }
    
    html += `<p><strong>Total Slides:</strong> ${totalSlides}</p>
    <div class="sequence-review-container">
        <ol class="sequence-list">
            <li class="sequence-section">
                <span class="sequence-title">Title Slide</span>
            </li>
            <li class="sequence-section">
                <span class="sequence-title">Lesson Objectives</span>
            </li>
            <li class="sequence-section">
                <span class="sequence-title">Retrieval Practice (${appState.slides.retrieval ? appState.slides.retrieval.questions.length : 0} questions)</span>
            </li>`;
    
    // Add teaching slides in order of learning objectives
    for (let i = 1; i <= appState.learningObjectives.count; i++) {
        if (!appState.slides.teaching || !appState.slides.teaching[`lo${i}`]) continue;
        
        html += `
            <li class="sequence-section">
                <span class="sequence-title">LO ${i}: ${appState.learningObjectives[`lo${i}`].title}</span>
                <ol class="sequence-sublist">`;
        
        appState.slides.teaching[`lo${i}`].slides.forEach((slide, slideIndex) => {
            html += `
                    <li class="sequence-item">
                        <span class="sequence-item-title">${slide.type}: ${slide.title}</span>
                    </li>`;
        });
        
        html += `
                </ol>
            </li>`;
        
        // Add formative assessment for this LO
        if (appState.slides.formative && appState.slides.formative[`lo${i}`]) {
            html += `
            <li class="sequence-section">
                <span class="sequence-title">Formative Assessment for LO ${i} (${appState.slides.formative[`lo${i}`].questions.length} questions)</span>
            </li>`;
        }
    }
    
    html += `
            <li class="sequence-section">
                <span class="sequence-title">Lesson Summary</span>
            </li>
        </ol>
    </div>`;
    
    document.getElementById('slideSequenceReview').innerHTML = html;
}

// Check if Step 3 is complete
function checkStep3Completion() {
    const hasRetrieval = appState.slides.retrieval && appState.slides.retrieval.questions && appState.slides.retrieval.questions.length > 0;
    const hasTeaching = appState.slides.teaching && Object.keys(appState.slides.teaching).length > 0;
    const hasFormative = appState.slides.formative && Object.keys(appState.slides.formative).length > 0;
    
    const isComplete = hasRetrieval && hasTeaching && hasFormative;
    
    document.getElementById('finishStep3Btn').disabled = !isComplete;
    
    return isComplete;
}

// ===== UTILITY FUNCTIONS =====

// Get the text content of an XML child element
function getXmlChildText(parentElement, childTagName) {
    const childElement = parentElement.querySelector(childTagName);
    return childElement ? childElement.textContent.trim() : '';
}

// Escape HTML characters for safe display
function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}