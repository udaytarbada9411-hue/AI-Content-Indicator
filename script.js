/**
 * static/script.js - AI Content Indicator Frontend Logic
 * Handles real-time word counting, sample insertion, API interaction,
 * and SVG gauge & progress bar animation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // UI Element References
    const textInput = document.getElementById('text-input');
    const wordCountBadge = document.getElementById('word-count-badge');
    const charCountBadge = document.getElementById('char-count-badge');
    const shortTextWarning = document.getElementById('short-text-warning');
    
    const btnAnalyze = document.getElementById('btn-analyze');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    const btnClear = document.getElementById('btn-clear');
    
    const btnSampleAI = document.getElementById('btn-sample-ai');
    const btnSampleHuman = document.getElementById('btn-sample-human');

    const emptyState = document.getElementById('empty-state');
    const resultsPanel = document.getElementById('results-panel');

    // Score Output Elements
    const aiScorePercentage = document.getElementById('ai-score-percentage');
    const resultStatusBadge = document.getElementById('result-status-badge');
    const aiRatioVal = document.getElementById('ai-ratio-val');
    const humanRatioVal = document.getElementById('human-ratio-val');
    const progressRingFill = document.getElementById('progress-ring-fill');

    // Insights List & Feature Bars
    const analysisInsightsList = document.getElementById('analysis-insights-list');

    const valSentenceConsistency = document.getElementById('val-sentence-consistency');
    const barSentenceConsistency = document.getElementById('bar-sentence-consistency');

    const valVocabDiversity = document.getElementById('val-vocab-diversity');
    const barVocabDiversity = document.getElementById('bar-vocab-diversity');

    const valRepetition = document.getElementById('val-repetition');
    const barRepetition = document.getElementById('bar-repetition');

    const valFormalLanguage = document.getElementById('val-formal-language');
    const barFormalLanguage = document.getElementById('bar-formal-language');

    const valPredictability = document.getElementById('val-predictability');
    const barPredictability = document.getElementById('bar-predictability');

    // SVG Ring Calculations (Radius = 58 -> Circumference = 2 * PI * 58 ≈ 364.42)
    const ringRadius = 58;
    const ringCircumference = 2 * Math.PI * ringRadius;
    progressRingFill.style.strokeDasharray = `${ringCircumference} ${ringCircumference}`;
    progressRingFill.style.strokeDashoffset = ringCircumference;

    // Sample Texts for Demonstration
    const sampleAIText = `Artificial intelligence is rapidly transforming the landscape of modern technology and human productivity. Furthermore, recent advancements in deep learning models have enabled machine system algorithms to synthesize complex data patterns efficiently. Additionally, these computational methodologies foster improved optimization across diverse industry sectors. In conclusion, it is important to note that strategic integration of automated AI frameworks remains essential for future technological progress. Consequently, organizations must adapt continuously to leverage these emerging solutions effectively.`;

    const sampleHumanText = `I was thinking about how much technology has changed since I was a kid. Back then, we didn't even have smartphones! Honestly, it's wild how fast things move now. Yesterday, I tried setting up a smart light bulb in my living room, and it took me almost an hour just to get it connected to my Wi-Fi. My cat kept jumping on the couch, staring at me like I had lost my mind. Anyway, technology is great when it actually works, but man, fixing glitchy apps can be super frustrating.`;

    /**
     * Updates character and word counts in real time.
     */
    function updateCounters() {
        const text = textInput.value;
        const charCount = text.length;
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;

        wordCountBadge.textContent = `${wordCount} words`;
        charCountBadge.textContent = `${charCount} chars`;

        // Toggle short text warning banner
        if (wordCount > 0 && wordCount < 50) {
            shortTextWarning.classList.remove('hidden');
        } else {
            shortTextWarning.classList.add('hidden');
        }
    }

    // Input Event Listener for Live Counters
    textInput.addEventListener('input', updateCounters);

    // Sample Text Loaders
    btnSampleAI.addEventListener('click', () => {
        textInput.value = sampleAIText;
        updateCounters();
    });

    btnSampleHuman.addEventListener('click', () => {
        textInput.value = sampleHumanText;
        updateCounters();
    });

    // Clear Button Listener
    btnClear.addEventListener('click', () => {
        textInput.value = '';
        updateCounters();
        emptyState.classList.remove('hidden');
        resultsPanel.classList.add('hidden');
    });

    /**
     * Sets the SVG progress circle stroke animation.
     */
    function setGaugePercentage(percent, labelText) {
        const offset = ringCircumference - (percent / 100) * ringCircumference;
        progressRingFill.style.strokeDashoffset = offset;

        // Dynamic stroke color depending on score
        if (percent < 35) {
            progressRingFill.style.stroke = '#22c55e'; // Green
        } else if (percent <= 65) {
            progressRingFill.style.stroke = '#f59e0b'; // Amber / Yellow
        } else {
            progressRingFill.style.stroke = '#ef4444'; // Red
        }

        aiScorePercentage.textContent = `${percent}%`;
    }

    /**
     * Sends POST request to /analyze and renders backend response.
     */
    async function analyzeText() {
        const text = textInput.value.trim();

        if (!text) {
            alert('Please enter or paste some text to analyze.');
            return;
        }

        // Loading state UI toggle
        btnAnalyze.disabled = true;
        btnText.textContent = 'Analyzing...';
        btnSpinner.classList.remove('hidden');

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze text.');
            }

            // Display Results Panel
            emptyState.classList.add('hidden');
            resultsPanel.classList.remove('hidden');

            // Set Score Circular Ring & Percentages
            setGaugePercentage(data.ai_percentage, data.label);
            aiRatioVal.textContent = `${data.ai_percentage}%`;
            humanRatioVal.textContent = `${data.human_percentage}%`;

            // Update Result Badge
            resultStatusBadge.textContent = data.label;
            resultStatusBadge.className = 'result-badge';
            
            if (data.ai_percentage < 35) {
                resultStatusBadge.classList.add('badge-low');
            } else if (data.ai_percentage <= 65) {
                resultStatusBadge.classList.add('badge-moderate');
            } else {
                resultStatusBadge.classList.add('badge-high');
            }

            // Populate Analysis Insights Bullets
            analysisInsightsList.innerHTML = '';
            if (data.analysis && data.analysis.length > 0) {
                data.analysis.forEach(insight => {
                    const li = document.createElement('li');
                    li.textContent = insight;
                    analysisInsightsList.appendChild(li);
                });
            }

            // Populate Feature Breakdown Progress Bars
            const features = data.feature_scores;
            
            valSentenceConsistency.textContent = `${features["Sentence Consistency"]}%`;
            barSentenceConsistency.style.width = `${features["Sentence Consistency"]}%`;

            valVocabDiversity.textContent = `${features["Vocabulary Diversity"]}%`;
            barVocabDiversity.style.width = `${features["Vocabulary Diversity"]}%`;

            valRepetition.textContent = `${features["Repetition"]}%`;
            barRepetition.style.width = `${features["Repetition"]}%`;

            valFormalLanguage.textContent = `${features["Formal Language"]}%`;
            barFormalLanguage.style.width = `${features["Formal Language"]}%`;

            valPredictability.textContent = `${features["Predictability"]}%`;
            barPredictability.style.width = `${features["Predictability"]}%`;

        } catch (error) {
            console.error('Analysis error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            // Restore button loading state
            btnAnalyze.disabled = false;
            btnText.textContent = 'Analyze Text';
            btnSpinner.classList.add('hidden');
        }
    }

    // Bind Analyze Button Event
    btnAnalyze.addEventListener('click', analyzeText);
});
