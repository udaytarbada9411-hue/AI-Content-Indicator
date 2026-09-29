"""
app.py - Flask Server for AI Content Indicator
===============================================

Main web application entry point. Serves the web interface and exposes
the REST API endpoint for text analysis.
"""

from flask import Flask, render_template, request, jsonify
from detector import AIContentDetector

app = Flask(__name__)

# Initialize the heuristic AI content detector engine
detector = AIContentDetector()

@app.route('/', methods=['GET'])
def index():
    """Renders the main dashboard user interface."""
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    POST /analyze endpoint
    Receives JSON payload: { "text": "sample text..." }
    Returns JSON response containing analysis scores, explanations, and metrics.
    """
    try:
        data = request.get_json(silent=True)
        
        # Handle invalid JSON or missing payload
        if data is None:
            return jsonify({
                "error": "Invalid request payload. Please provide valid JSON with a 'text' field."
            }), 400

        text = data.get("text", "").strip()

        # Handle empty text input
        if not text:
            return jsonify({
                "error": "Text input cannot be empty. Please enter or paste some text to analyze."
            }), 400

        # Perform analysis using detector logic from detector.py
        result = detector.analyze(text)
        return jsonify(result), 200

    except Exception as e:
        # Catch unexpected server-side errors cleanly
        return jsonify({
            "error": f"An unexpected error occurred during text analysis: {str(e)}"
        }), 500

if __name__ == '__main__':
    print("Starting AI Content Indicator Flask Server...")
    print("Open http://127.0.0.1:5000 in your web browser.")
    app.run(debug=True, host='0.0.0.0', port=5000)
