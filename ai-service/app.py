from flask import Flask, request, jsonify
from flask_cors import CORS
from recommendations import get_recommendations, analyze_gap
import os

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "ai-service"})

@app.route('/recommend/mentors', methods=['POST'])
def recommend_mentors():
    """
    Endpoint to get mentor recommendations.
    Expected JSON:
    {
        "student": { "skills": ["react", "node"], ... },
        "alumni": [ { "_id": "1", "firstName": "John", "skills": ["python", "react"], ... }, ... ]
    }
    """
    try:
        data = request.get_json()
        student_profile = data.get('student')
        alumni_list = data.get('alumni')

        if not student_profile or not alumni_list:
            return jsonify({"error": "Missing student or alumni data"}), 400

        recommendations = get_recommendations(student_profile, alumni_list)
        
        return jsonify({
            "success": True,
            "count": len(recommendations),
            "data": recommendations
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/analyze/gap', methods=['POST'])
def skill_gap():
    """
    Endpoint to analyze skill gap.
    Expected JSON: { "student_skills": [...], "target_skills": [...] }
    """
    try:
        data = request.get_json()
        student_skills = data.get('student_skills', [])
        target_skills = data.get('target_skills', []) # Could come from a job posting

        missing = analyze_gap(student_skills, target_skills)

        return jsonify({
            "success": True,
            "missing_skills": missing
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
