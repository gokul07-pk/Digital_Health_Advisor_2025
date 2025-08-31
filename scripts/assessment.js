// Assessment functionality
let currentStep = 1;
const totalSteps = 4;
let assessmentData = {
  symptoms: [],
  duration: '',
  severity: 0,
  conditions: [],
  medications: ''
};

// Medical conditions database
const medicalConditions = {
  'covid-19': {
    name: 'COVID-19',
    description: 'A contagious disease caused by the SARS-CoV-2 virus.',
    symptoms: ['fever', 'cough', 'fatigue', 'body-aches', 'sore-throat', 'loss-appetite', 'headache'],
    treatment: 'Isolation, supportive care, antiviral medications for high-risk patients',
    whenToSeekHelp: 'Difficulty breathing, persistent chest pain, confusion, or bluish lips',
    emergencySymptoms: ['shortness-breath', 'chest-pain', 'confusion', 'fainting']
  },
  'common-cold': {
    name: 'Common Cold',
    description: 'A viral infection of the upper respiratory tract that is very common and usually mild.',
    symptoms: ['runny-nose', 'sore-throat', 'cough', 'headache', 'fatigue'],
    treatment: 'Rest, fluids, over-the-counter pain relievers, throat lozenges',
    whenToSeekHelp: 'If symptoms persist beyond 10 days, high fever develops, or breathing difficulties occur',
    emergencySymptoms: []
  },
  'gastroenteritis': {
    name: 'Gastroenteritis (Stomach Flu)',
    description: 'Inflammation of the stomach and intestines, usually caused by viral or bacterial infection.',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal-pain', 'fever', 'fatigue'],
    treatment: 'Rest, clear fluids, gradual return to bland foods, avoid dairy temporarily',
    whenToSeekHelp: 'Signs of dehydration, blood in vomit or stool, severe abdominal pain',
    emergencySymptoms: ['vomiting', 'diarrhea', 'abdominal-pain']
  },
  'migraine': {
    name: 'Migraine',
    description: 'A neurological condition characterized by intense headaches and other symptoms.',
    symptoms: ['headache', 'nausea', 'vision-changes', 'dizziness', 'fatigue'],
    treatment: 'Rest in dark room, pain medications, anti-nausea medications, hydration',
    whenToSeekHelp: 'Sudden severe headache, headache with fever and stiff neck, changes in vision',
    emergencySymptoms: ['confusion', 'vision-changes', 'seizures']
  },
  'hypertension': {
    name: 'High Blood Pressure',
    description: 'A condition where blood pressure in the arteries is persistently elevated.',
    symptoms: ['high-blood-pressure', 'headache', 'dizziness', 'chest-pain', 'shortness-breath'],
    treatment: 'Lifestyle changes, blood pressure medications, regular monitoring',
    whenToSeekHelp: 'Blood pressure over 180/120, severe headache, chest pain, difficulty breathing',
    emergencySymptoms: ['chest-pain', 'shortness-breath', 'confusion', 'vision-changes']
  },
  'anxiety': {
    name: 'Anxiety Disorder',
    description: 'A mental health condition characterized by excessive worry and physical symptoms.',
    symptoms: ['palpitations', 'rapid-heartbeat', 'dizziness', 'fatigue', 'muscle-weakness'],
    treatment: 'Therapy, relaxation techniques, medications if needed, lifestyle changes',
    whenToSeekHelp: 'Panic attacks, inability to function, thoughts of self-harm',
    emergencySymptoms: ['chest-pain', 'fainting', 'confusion']
  },
  'arthritis': {
    name: 'Arthritis',
    description: 'Inflammation of one or more joints causing pain and stiffness.',
    symptoms: ['joint-pain', 'stiffness', 'swelling', 'muscle-weakness', 'fatigue'],
    treatment: 'Anti-inflammatory medications, physical therapy, heat/cold therapy, exercise',
    whenToSeekHelp: 'Severe joint deformity, inability to use joint, signs of infection',
    emergencySymptoms: []
  },
  'allergic-reaction': {
    name: 'Allergic Reaction',
    description: 'An immune system response to a substance that is usually harmless.',
    symptoms: ['rash', 'itching', 'hives', 'swelling', 'runny-nose', 'shortness-breath'],
    treatment: 'Avoid allergen, antihistamines, topical treatments for skin symptoms',
    whenToSeekHelp: 'Difficulty breathing, swelling of face or throat, severe whole-body reaction',
    emergencySymptoms: ['shortness-breath', 'swelling', 'fainting', 'confusion']
  },
  'heart-condition': {
    name: 'Heart Condition',
    description: 'Various conditions affecting the heart muscle, valves, or rhythm.',
    symptoms: ['chest-pain', 'palpitations', 'shortness-breath', 'swelling', 'fainting', 'fatigue'],
    treatment: 'Medications, lifestyle changes, regular monitoring, possible procedures',
    whenToSeekHelp: 'Chest pain, severe shortness of breath, fainting, rapid heart rate',
    emergencySymptoms: ['chest-pain', 'shortness-breath', 'fainting', 'palpitations']
  }
};

document.addEventListener('DOMContentLoaded', function() {
  initializeAssessment();
});

function initializeAssessment() {
  // Initialize symptom checkboxes
  const symptomCheckboxes = document.querySelectorAll('input[name="symptoms"]');
  symptomCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        assessmentData.symptoms.push(this.value);
      } else {
        assessmentData.symptoms = assessmentData.symptoms.filter(s => s !== this.value);
      }
    });
  });

  // Initialize duration radio buttons
  const durationRadios = document.querySelectorAll('input[name="duration"]');
  durationRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      assessmentData.duration = this.value;
    });
  });

  // Initialize severity scale
  const scaleItems = document.querySelectorAll('.scale-item');
  scaleItems.forEach(item => {
    item.addEventListener('click', function() {
      scaleItems.forEach(i => i.classList.remove('selected'));
      this.classList.add('selected');
      assessmentData.severity = parseInt(this.dataset.severity);
    });
  });

  // Initialize condition checkboxes
  const conditionCheckboxes = document.querySelectorAll('input[name="conditions"]');
  conditionCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.value === 'none') {
        if (this.checked) {
          // Uncheck all other conditions
          conditionCheckboxes.forEach(cb => {
            if (cb.value !== 'none') {
              cb.checked = false;
            }
          });
          assessmentData.conditions = ['none'];
        }
      } else {
        // Uncheck "none" if other conditions are selected
        const noneCheckbox = document.querySelector('input[value="none"]');
        if (noneCheckbox) {
          noneCheckbox.checked = false;
        }
        
        if (this.checked) {
          assessmentData.conditions.push(this.value);
        } else {
          assessmentData.conditions = assessmentData.conditions.filter(c => c !== this.value);
        }
        assessmentData.conditions = assessmentData.conditions.filter(c => c !== 'none');
      }
    });
  });

  // Initialize medication textarea
  const medicationInput = document.querySelector('.medication-input');
  if (medicationInput) {
    medicationInput.addEventListener('input', function() {
      assessmentData.medications = this.value;
    });
  }
}

function nextStep() {
  if (validateCurrentStep()) {
    if (currentStep < totalSteps) {
      currentStep++;
      updateStepDisplay();
      
      if (currentStep === totalSteps) {
        generateAssessmentResult();
      }
    }
  }
}

function previousStep() {
  if (currentStep > 1) {
    currentStep--;
    updateStepDisplay();
  }
}

function updateStepDisplay() {
  // Update progress steps
  const steps = document.querySelectorAll('.step');
  steps.forEach((step, index) => {
    const stepNumber = index + 1;
    step.classList.remove('active', 'completed');
    
    if (stepNumber === currentStep) {
      step.classList.add('active');
    } else if (stepNumber < currentStep) {
      step.classList.add('completed');
    }
  });

  // Update step content
  const stepContents = document.querySelectorAll('.step-content');
  stepContents.forEach((content, index) => {
    if (index + 1 === currentStep) {
      content.classList.remove('hidden');
    } else {
      content.classList.add('hidden');
    }
  });
}

function validateCurrentStep() {
  switch (currentStep) {
    case 1:
      if (assessmentData.symptoms.length === 0) {
        showNotification('Please select at least one symptom to continue.', 'warning');
        return false;
      }
      break;
    case 2:
      if (!assessmentData.duration) {
        showNotification('Please select how long you\'ve been experiencing symptoms.', 'warning');
        return false;
      }
      if (assessmentData.severity === 0) {
        showNotification('Please rate the severity of your symptoms.', 'warning');
        return false;
      }
      break;
    case 3:
      // Optional step, no validation required
      break;
  }
  return true;
}

function generateAssessmentResult() {
  const resultContainer = document.getElementById('assessment-result');
  const matches = findConditionMatches();
  
  if (matches.length === 0) {
    resultContainer.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No Specific Matches Found</h3>
        <p>Based on your symptoms, we couldn't identify specific conditions. Consider consulting with a healthcare provider for a proper evaluation.</p>
      </div>
    `;
    return;
  }

  const hasEmergencySymptoms = checkForEmergencySymptoms(matches);
  
  let resultHTML = `
    <div class="results-header">
      <div class="results-icon">⚕️</div>
      <h3 class="results-title">Possible Conditions</h3>
    </div>
    <p class="results-subtitle">Based on your symptoms, here are some possible matches:</p>
  `;

  matches.forEach(match => {
    const condition = medicalConditions[match.conditionId];
    const confidenceClass = getConfidenceClass(match.percentage);
    const confidenceText = getConfidenceText(match.percentage);
    
    resultHTML += `
      <div class="condition-item">
        <div class="condition-header">
          <div class="condition-info">
            <div class="condition-name">
              ${condition.name}
              <span class="confidence-badge ${confidenceClass}">${confidenceText}</span>
            </div>
          </div>
          <div class="match-percentage">
            <div class="match-number">${match.percentage}%</div>
            <div class="match-label">match</div>
          </div>
        </div>
        <p class="condition-description">${condition.description}</p>
        <div class="condition-details">
          <div class="detail-section">
            <h4>Treatment</h4>
            <p>${condition.treatment}</p>
          </div>
          <div class="detail-section">
            <h4>When to Seek Help</h4>
            <p>${condition.whenToSeekHelp}</p>
          </div>
        </div>
        ${match.hasEmergencySymptoms ? `
          <div class="emergency-warning">
            <div class="warning-icon">⚠️</div>
            <div class="warning-content">
              <div class="warning-title">Emergency Symptoms</div>
              <div class="warning-text">Seek immediate emergency care if you experience: ${getEmergencySymptomText(match.emergencySymptoms)}</div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  });

  resultContainer.innerHTML = resultHTML;
}

function findConditionMatches() {
  const matches = [];
  
  Object.keys(medicalConditions).forEach(conditionId => {
    const condition = medicalConditions[conditionId];
    const matchingSymptoms = assessmentData.symptoms.filter(symptom => 
      condition.symptoms.includes(symptom)
    );
    
    if (matchingSymptoms.length > 0) {
      const percentage = Math.round((matchingSymptoms.length / condition.symptoms.length) * 100);
      const emergencySymptoms = assessmentData.symptoms.filter(symptom => 
        condition.emergencySymptoms.includes(symptom)
      );
      
      matches.push({
        conditionId,
        percentage,
        matchingSymptoms,
        hasEmergencySymptoms: emergencySymptoms.length > 0,
        emergencySymptoms
      });
    }
  });

  // Sort by percentage match (highest first)
  return matches.sort((a, b) => b.percentage - a.percentage);
}

function checkForEmergencySymptoms(matches) {
  return matches.some(match => match.hasEmergencySymptoms);
}

function getConfidenceClass(percentage) {
  if (percentage >= 70) return 'confidence-high';
  if (percentage >= 40) return 'confidence-medium';
  return 'confidence-low';
}

function getConfidenceText(percentage) {
  if (percentage >= 70) return 'high confidence';
  if (percentage >= 40) return 'medium confidence';
  return 'low confidence';
}

function getEmergencySymptomText(emergencySymptoms) {
  const symptomNames = {
    'shortness-breath': 'Trouble breathing',
    'chest-pain': 'Persistent chest pain',
    'confusion': 'New confusion',
    'fainting': 'Inability to wake up',
    'vomiting': 'Severe dehydration',
    'diarrhea': 'Blood in vomit',
    'abdominal-pain': 'High fever with abdominal pain',
    'vision-changes': 'Sudden vision loss',
    'seizures': 'Seizures',
    'swelling': 'Severe swelling of face or throat'
  };
  
  return emergencySymptoms.map(symptom => symptomNames[symptom] || symptom).join(', ');
}

// Make functions globally accessible
window.nextStep = nextStep;
window.previousStep = previousStep;