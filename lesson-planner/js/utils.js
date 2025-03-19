// Copy text to clipboard
function copyToClipboard(textareaId) {
    const textarea = document.getElementById(textareaId);
    textarea.select();
    document.execCommand('copy');
    
    // Show feedback
    const copyBtn = textarea.nextElementSibling;
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyBtn.textContent = originalText;
    }, 1500);
}

// Format XML for display
function formatXML(xml) {
    if (!xml) return '';
    
    return xml
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/&lt;(\/?[a-zA-Z][a-zA-Z0-9]*(?:\s+[a-zA-Z][a-zA-Z0-9]*=".*?")*?)\s*&gt;/g, '<span class="tag-bracket">&lt;</span><span class="tag-name">$1</span><span class="tag-bracket">&gt;</span>')
        .replace(/&lt;!--[\s\S]*?--&gt;/g, '<span style="color: #999">&lt;!--$1--&gt;</span>');
}

// Extract XML tags from response
function extractXML(response, tagName) {
    const regex = new RegExp(`<${tagName}>[\\s\\S]*?<\\/${tagName}>`, 'i');
    const match = response.match(regex);
    return match ? match[0] : null;
}

// Format response based on XML structure
function formatResponse(xml, type) {
    if (!xml) return '<p>No valid response found</p>';
    
    let html = '';
    
    switch (type) {
        case 'overview':
            // Extract lesson info
            const lessonInfoMatch = xml.match(/<LessonInfo>([\s\S]*?)<\/LessonInfo>/);
            if (lessonInfoMatch) {
                html += '<h4>Lesson Information</h4>';
                const infoLines = lessonInfoMatch[1].trim().split('\n');
                html += '<div style="margin-bottom: 1rem;">';
                infoLines.forEach(line => {
                    html += `<p>${line.trim()}</p>`;
                });
                html += '</div>';
            }
            
            // Extract learning objectives
            const learningObjMatch = xml.match(/<LearningObjectives>([\s\S]*?)<\/LearningObjectives>/);
            if (learningObjMatch) {
                html += '<h4>Learning Objectives</h4>';
                
                // Extract individual LO's
                const lo1Match = xml.match(/<LO1>[\s\S]*?<Title>([\s\S]*?)<\/Title>[\s\S]*?<Description>([\s\S]*?)<\/Description>[\s\S]*?<\/LO1>/);
                if (lo1Match) {
                    html += `<p><strong>LO1: ${lo1Match[1].trim()}</strong></p>`;
                    html += `<p>${lo1Match[2].trim()}</p>`;
                }
                
                const lo2Match = xml.match(/<LO2>[\s\S]*?<Title>([\s\S]*?)<\/Title>[\s\S]*?<Description>([\s\S]*?)<\/Description>[\s\S]*?<\/LO2>/);
                if (lo2Match) {
                    html += `<p><strong>LO2: ${lo2Match[1].trim()}</strong></p>`;
                    html += `<p>${lo2Match[2].trim()}</p>`;
                }
                
                const lo3Match = xml.match(/<LO3>[\s\S]*?<Title>([\s\S]*?)<\/Title>[\s\S]*?<Description>([\s\S]*?)<\/Description>[\s\S]*?<\/LO3>/);
                if (lo3Match) {
                    html += `<p><strong>LO3: ${lo3Match[1].trim()}</strong></p>`;
                    html += `<p>${lo3Match[2].trim()}</p>`;
                }
            }
            break;
        
        case 'loTypes':
            // Extract LO types
            const loTypesMatch = xml.match(/<LOTypes>([\s\S]*?)<\/LOTypes>/);
            if (loTypesMatch) {
                html += '<h4>Learning Objective Types</h4>';
                
                // Extract individual LO types
                const lo1TypeMatch = xml.match(/<LO1Type>[\s\S]*?<AOCategory>([\s\S]*?)<\/AOCategory>[\s\S]*?<SpecificType>([\s\S]*?)<\/SpecificType>[\s\S]*?<Justification>([\s\S]*?)<\/Justification>[\s\S]*?<\/LO1Type>/);
                if (lo1TypeMatch) {
                    html += `<p><strong>LO1 Type: ${lo1TypeMatch[1].trim()} - ${lo1TypeMatch[2].trim()}</strong></p>`;
                    html += `<p>Justification: ${lo1TypeMatch[3].trim()}</p>`;
                }
                
                const lo2TypeMatch = xml.match(/<LO2Type>[\s\S]*?<AOCategory>([\s\S]*?)<\/AOCategory>[\s\S]*?<SpecificType>([\s\S]*?)<\/SpecificType>[\s\S]*?<Justification>([\s\S]*?)<\/Justification>[\s\S]*?<\/LO2Type>/);
                if (lo2TypeMatch) {
                    html += `<p><strong>LO2 Type: ${lo2TypeMatch[1].trim()} - ${lo2TypeMatch[2].trim()}</strong></p>`;
                    html += `<p>Justification: ${lo2TypeMatch[3].trim()}</p>`;
                }
                
                const lo3TypeMatch = xml.match(/<LO3Type>[\s\S]*?<AOCategory>([\s\S]*?)<\/AOCategory>[\s\S]*?<SpecificType>([\s\S]*?)<\/SpecificType>[\s\S]*?<Justification>([\s\S]*?)<\/Justification>[\s\S]*?<\/LO3Type>/);
                if (lo3TypeMatch) {
                    html += `<p><strong>LO3 Type: ${lo3TypeMatch[1].trim()} - ${lo3TypeMatch[2].trim()}</strong></p>`;
                    html += `<p>Justification: ${lo3TypeMatch[3].trim()}</p>`;
                }
            }
            break;
        
        case 'misconceptions':
            // Extract misconceptions
            const misconceptionsMatch = xml.match(/<Misconceptions>([\s\S]*?)<\/Misconceptions>/);
            if (misconceptionsMatch) {
                html += '<h4>Potential Misconceptions</h4>';
                
                // Extract LO1 misconceptions
                const lo1MisconceptionsMatch = xml.match(/<LO1Misconceptions>([\s\S]*?)<\/LO1Misconceptions>/);
                if (lo1MisconceptionsMatch) {
                    html += '<p><strong>LO1 Misconceptions:</strong></p><ul>';
                    
                    // Extract individual misconceptions
                    const misconceptions1 = lo1MisconceptionsMatch[1].match(/<Misconception\d+>([\s\S]*?)<\/Misconception\d+>/g);
                    if (misconceptions1) {
                        misconceptions1.forEach(misconception => {
                            const content = misconception.match(/<Misconception\d+>([\s\S]*?)<\/Misconception\d+>/)[1].trim();
                            html += `<li>${content}</li>`;
                        });
                    }
                    
                    html += '</ul>';
                }
                
                // Extract LO2 misconceptions
                const lo2MisconceptionsMatch = xml.match(/<LO2Misconceptions>([\s\S]*?)<\/LO2Misconceptions>/);
                if (lo2MisconceptionsMatch) {
                    html += '<p><strong>LO2 Misconceptions:</strong></p><ul>';
                    
                    // Extract individual misconceptions
                    const misconceptions2 = lo2MisconceptionsMatch[1].match(/<Misconception\d+>([\s\S]*?)<\/Misconception\d+>/g);
                    if (misconceptions2) {
                        misconceptions2.forEach(misconception => {
                            const content = misconception.match(/<Misconception\d+>([\s\S]*?)<\/Misconception\d+>/)[1].trim();
                            html += `<li>${content}</li>`;
                        });
                    }
                    
                    html += '</ul>';
                }
                
                // Extract LO3 misconceptions if present
                const lo3MisconceptionsMatch = xml.match(/<LO3Misconceptions>([\s\S]*?)<\/LO3Misconceptions>/);
                if (lo3MisconceptionsMatch) {
                    html += '<p><strong>LO3 Misconceptions:</strong></p><ul>';
                    
                    // Extract individual misconceptions
                    const misconceptions3 = lo3MisconceptionsMatch[1].match(/<Misconception\d+>([\s\S]*?)<\/Misconception\d+>/g);
                    if (misconceptions3) {
                        misconceptions3.forEach(misconception => {
                            const content = misconception.match(/<Misconception\d+>([\s\S]*?)<\/Misconception\d+>/)[1].trim();
                            html += `<li>${content}</li>`;
                        });
                    }
                    
                    html += '</ul>';
                }
            }
            break;
        
        case 'priorKnowledge':
            // Extract prior knowledge
            const priorKnowledgeMatch = xml.match(/<PriorKnowledge>([\s\S]*?)<\/PriorKnowledge>/);
            if (priorKnowledgeMatch) {
                html += '<h4>Prior Knowledge Requirements</h4>';
                
                // Extract LO1 prior knowledge
                const lo1PriorKnowledgeMatch = xml.match(/<LO1PriorKnowledge>([\s\S]*?)<\/LO1PriorKnowledge>/);
                if (lo1PriorKnowledgeMatch) {
                    html += '<p><strong>LO1 Prior Knowledge:</strong></p><ul>';
                    
                    // Extract individual knowledge items
                    const knowledge1 = lo1PriorKnowledgeMatch[1].match(/<Knowledge\d+>([\s\S]*?)<\/Knowledge\d+>/g);
                    if (knowledge1) {
                        knowledge1.forEach(knowledge => {
                            const content = knowledge.match(/<Knowledge\d+>([\s\S]*?)<\/Knowledge\d+>/)[1].trim();
                            html += `<li>${content}</li>`;
                        });
                    }
                    
                    html += '</ul>';
                }
                
                // Extract LO2 prior knowledge
                const lo2PriorKnowledgeMatch = xml.match(/<LO2PriorKnowledge>([\s\S]*?)<\/LO2PriorKnowledge>/);
                if (lo2PriorKnowledgeMatch) {
                    html += '<p><strong>LO2 Prior Knowledge:</strong></p><ul>';
                    
                    // Extract individual knowledge items
                    const knowledge2 = lo2PriorKnowledgeMatch[1].match(/<Knowledge\d+>([\s\S]*?)<\/Knowledge\d+>/g);
                    if (knowledge2) {
                        knowledge2.forEach(knowledge => {
                            const content = knowledge.match(/<Knowledge\d+>([\s\S]*?)<\/Knowledge\d+>/)[1].trim();
                            html += `<li>${content}</li>`;
                        });
                    }
                    
                    html += '</ul>';
                }
                
                // Extract LO3 prior knowledge if present
                const lo3PriorKnowledgeMatch = xml.match(/<LO3PriorKnowledge>([\s\S]*?)<\/LO3PriorKnowledge>/);
                if (lo3PriorKnowledgeMatch) {
                    html += '<p><strong>LO3 Prior Knowledge:</strong></p><ul>';
                    
                    // Extract individual knowledge items
                    const knowledge3 = lo3PriorKnowledgeMatch[1].match(/<Knowledge\d+>([\s\S]*?)<\/Knowledge\d+>/g);
                    if (knowledge3) {
                        knowledge3.forEach(knowledge => {
                            const content = knowledge.match(/<Knowledge\d+>([\s\S]*?)<\/Knowledge\d+>/)[1].trim();
                            html += `<li>${content}</li>`;
                        });
                    }
                    
                    html += '</ul>';
                }
            }
            break;
            
        default:
            html = '<p>No formatting available for this response type</p>';
    }
    
    return html || '<p>Could not parse the response</p>';
}

// Toggle learn more sections
function toggleLearnMore(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.classList.toggle('expanded');
    }
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}