// APPLICATION STATE
window.appState = {
    // Navigation state
    currentMainStep: 1,
    currentSubStep: 'A',
    mainStepExpanded: [true, false, false, false],
    
    // Form data
    lessonInfo: {
        provider: '',
        course: '',
        level: '',
        ability: '',
        subject: '',
        topic: '',
        lessonNumber: '',
        lessonTitle: '',
        description: ''
    },
    
    // Learning Objectives state
    learningObjectives: {
        lo1: {
            title: '',
            description: '',
            hasPractical: false
        },
        lo2: {
            title: '',
            description: '',
            hasPractical: false
        },
        lo3: {
            title: '',
            description: '',
            hasPractical: false,
            exists: false
        },
        count: 0
    },
    
    // Learning Objective Types
    loTypes: {
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
    },
    
    // Misconceptions
    misconceptions: {
        lo1: [],
        lo2: [],
        lo3: []
    },
    
    // Prior Knowledge
    priorKnowledge: {
        lo1: [],
        lo2: [],
        lo3: []
    },
    
    // Step 2: Teaching Approach
    // Teaching Frameworks
    frameworks: {
        lo1: {
            primaryFramework: 'CER',
            bltUsed: false,
            bltLevels: {
                remember: false,
                understand: false,
                apply: false,
                analyze: false,
                evaluate: false,
                create: false
            }
        },
        lo2: {
            primaryFramework: 'POE',
            bltUsed: false,
            bltLevels: {
                remember: false,
                understand: false,
                apply: false,
                analyze: false,
                evaluate: false,
                create: false
            }
        },
        lo3: {
            primaryFramework: 'SEEC',
            bltUsed: false,
            bltLevels: {
                remember: false,
                understand: false,
                apply: false,
                analyze: false,
                evaluate: false,
                create: false
            }
        }
    },
    
    // Exam Techniques
    examTechniques: {
        lo1: {
            BLT: false,
            EVERY: false,
            MEMES: false,
            GRAPH: false,
            notes: ''
        },
        lo2: {
            BLT: false,
            EVERY: false,
            MEMES: false,
            GRAPH: false,
            notes: ''
        },
        lo3: {
            BLT: false,
            EVERY: false,
            MEMES: false,
            GRAPH: false,
            notes: ''
        }
    },
    
    // Lesson Structure
    lessonStructure: {
        retrieval: {
            questions: ['', '', '']
        },
        loSequence: [1, 2, 3], // Order of teaching LOs
        assessmentType: 'comprehensive', // 'comprehensive' or 'focused'
        worksheetAllocation: {
            lo1: 1, // Worksheet number
            lo2: 1,
            lo3: 1
        }
    },
    
    // Practical Requirements
    practicalRequirements: {
        lo1: {
            title: '',
            aim: '',
            variables: [],  // {name: '', type: 'independent/dependent/control'}
            equipment: [],
            steps: [],
            safety: ''
        },
        lo2: {
            title: '',
            aim: '',
            variables: [],
            equipment: [],
            steps: [],
            safety: ''
        },
        lo3: {
            title: '',
            aim: '',
            variables: [],
            equipment: [],
            steps: [],
            safety: ''
        }
    },
    
    // Frayer Models
    frayerModels: {
        lo1: {
            type: '',       // equation, quantity, structure, substance, process, law, classification
            term: '',
            definition: '',
            examples: [],
            nonExamples: [],
            characteristics: ''
        },
        lo2: {
            type: '',
            term: '',
            definition: '',
            examples: [],
            nonExamples: [],
            characteristics: ''
        },
        lo3: {
            type: '',
            term: '',
            definition: '',
            examples: [],
            nonExamples: [],
            characteristics: ''
        }
    },
	
	// Step 3: Slide Generation
    slides: {
        // Retrieval Practice Slides
        retrieval: {
            questions: [],   // {text, type, answer, distractors[], explanation, priorKnowledgeLink}
            layout: 'standard'  // standard, grid, matching
        },
        
        // Teaching Input Slides
        teaching: {
            // Organized by learning objective
            // lo1: { title: '', slides: [{type, title, content, visualElements, notes}] }
        },
        
        // Formative Assessment Slides
        formative: {
            // Organized by learning objective
            // lo1: { title: '', questions: [{text, type, marks, answer, markingGuidelines[], commonErrors[], targetedMisconception}] }
        }
    },
    
    // Edit state
    editState: {
        currentLO: 1,
        tempMisconceptions: [],
        tempPriorKnowledge: [],
        tempVariables: [],
        tempEquipment: [],
        tempSteps: [],
        tempExamples: [],
        tempNonExamples: []
    },
    
    // Responses from Claude
    responses: {
        // Step 1: Lesson Foundations
        overview: '',
        loTypes: '',
        misconceptions: '',
        priorKnowledge: '',
        
        // Step 2: Teaching Approach
        frameworks: '',
        examTechniques: '',
        lessonStructure: '',
        practicalRequirements: '',
        frayerModels: ''
		
		// Step 3: Slide Generation
        retrieval: '',
        teachingInput: '',
        formative: '',
		
		// Step 4: Worksheet Generation
        referenceMaterials: '',
        retrievalWorksheet: '',
        scaleQuestions: '',
        applicationQuestions: '',
        examTechniqueQuestions: '',
        examStyleQuestions: '',
        worksheetFinalization: '',
    },
    
	// Worksheet Generation state
    worksheets: {
        count: 1,
        current: 1,
        
        // Reference Materials
        reference: {
            definitions: [],
            formulas: [],
            diagrams: [],
            examples: []
        },
        
        // Retrieval Worksheet Questions
        retrieval: {
            worksheet1: [],
            worksheet2: []
        },
        
        // SCALE Questions
        scale: {
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
        },
        
        // Application Questions
        application: {
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
        },
        
        // Exam Technique Questions
        examTechnique: {
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
        },
        
        // Exam Style Questions
        examStyle: {
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
        },
        
        // Worksheet Finalization
        finalization: {
            worksheet1: null,
            worksheet2: null
        },
        
        // Worksheet Preview
        preview: {
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
        }
    },
	
	export: {
		slides: {
			includeNotes: true,
			includeVisualPlaceholders: true,
			slideTemplate: 'default'
		},
		worksheets: {
			includeAnswers: true,
			includeMarkingGuidelines: true,
			separateAnswerSheet: true
		},
		autoSave: {
			enabled: true,
			interval: 5 // minutes
		}
	},
	
    // Extracted XML tags from responses
    responseTags: {
        // Step 1: Lesson Foundations
        lessonInfo: '',
        learningObjectives: '',
        loTypes: '',
        misconceptions: '',
        priorKnowledge: '',
        
        // Step 2: Teaching Approach
        frameworks: '',
        examTechniques: '',
        lessonStructure: '',
        practicalRequirements: '',
        frayerModels: ''
		
		// Step 3: Slide Generation
        retrievalQuestions: '',
        teachingSlides: '',
        formativeAssessment: '',
		
		// Step 4: Worksheet Generation
        referenceMaterials: '',
        retrievalWorksheet: '',
        scaleQuestions: '',
        applicationQuestions: '',
        examTechniqueQuestions: '',
        examStyleQuestions: '',
        worksheetFinalization: ''
    }
};