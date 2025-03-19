// EXPORT FUNCTIONALITY
// Handles all export and save/load operations for the lesson planner

// PowerPoint Export Functions
function generateSlidesXml() {
    // Create XML for PowerPoint export
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<slides version="1.0">
    <metadata>
        <title>${escapeXml(appState.lessonInfo.lessonTitle)}</title>
        <subject>${escapeXml(appState.lessonInfo.subject)}</subject>
        <topic>${escapeXml(appState.lessonInfo.topic)}</topic>
        <provider>${escapeXml(appState.lessonInfo.provider)}</provider>
        <level>${escapeXml(appState.lessonInfo.level)}</level>
        <created>${new Date().toISOString()}</created>
    </metadata>
    <slide_collection>`;

    // Add retrieval practice slides
    if (appState.slides.retrieval && appState.slides.retrieval.questions && appState.slides.retrieval.questions.length > 0) {
        xml += `
        <section id="retrieval" title="Retrieval Practice">
            <slide template_id="retrieval_title" transition="fade">
                <content placeholder="title">Retrieval Practice</content>
                <content placeholder="subtitle">Activate Prior Knowledge</content>
            </slide>`;
            
        // Add each retrieval question as a slide
        appState.slides.retrieval.questions.forEach((question, index) => {
            xml += `
            <slide template_id="question_answer" transition="fade">
                <content placeholder="title">Question ${index + 1}</content>
                <content placeholder="question">${escapeXml(question.text)}</content>
                <content placeholder="answer">${escapeXml(question.answer)}</content>
                <content placeholder="notes">${escapeXml(question.priorKnowledgeLink || '')}</content>
            </slide>`;
        });
            
        xml += `
        </section>`;
    }

    // Add teaching slides for each learning objective
    for (let loNum = 1; loNum <= 3; loNum++) {
        if (loNum === 3 && !appState.learningObjectives.lo3.exists) continue;
        
        const loKey = 'lo' + loNum;
        if (appState.slides.teaching && appState.slides.teaching[loKey] && appState.slides.teaching[loKey].slides) {
            const loTitle = appState.learningObjectives[loKey].title || `Learning Objective ${loNum}`;
            
            xml += `
        <section id="${loKey}" title="${escapeXml(loTitle)}">
            <slide template_id="section_header" transition="zoom">
                <content placeholder="title">Learning Objective ${loNum}</content>
                <content placeholder="content">${escapeXml(loTitle)}</content>
            </slide>`;
            
            // Add each teaching slide
            appState.slides.teaching[loKey].slides.forEach((slide, index) => {
                // Determine template based on slide type
                let templateId = "content";
                
                switch(slide.type) {
                    case "introduction":
                        templateId = "intro";
                        break;
                    case "keyContent":
                        templateId = "content";
                        break;
                    case "framework":
                        templateId = "framework";
                        break;
                    case "practical":
                        templateId = "practical";
                        break;
                    case "frayerModel":
                        templateId = "frayer";
                        break;
                    case "misconception":
                        templateId = "misconception";
                        break;
                    case "summary":
                        templateId = "summary";
                        break;
                }
                
                xml += `
            <slide template_id="${templateId}" transition="fade">
                <content placeholder="title">${escapeXml(slide.title)}</content>
                <content placeholder="content">${escapeXml(slide.content)}</content>`;
                
                if (slide.visualElements && appState.export.slides.includeVisualPlaceholders) {
                    xml += `
                <content placeholder="visual">${escapeXml(slide.visualElements)}</content>`;
                }
                
                if (slide.notes && appState.export.slides.includeNotes) {
                    xml += `
                <notes>${escapeXml(slide.notes)}</notes>`;
                }
                
                xml += `
            </slide>`;
            });
            
            xml += `
        </section>`;
        }
    }

    // Add formative assessment slides
    for (let loNum = 1; loNum <= 3; loNum++) {
        if (loNum === 3 && !appState.learningObjectives.lo3.exists) continue;
        
        const loKey = 'lo' + loNum;
        if (appState.slides.formative && appState.slides.formative[loKey] && appState.slides.formative[loKey].questions) {
            const loTitle = appState.learningObjectives[loKey].title || `Learning Objective ${loNum}`;
            
            xml += `
        <section id="formative_${loKey}" title="Assessment for ${escapeXml(loTitle)}">
            <slide template_id="section_header" transition="zoom">
                <content placeholder="title">Check Your Understanding</content>
                <content placeholder="content">Learning Objective ${loNum}: ${escapeXml(loTitle)}</content>
            </slide>`;
            
            // Add each formative question as a slide
            appState.slides.formative[loKey].questions.forEach((question, index) => {
                xml += `
            <slide template_id="formative_question" transition="fade">
                <content placeholder="title">Question ${index + 1} (${question.marks} marks)</content>
                <content placeholder="question">${escapeXml(question.text)}</content>
                <content placeholder="type">${escapeXml(question.type)}</content>`;
                
                if (question.targetedMisconception) {
                    xml += `
                <content placeholder="misconception">${escapeXml(question.targetedMisconception)}</content>`;
                }
                
                if (appState.export.slides.includeNotes) {
                    xml += `
                <notes>${escapeXml(question.answer || '')}</notes>`;
                }
                
                xml += `
            </slide>`;
            });
            
            xml += `
        </section>`;
        }
    }

    // Add closing slide
    xml += `
        <section id="conclusion" title="Conclusion">
            <slide template_id="conclusion" transition="zoom">
                <content placeholder="title">Lesson Summary</content>
                <content placeholder="content">We've covered:`;
    
    // Add each learning objective to summary
    for (let loNum = 1; loNum <= 3; loNum++) {
        if (loNum === 3 && !appState.learningObjectives.lo3.exists) continue;
        
        const loKey = 'lo' + loNum;
        const loTitle = appState.learningObjectives[loKey].title || `Learning Objective ${loNum}`;
        
        xml += `
                • ${escapeXml(loTitle)}`;
    }
    
    xml += `
                </content>
            </slide>
        </section>
    </slide_collection>
</slides>`;

    return xml;
}

function generateWorksheetXml(worksheetNum = 1) {
    // Create XML for worksheet export
    const worksheetKey = `worksheet${worksheetNum}`;
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<worksheet version="1.0">
    <metadata>
        <title>${escapeXml(appState.lessonInfo.lessonTitle)} - Worksheet ${worksheetNum}</title>
        <subject>${escapeXml(appState.lessonInfo.subject)}</subject>
        <topic>${escapeXml(appState.lessonInfo.topic)}</topic>
        <provider>${escapeXml(appState.lessonInfo.provider)}</provider>
        <level>${escapeXml(appState.lessonInfo.level)}</level>
        <created>${new Date().toISOString()}</created>
    </metadata>
    <worksheet_content>`;

    // Add reference materials
    if (appState.worksheets.reference && shouldIncludeSection(worksheetNum, 'reference')) {
        xml += `
        <section id="reference" title="Reference Materials">`;
        
        // Add definitions
        if (appState.worksheets.reference.definitions && appState.worksheets.reference.definitions.length > 0) {
            xml += `
            <definitions>`;
            
            appState.worksheets.reference.definitions.forEach((def) => {
                xml += `
                <definition>
                    <term>${escapeXml(def.term)}</term>
                    <description>${escapeXml(def.description)}</description>
                </definition>`;
            });
            
            xml += `
            </definitions>`;
        }
        
        // Add formulas
        if (appState.worksheets.reference.formulas && appState.worksheets.reference.formulas.length > 0) {
            xml += `
            <formulas>`;
            
            appState.worksheets.reference.formulas.forEach((formula) => {
                xml += `
                <formula>
                    <name>${escapeXml(formula.name)}</name>
                    <expression>${escapeXml(formula.expression)}</expression>
                    <variables>${escapeXml(formula.variables || '')}</variables>
                </formula>`;
            });
            
            xml += `
            </formulas>`;
        }
        
        // Add diagrams
        if (appState.worksheets.reference.diagrams && appState.worksheets.reference.diagrams.length > 0) {
            xml += `
            <diagrams>`;
            
            appState.worksheets.reference.diagrams.forEach((diagram) => {
                xml += `
                <diagram>
                    <title>${escapeXml(diagram.title)}</title>
                    <description>${escapeXml(diagram.description)}</description>
                </diagram>`;
            });
            
            xml += `
            </diagrams>`;
        }
        
        // Add examples
        if (appState.worksheets.reference.examples && appState.worksheets.reference.examples.length > 0) {
            xml += `
            <examples>`;
            
            appState.worksheets.reference.examples.forEach((example) => {
                xml += `
                <example>
                    <title>${escapeXml(example.title)}</title>
                    <content>${escapeXml(example.content)}</content>
                </example>`;
            });
            
            xml += `
            </examples>`;
        }
        
        xml += `
        </section>`;
    }

    // Add retrieval questions
    if (appState.worksheets.retrieval && appState.worksheets.retrieval[worksheetKey] && appState.worksheets.retrieval[worksheetKey].length > 0) {
        xml += `
        <section id="retrieval" title="Prior Knowledge Retrieval">`;
        
        appState.worksheets.retrieval[worksheetKey].forEach((question, index) => {
            xml += `
            <question id="retrieval_${index + 1}" type="${escapeXml(question.type || 'short-answer')}" marks="${question.marks || 1}">
                <text>${escapeXml(question.text)}</text>`;
                
            if (appState.export.worksheets.includeAnswers) {
                xml += `
                <answer>${escapeXml(question.answer || '')}</answer>`;
            }
                
            if (question.type === 'multiple-choice' && question.options) {
                xml += `
                <options>`;
                
                question.options.forEach((option) => {
                    xml += `
                    <option${option.correct ? ' correct="true"' : ''}>${escapeXml(option.text)}</option>`;
                });
                
                xml += `
                </options>`;
            }
            
            xml += `
            </question>`;
        });
        
        xml += `
        </section>`;
    }

    // Add SCALE questions for each relevant learning objective
    if (appState.worksheets.scale && appState.worksheets.scale[worksheetKey]) {
        for (let loNum = 1; loNum <= 3; loNum++) {
            if (loNum === 3 && !appState.learningObjectives.lo3.exists) continue;
            
            const loKey = 'lo' + loNum;
            // Check if this LO is allocated to this worksheet
            if (appState.lessonStructure.worksheetAllocation[loKey] != worksheetNum) continue;
            
            if (appState.worksheets.scale[worksheetKey][loKey] && appState.worksheets.scale[worksheetKey][loKey].length > 0) {
                const loTitle = appState.learningObjectives[loKey].title || `Learning Objective ${loNum}`;
                
                const selectedQuestions = appState.worksheets.scale[worksheetKey][loKey].filter(q => q.selected);
                if (selectedQuestions.length === 0) continue;
                
                xml += `
        <section id="scale_${loKey}" title="SCALE Questions: ${escapeXml(loTitle)}">`;
                
                selectedQuestions.forEach((question, index) => {
                    xml += `
            <question id="scale_${loKey}_${index + 1}" type="${escapeXml(question.type || 'short-answer')}" scale_level="${escapeXml(question.scaleLevel || 'S')}" marks="${question.marks || 1}">
                <text>${escapeXml(question.text)}</text>`;
                    
                    if (appState.export.worksheets.includeAnswers) {
                        xml += `
                <answer>${escapeXml(question.answer || '')}</answer>`;
                    }
                    
                    if (question.type === 'multiple-choice' && question.options) {
                        xml += `
                <options>`;
                        
                        question.options.forEach((option) => {
                            xml += `
                    <option${option.correct ? ' correct="true"' : ''}>${escapeXml(option.text)}</option>`;
                        });
                        
                        xml += `
                </options>`;
                    }
                    
                    xml += `
            </question>`;
                });
                
                xml += `
        </section>`;
            }
        }
    }

    // Add application questions for each relevant learning objective
    if (appState.worksheets.application && appState.worksheets.application[worksheetKey]) {
        for (let loNum = 1; loNum <= 3; loNum++) {
            if (loNum === 3 && !appState.learningObjectives.lo3.exists) continue;
            
            const loKey = 'lo' + loNum;
            // Check if this LO is allocated to this worksheet
            if (appState.lessonStructure.worksheetAllocation[loKey] != worksheetNum) continue;
            
            if (appState.worksheets.application[worksheetKey][loKey] && appState.worksheets.application[worksheetKey][loKey].length > 0) {
                const loTitle = appState.learningObjectives[loKey].title || `Learning Objective ${loNum}`;
                
                xml += `
        <section id="application_${loKey}" title="Application Questions: ${escapeXml(loTitle)}">`;
                
                appState.worksheets.application[worksheetKey][loKey].forEach((question, index) => {
                    xml += `
            <question id="application_${loKey}_${index + 1}" type="${escapeXml(question.type || 'extended-response')}" framework="${escapeXml(question.framework || 'CER')}" marks="${question.marks || 3}">
                <text>${escapeXml(question.text)}</text>`;
                    
                    if (appState.export.worksheets.includeAnswers) {
                        xml += `
                <answer>${escapeXml(question.answer || '')}</answer>`;
                    }
                    
                    if (question.context) {
                        xml += `
                <context>${escapeXml(question.context)}</context>`;
                    }
                    
                    if (appState.export.worksheets.includeMarkingGuidelines && question.markingGuidelines && question.markingGuidelines.length > 0) {
                        xml += `
                <marking_guidelines>`;
                        
                        question.markingGuidelines.forEach((guideline) => {
                            xml += `
                    <guideline>${escapeXml(guideline)}</guideline>`;
                        });
                        
                        xml += `
                </marking_guidelines>`;
                    }
                    
                    xml += `
            </question>`;
                });
                
                xml += `
        </section>`;
            }
        }
    }

    // Add exam technique questions
    if (appState.worksheets.examTechnique && appState.worksheets.examTechnique[worksheetKey]) {
        for (let loNum = 1; loNum <= 3; loNum++) {
            if (loNum === 3 && !appState.learningObjectives.lo3.exists) continue;
            
            const loKey = 'lo' + loNum;
            // Check if this LO is allocated to this worksheet
            if (appState.lessonStructure.worksheetAllocation[loKey] != worksheetNum) continue;
            
            // Check if this LO has any exam techniques assigned
            const techniques = [];
            if (appState.examTechniques[loKey].BLT) techniques.push('BLT');
            if (appState.examTechniques[loKey].EVERY) techniques.push('EVERY');
            if (appState.examTechniques[loKey].MEMES) techniques.push('MEMES');
            if (appState.examTechniques[loKey].GRAPH) techniques.push('GRAPH');
            
            if (techniques.length === 0) continue;
            
            if (appState.worksheets.examTechnique[worksheetKey][loKey] && appState.worksheets.examTechnique[worksheetKey][loKey].length > 0) {
                const loTitle = appState.learningObjectives[loKey].title || `Learning Objective ${loNum}`;
                
                xml += `
        <section id="examTechnique_${loKey}" title="Exam Technique Questions: ${escapeXml(loTitle)}">`;
                
                appState.worksheets.examTechnique[worksheetKey][loKey].forEach((question, index) => {
                    xml += `
            <question id="examTechnique_${loKey}_${index + 1}" type="${escapeXml(question.type || 'short-answer')}" technique="${escapeXml(question.technique || '')}" marks="${question.marks || 2}">
                <text>${escapeXml(question.text)}</text>`;
                    
                    if (appState.export.worksheets.includeAnswers) {
                        xml += `
                <answer>${escapeXml(question.answer || '')}</answer>`;
                    }
                    
                    if (question.technique_guidance) {
                        xml += `
                <technique_guidance>${escapeXml(question.technique_guidance)}</technique_guidance>`;
                    }
                    
                    xml += `
            </question>`;
                });
                
                xml += `
        </section>`;
            }
        }
    }

    // Add exam style questions
    if (appState.worksheets.examStyle && appState.worksheets.examStyle[worksheetKey]) {
        for (let loNum = 1; loNum <= 3; loNum++) {
            if (loNum === 3 && !appState.learningObjectives.lo3.exists) continue;
            
            const loKey = 'lo' + loNum;
            // Check if this LO is allocated to this worksheet
            if (appState.lessonStructure.worksheetAllocation[loKey] != worksheetNum) continue;
            
            if (appState.worksheets.examStyle[worksheetKey][loKey] && appState.worksheets.examStyle[worksheetKey][loKey].length > 0) {
                const loTitle = appState.learningObjectives[loKey].title || `Learning Objective ${loNum}`;
                
                xml += `
        <section id="examStyle_${loKey}" title="Exam Style Questions: ${escapeXml(loTitle)}">`;
                
                appState.worksheets.examStyle[worksheetKey][loKey].forEach((question, index) => {
                    xml += `
            <question id="examStyle_${loKey}_${index + 1}" type="${escapeXml(question.type || 'extended-response')}" ao_category="${escapeXml(question.aoCategory || 'AO1')}" marks="${question.marks || 4}">
                <text>${escapeXml(question.text)}</text>`;
                    
                    if (appState.export.worksheets.includeAnswers) {
                        xml += `
                <answer>${escapeXml(question.answer || '')}</answer>`;
                    }
                    
                    if (appState.export.worksheets.includeMarkingGuidelines && question.markingGuidelines && question.markingGuidelines.length > 0) {
                        xml += `
                <marking_guidelines>`;
                        
                        question.markingGuidelines.forEach((guideline) => {
                            xml += `
                    <guideline>${escapeXml(guideline)}</guideline>`;
                        });
                        
                        xml += `
                </marking_guidelines>`;
                    }
                    
                    xml += `
            </question>`;
                });
                
                xml += `
        </section>`;
            }
        }
    }

    // Add finalization preferences
    if (appState.worksheets.finalization && appState.worksheets.finalization[worksheetKey]) {
        const finalization = appState.worksheets.finalization[worksheetKey];
        
        xml += `
        <finalization>
            <answer_display>${escapeXml(finalization.answerDisplay || 'Separate')}</answer_display>
            <include_sentence_starters>${finalization.includeSentenceStarters ? 'true' : 'false'}</include_sentence_starters>
            <answer_line_style>${escapeXml(finalization.answerLineStyle || 'Single')}</answer_line_style>
            <show_points>${finalization.showPoints ? 'true' : 'false'}</show_points>
            <section_labeling>${escapeXml(finalization.sectionLabeling || 'Numbered')}</section_labeling>
            <paper_size>${escapeXml(finalization.paperSize || 'A4')}</paper_size>
            <orientation>${escapeXml(finalization.orientation || 'Portrait')}</orientation>
        </finalization>`;
    }

    xml += `
    </worksheet_content>
</worksheet>`;

    return xml;
}

// Export functions
function exportSlidesXml() {
    const xml = generateSlidesXml();
    if (validateXml(xml)) {
        downloadXmlFile(xml, `${sanitizeFilename(appState.lessonInfo.lessonTitle)}_slides.xml`);
        updateExportStatus('slides', 'success', 'Slides XML exported successfully!');
    } else {
        updateExportStatus('slides', 'error', 'Failed to validate slides XML. Please check the console for details.');
    }
}

function exportWorksheetXml(worksheetNum = 1) {
    const xml = generateWorksheetXml(worksheetNum);
    if (validateXml(xml)) {
        downloadXmlFile(xml, `${sanitizeFilename(appState.lessonInfo.lessonTitle)}_worksheet${worksheetNum}.xml`);
        updateExportStatus('worksheet', 'success', `Worksheet ${worksheetNum} XML exported successfully!`);
    } else {
        updateExportStatus('worksheet', 'error', `Failed to validate worksheet ${worksheetNum} XML. Please check the console for details.`);
    }
}

function exportAllWorksheets() {
    let success = true;
    
    for (let i = 1; i <= appState.worksheets.count; i++) {
        const xml = generateWorksheetXml(i);
        if (validateXml(xml)) {
            downloadXmlFile(xml, `${sanitizeFilename(appState.lessonInfo.lessonTitle)}_worksheet${i}.xml`);
        } else {
            success = false;
            updateExportStatus('worksheet', 'error', `Failed to validate worksheet ${i} XML. Please check the console for details.`);
            break;
        }
    }
    
    if (success) {
        updateExportStatus('worksheet', 'success', 'All worksheets exported successfully!');
    }
}

function exportCompleteLessonPackage() {
    // Create a bundle containing all XMLs
    const slidesXml = generateSlidesXml();
    const worksheetXmls = [];
    
    for (let i = 1; i <= appState.worksheets.count; i++) {
        worksheetXmls.push(generateWorksheetXml(i));
    }
    
    // Validate all XMLs
    if (!validateXml(slidesXml)) {
        updateExportStatus('package', 'error', 'Failed to validate slides XML. Package export aborted.');
        return;
    }
    
    for (let i = 0; i < worksheetXmls.length; i++) {
        if (!validateXml(worksheetXmls[i])) {
            updateExportStatus('package', 'error', `Failed to validate worksheet ${i+1} XML. Package export aborted.`);
            return;
        }
    }
    
    // Create package metadata
    const packageMetadata = {
        title: appState.lessonInfo.lessonTitle,
        subject: appState.lessonInfo.subject,
        topic: appState.lessonInfo.topic,
        provider: appState.lessonInfo.provider,
        level: appState.lessonInfo.level,
        created: new Date().toISOString(),
        slidesCount: 1,
        worksheetsCount: appState.worksheets.count
    };
    
    // Create the package XML
    let packageXml = `<?xml version="1.0" encoding="UTF-8"?>
<lesson_package version="1.0">
    <metadata>
        <title>${escapeXml(packageMetadata.title)}</title>
        <subject>${escapeXml(packageMetadata.subject)}</subject>
        <topic>${escapeXml(packageMetadata.topic)}</topic>
        <provider>${escapeXml(packageMetadata.provider)}</provider>
        <level>${escapeXml(packageMetadata.level)}</level>
        <created>${packageMetadata.created}</created>
        <slides_count>${packageMetadata.slidesCount}</slides_count>
        <worksheets_count>${packageMetadata.worksheetsCount}</worksheets_count>
    </metadata>
    <components>
        <slides filename="${sanitizeFilename(appState.lessonInfo.lessonTitle)}_slides.xml" />`;
    
    for (let i = 1; i <= appState.worksheets.count; i++) {
        packageXml += `
        <worksheet number="${i}" filename="${sanitizeFilename(appState.lessonInfo.lessonTitle)}_worksheet${i}.xml" />`;
    }
    
    packageXml += `
    </components>
    <lesson_state>${escapeXml(JSON.stringify(appState))}</lesson_state>
</lesson_package>`;
    
    // Validate and download package XML
    if (validateXml(packageXml)) {
        downloadXmlFile(packageXml, `${sanitizeFilename(appState.lessonInfo.lessonTitle)}_package.xml`);
        
        // Also download individual component XMLs
        downloadXmlFile(slidesXml, `${sanitizeFilename(appState.lessonInfo.lessonTitle)}_slides.xml`);
        
        for (let i = 0; i < worksheetXmls.length; i++) {
            downloadXmlFile(worksheetXmls[i], `${sanitizeFilename(appState.lessonInfo.lessonTitle)}_worksheet${i+1}.xml`);
        }
        
        updateExportStatus('package', 'success', 'Complete lesson package exported successfully!');
    } else {
        updateExportStatus('package', 'error', 'Failed to validate package XML. Please check the console for details.');
    }
}

// Save & Load Functionality
function saveLessonToLocalStorage() {
    try {
        const serializedState = JSON.stringify(appState);
        localStorage.setItem('gcse_lesson_planner_state', serializedState);
        localStorage.setItem('gcse_lesson_planner_saved_time', new Date().toISOString());
        
        updateSaveStatus('success', 'Lesson saved to browser storage successfully.');
        return true;
    } catch (error) {
        console.error('Failed to save lesson to local storage:', error);
        updateSaveStatus('error', 'Failed to save lesson to browser storage.');
        return false;
    }
}

function loadLessonFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem('gcse_lesson_planner_state');
        if (!serializedState) {
            updateSaveStatus('warning', 'No saved lesson found in browser storage.');
            return false;
        }
        
        const savedTime = localStorage.getItem('gcse_lesson_planner_saved_time');
        const parsedState = JSON.parse(serializedState);
        
        // Update app state
        Object.assign(appState, parsedState);
        
        // Update UI to reflect loaded state
        updateUIFromLoadedState();
        
        updateSaveStatus('success', `Lesson loaded successfully. Last saved: ${formatSavedTime(savedTime)}`);
        return true;
    } catch (error) {
        console.error('Failed to load lesson from local storage:', error);
        updateSaveStatus('error', 'Failed to load lesson from browser storage.');
        return false;
    }
}

function updateUIFromLoadedState() {
    // Update the current step display based on loaded state
    updateStepIndicators();
    
    // Populate form fields with loaded data
    populateFormFields();
    
    // Switch to the appropriate step and substep
    switchSubstep(appState.currentMainStep, appState.currentSubStep);
    
    // Make sure main steps are expanded/collapsed correctly
    appState.mainStepExpanded.forEach((expanded, index) => {
        const stepNumber = index + 1;
        const mainStep = document.getElementById(`mainStep${stepNumber}`);
        const mainStepContent = document.getElementById(`mainStepContent${stepNumber}`);
        
        if (expanded) {
            mainStep.classList.add('expanded');
            mainStepContent.style.height = 'auto';
        } else {
            mainStep.classList.remove('expanded');
            mainStepContent.style.height = '0';
        }
    });
}

function populateFormFields() {
    // Populate Step 1A form fields
    for (const key in appState.lessonInfo) {
        const element = document.getElementById(key);
        if (element) {
            element.value = appState.lessonInfo[key];
        }
    }
    
    // Populate LO checkboxes
    if (appState.learningObjectives.lo1.hasPractical) {
        document.getElementById('lo1HasPractical').checked = true;
    }
    if (appState.learningObjectives.lo2.hasPractical) {
        document.getElementById('lo2HasPractical').checked = true;
    }
    if (appState.learningObjectives.lo3.hasPractical) {
        document.getElementById('lo3HasPractical').checked = true;
    }
    
    // Re-run any initialization functions that would normally run when completing each step
    if (appState.responseTags.learningObjectives) {
        displayLearningObjectives();
    }
    
    if (appState.responseTags.loTypes) {
        displayLOTypes();
    }
    
    if (appState.responseTags.misconceptions) {
        displayMisconceptions();
    }
    
    if (appState.responseTags.priorKnowledge) {
        displayPriorKnowledge();
    }
    
    // Update the export settings form
    updateExportSettingsForm();
}

function updateSaveStatus(type, message) {
    const statusContainer = document.getElementById('saveStatusContainer');
    if (!statusContainer) return;
    
    statusContainer.innerHTML = '';
    
    const statusElement = document.createElement('div');
    statusElement.className = `alert alert-${type}`;
    
    const icon = document.createElement('svg');
    icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    icon.setAttribute('width', '20');
    icon.setAttribute('height', '20');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '2');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');
    
    if (type === 'success') {
        icon.innerHTML = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>';
    } else if (type === 'error') {
        icon.innerHTML = '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>';
    } else {
        icon.innerHTML = '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>';
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    
    statusElement.appendChild(icon);
    statusElement.appendChild(messageDiv);
    statusContainer.appendChild(statusElement);
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            statusElement.style.opacity = '0';
            setTimeout(() => {
                if (statusContainer.contains(statusElement)) {
                    statusContainer.removeChild(statusElement);
                }
            }, 300);
        }, 5000);
    }
}

function updateExportStatus(exportType, type, message) {
    const statusContainerId = `${exportType}ExportStatusContainer`;
    const statusContainer = document.getElementById(statusContainerId);
    if (!statusContainer) return;
    
    statusContainer.innerHTML = '';
    
    const statusElement = document.createElement('div');
    statusElement.className = `alert alert-${type}`;
    
    const icon = document.createElement('svg');
    icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    icon.setAttribute('width', '20');
    icon.setAttribute('height', '20');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '2');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');
    
    if (type === 'success') {
        icon.innerHTML = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>';
    } else if (type === 'error') {
        icon.innerHTML = '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>';
    } else {
        icon.innerHTML = '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>';
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    
    statusElement.appendChild(icon);
    statusElement.appendChild(messageDiv);
    statusContainer.appendChild(statusElement);
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            statusElement.style.opacity = '0';
            setTimeout(() => {
                if (statusContainer.contains(statusElement)) {
                    statusContainer.removeChild(statusElement);
                }
            }, 300);
        }, 5000);
    }
}

function formatSavedTime(isoString) {
    if (!isoString) return 'Unknown';
    
    try {
        const date = new Date(isoString);
        return date.toLocaleString();
    } catch (error) {
        return isoString;
    }
}

// Update Export Settings
function updateExportSettingsForm() {
    // Update slides export settings
    if (document.getElementById('includeSlidesNotes')) {
        document.getElementById('includeSlidesNotes').checked = appState.export.slides.includeNotes;
    }
    
    if (document.getElementById('includeVisualPlaceholders')) {
        document.getElementById('includeVisualPlaceholders').checked = appState.export.slides.includeVisualPlaceholders;
    }
    
    // Update worksheet export settings
    if (document.getElementById('includeWorksheetAnswers')) {
        document.getElementById('includeWorksheetAnswers').checked = appState.export.worksheets.includeAnswers;
    }
    
    if (document.getElementById('includeMarkingGuidelines')) {
        document.getElementById('includeMarkingGuidelines').checked = appState.export.worksheets.includeMarkingGuidelines;
    }
}

function updateExportSettings() {
    // Update slides export settings
    if (document.getElementById('includeSlidesNotes')) {
        appState.export.slides.includeNotes = document.getElementById('includeSlidesNotes').checked;
    }
    
    if (document.getElementById('includeVisualPlaceholders')) {
        appState.export.slides.includeVisualPlaceholders = document.getElementById('includeVisualPlaceholders').checked;
    }
    
    // Update worksheet export settings
    if (document.getElementById('includeWorksheetAnswers')) {
        appState.export.worksheets.includeAnswers = document.getElementById('includeWorksheetAnswers').checked;
    }
    
    if (document.getElementById('includeMarkingGuidelines')) {
        appState.export.worksheets.includeMarkingGuidelines = document.getElementById('includeMarkingGuidelines').checked;
    }
    
    updateExportStatus('settings', 'success', 'Export settings updated successfully.');
}

// Helper Functions
function validateXml(xml) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'application/xml');
        
        // Check for parser errors
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            console.error('XML validation error:', parserError.textContent);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Failed to validate XML:', error);
        return false;
    }
}

function downloadXmlFile(xml, filename) {
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

function sanitizeFilename(filename) {
    if (!filename) return 'lesson';
    
    // Replace invalid characters with underscores
    return filename.replace(/[/\\?%*:|"<>]/g, '_')
                   .replace(/\s+/g, '_')
                   .trim();
}

function escapeXml(unsafe) {
    if (unsafe === undefined || unsafe === null) return '';
    
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function shouldIncludeSection(worksheetNum, sectionType) {
    // Determine if a section should be included based on worksheet allocation
    // Different section types have different rules
    
    if (sectionType === 'reference') {
        // Reference materials should be included on all worksheets
        return true;
    }
    
    if (sectionType === 'retrieval') {
        // Retrieval questions should be included on the first worksheet only
        return worksheetNum === 1;
    }
    
    // For other section types, check if any LOs are allocated to this worksheet
    for (let loNum = 1; loNum <= 3; loNum++) {
        if (loNum === 3 && !appState.learningObjectives.lo3.exists) continue;
        
        const loKey = 'lo' + loNum;
        if (appState.lessonStructure.worksheetAllocation[loKey] == worksheetNum) {
            return true;
        }
    }
    
    return false;
}

// Initialize export listeners
function initializeExportListeners() {
    // Save & Load buttons
    const saveBtn = document.getElementById('saveLessonBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveLessonToLocalStorage);
    }
    
    const loadBtn = document.getElementById('loadLessonBtn');
    if (loadBtn) {
        loadBtn.addEventListener('click', loadLessonFromLocalStorage);
    }
    
    // Slides export buttons
    const exportSlidesBtn = document.getElementById('exportSlidesBtn');
    if (exportSlidesBtn) {
        exportSlidesBtn.addEventListener('click', exportSlidesXml);
    }
    
    // Worksheet export buttons
    const exportWorksheet1Btn = document.getElementById('exportWorksheet1Btn');
    if (exportWorksheet1Btn) {
        exportWorksheet1Btn.addEventListener('click', () => exportWorksheetXml(1));
    }
    
    const exportWorksheet2Btn = document.getElementById('exportWorksheet2Btn');
    if (exportWorksheet2Btn) {
        exportWorksheet2Btn.addEventListener('click', () => exportWorksheetXml(2));
    }
    
    const exportAllWorksheetsBtn = document.getElementById('exportAllWorksheetsBtn');
    if (exportAllWorksheetsBtn) {
        exportAllWorksheetsBtn.addEventListener('click', exportAllWorksheets);
    }
    
    // Complete package export button
    const exportPackageBtn = document.getElementById('exportPackageBtn');
    if (exportPackageBtn) {
        exportPackageBtn.addEventListener('click', exportCompleteLessonPackage);
    }
    
    // Export settings update button
    const updateExportSettingsBtn = document.getElementById('updateExportSettingsBtn');
    if (updateExportSettingsBtn) {
        updateExportSettingsBtn.addEventListener('click', updateExportSettings);
    }
}

// Auto-save functionality
let autoSaveInterval = null;

function startAutoSave(intervalMs = 5 * 60 * 1000) { // Default: 5 minutes
    // Clear any existing interval
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
    
    // Set new interval
    autoSaveInterval = setInterval(() => {
        saveLessonToLocalStorage();
    }, intervalMs);
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
}

// Auto-save can be started when the app initializes
// startAutoSave();

// Initialize export functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeExportListeners();
});