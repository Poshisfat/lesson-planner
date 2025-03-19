// Course options based on selected provider
const courseOptions = {
    'AQA': ['Combined Science: Trilogy', 'Combined Science: Synergy', 'Biology', 'Chemistry', 'Physics'],
    'Edexcel': ['Combined Science', 'Biology A', 'Biology B', 'Chemistry A', 'Chemistry B', 'Physics A', 'Physics B'],
    'OCR': ['Combined Science A: Gateway', 'Combined Science B: Twenty First Century', 'Biology A', 'Biology B', 'Chemistry A', 'Chemistry B', 'Physics A', 'Physics B'],
    'WJEC': ['Combined Science', 'Biology', 'Chemistry', 'Physics'],
    'CCEA': ['Single Award Science', 'Double Award Science', 'Biology', 'Chemistry', 'Physics']
};

// Assessment objective types
const aoTypes = {
    'AO1': [
        'Abstract Concept Understanding',
        'Tangible Knowledge Recall',
        'Exam Technique Familiarity',
        'Terminology & Keyword Precision',
        'Fact-Sequence Recall'
    ],
    'AO2': [
        'Data Analysis & Interpretation',
        'Exam Application Techniques',
        'Calculation Application',
        'Scientific Method Application',
        'Scenario-Based Application'
    ],
    'AO3': [
        'Experimental Design & Analysis',
        'Multi-Step Problem Solving',
        'Evaluation & Critical Assessment',
        'Interpretation & Conclusion Formation',
        'Abstract Concept Linking'
    ]
};

// Framework descriptions
const frameworkDescriptions = {
    'CER': 'Claim, Evidence, Reasoning - Students make a claim, provide evidence, and explain their reasoning.',
    'POE': 'Predict, Observe, Explain - Students predict what will happen, observe what does happen, and explain why.',
    'SOLO': 'Structure of Observed Learning Outcomes - Progression from simple to complex understanding.',
    'PEEL': 'Point, Evidence, Explain, Link - Structure for developing well-reasoned arguments.',
    'SEEC': 'State, Explain, Example, Connection - Methodical approach to explaining scientific concepts.'
};

// Frayer model type descriptions
const frayerModelDescriptions = {
    'equation': 'Focuses on mathematical equations, their components, and how they relate to physical phenomena',
    'quantity': 'Explores physical quantities, their units, and measurement techniques',
    'structure': 'Examines biological structures, their components, and functions',
    'substance': 'Investigates chemical substances, their properties, and behaviors',
    'process': 'Analyzes scientific processes, cycles, and their stages',
    'law': 'Explores scientific laws, theories, and their applications',
    'classification': 'Focuses on taxonomies, categories, and classification systems'
};