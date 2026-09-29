# AI Content Indicator

A lightweight, heuristic-based web application designed for a college tiny project. It analyzes user-provided text across multiple statistical dimensions and estimates the **AI-likelihood percentage** of the content.

> **Disclaimer:** AI likelihood is an estimate based on text patterns and should not be treated as definitive proof of AI generation.

---

## 1. Project Introduction

With the rapid adoption of Artificial Intelligence text generation tools (such as ChatGPT, Claude, and Gemini), identifying automated text patterns has become an important topic. This project demonstrates a clear, explainable, heuristic method for analyzing text patterns without relying on black-box external APIs or complex heavy neural network models.

---

## 2. Features

- **Real-Time Counters**: Displays live word and character counts as text is typed or pasted.
- **Short Text Notification**: Highlights a warning when text is shorter than 50 words to encourage a statistically meaningful sample size.
- **Sample Text Shortcuts**: One-click buttons to load sample AI-generated text or sample human-written text for quick demonstration.
- **Visual Percentage Gauges**: Interactive circular progress ring and ratio bars showing **AI Likelihood %** vs. **Human-like %**.
- **Dynamic Risk Classification**: Categorizes content into **Low AI likelihood**, **Moderate AI likelihood**, or **High AI likelihood**.
- **Qualitative Analysis Insights**: Bulleted narrative explanations summarizing key structural observations.
- **Detailed Feature Breakdown**: Shows 5 individual breakdown scores (0-100%):
  1. Sentence Consistency
  2. Vocabulary Diversity
  3. Repetition
  4. Formal Language
  5. Predictability
- **Responsive Dark Theme UI**: Built with a sleek `#0f172a` slate dark theme and indigo highlights.

---

## 3. Technologies Used

- **Python 3**: Core backend programming language.
- **Flask**: Lightweight web application framework.
- **Python Standard Libraries**: `re` (regular expressions), `math` (statistical calculations), and `collections` (frequency counting).
- **HTML5**: Semantic markup.
- **CSS3**: Custom vanilla CSS styling (Flexbox, Grid, CSS variables, keyframe animations).
- **JavaScript (ES6)**: Vanilla JS using `fetch()` API for asynchronous communication.

---

## 4. Folder Structure

```
AI_Content_Indicator/
│
├── app.py              # Flask server routes and entry point
├── detector.py         # Heuristic text-analysis engine logic
├── requirements.txt    # Project Python dependencies
├── README.md           # Comprehensive project documentation
│
├── templates/
│   └── index.html      # Main HTML dashboard view
│
└── static/
    ├── style.css       # Custom dark theme styling
    └── script.js       # Asynchronous UI interactivity & DOM logic
```

---

## 5. Installation Steps

Open your terminal or command prompt in the project root directory and follow these steps:

### Step 1: Create a Virtual Environment

```bash
python -m venv venv
```

### Step 2: Activate the Virtual Environment

**Windows (PowerShell / Command Prompt):**

```cmd
venv\Scripts\activate
```

**macOS / Linux:**

```bash
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 6. How to Run the Flask Application

Run the following command to start the local development server:

```bash
python app.py
```

Once started, open your web browser and navigate to:

```
http://127.0.0.1:5000
```

---

## 7. How the AI-Likelihood Calculation Works (Viva Explanation)

During a college viva demonstration, you can explain the algorithm as a **weighted heuristic feature model**:

The `AIContentDetector` in `detector.py` evaluates 5 primary features:

1. **Sentence Consistency (25% Weight)**:
   - *Logic:* AI models construct sentences with low length variance.
   - *Formula:* Computes the Coefficient of Variation ($CV = \frac{\sigma}{\mu}$) of sentence word counts. A low $CV$ yields a high consistency score.

2. **Vocabulary Diversity (20% Weight)**:
   - *Logic:* AI maintains a balanced, controlled vocabulary.
   - *Formula:* Uses Root Type-Token Ratio ($RTTR = \frac{\text{Unique Words}}{\sqrt{\text{Total Words}}}$). Values in the 3.5–5.5 range indicate standard AI vocabulary distribution.

3. **Word & Phrase Repetition (15% Weight)**:
   - *Logic:* Identifies repeating n-grams (bigrams and trigrams).
   - *Formula:* Measures bigram and trigram frequency density relative to word count.

4. **Formal Language & Transitions (25% Weight)**:
   - *Logic:* AI frequently incorporates formal connective transitions such as *"Furthermore"*, *"Moreover"*, *"Additionally"*, *"In conclusion"*, *"Therefore"*, and *"Consequently"*.
   - *Formula:* Scans regex word boundaries for formal marker density per 100 words.

5. **Predictability / Regularity (15% Weight)**:
   - *Logic:* Combines structural rhythm and average word length variance to estimate structural uniformity.

**Composite AI Score Formula:**

$$\text{AI Score} = 0.25(S_c) + 0.20(V_d) + 0.15(R_p) + 0.25(F_l) + 0.15(P_r)$$

The resulting score is clamped between 5% and 99% and categorized into:
- **Low AI likelihood**: $< 35\%$
- **Moderate AI likelihood**: $35\% - 65\%$
- **High AI likelihood**: $> 65\%$

---

## 8. Limitations

1. **Rule-Based Heuristic Approach**: Does not employ deep transformer neural networks (like GPT classifiers), so it relies strictly on statistical patterns.
2. **Short Text Sensitivity**: Texts under 50 words lack sufficient sample size for statistical variation analysis.
3. **Formal Human Writing**: Highly formal human academic papers containing transitions like *"Furthermore"* or *"Therefore"* may score higher AI likelihood.

---

## 9. Future Improvements

- Integrate n-gram perplexity tables from broader language datasets.
- Support file upload for `.txt`, `.pdf`, and `.docx` document analysis.
- Provide highlighted in-line text annotation for formal transition words.
