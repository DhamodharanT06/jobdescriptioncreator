from flask import Flask, render_template, request, jsonify
import google.generativeai as genai


app = Flask(__name__)

genai.configure(api_key="AIzaSyAU_veFrtWj2h5S-UScEeQt1i6a7V24U_E")
model = genai.GenerativeModel("gemini-1.5-flash")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/generator")
def generator():
    return render_template("generator.html")

@app.route("/navbar.html")
def navbar():
    return render_template("navbar.html")

@app.route("/footer.html")
def footer():
    return render_template("footer.html")

@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.json
        
        # Add debugging
        print(f"Received data: {data}")
        
        # Validate required fields
        required_fields = ['jobTitle', 'companyName', 'city', 'state', 'jobType', 'experienceLevel', 'salary', 'companyEmail']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    "success": False,
                    "error": f"Missing required field: {field}",
                    "message": f"Please fill in the {field.replace('companyName', 'company name').replace('jobTitle', 'job title').replace('jobType', 'job type').replace('experienceLevel', 'experience level').replace('companyEmail', 'company email')} field."
                })
        
        # Create a more structured prompt for better formatting
        prompt = f"""
        Create a comprehensive, professional job description for the following position. 
        Format the response as a well-structured document with clear sections.

        Job Details:
        - Job Title: {data['jobTitle']}
        - Company: {data['companyName']}
        - Location: {data['city']}, {data['state']}
        - Job Type: {data['jobType']}
        - Experience Level: {data['experienceLevel']}
        - Required Degree: {data['degree']}
        - Key Skills: {data['skillsKnown']}
        - Salary Range: {data['salary']}
        - Company Email: {data['companyEmail']}
        {f"- Additional Requirements: {data['additionalDetails']}" if data.get('additionalDetails') else ""}

        Please create a professional job description with the following structure:

        1. **Job Overview** - A compelling 2-3 sentence summary of the role
        2. **Key Responsibilities** - 5-7 specific responsibilities in bullet points
        3. **Required Qualifications** - Education, experience, and mandatory skills
        4. **Preferred Qualifications** - Nice-to-have skills and experience
        5. **What We Offer** - Benefits and growth opportunities
        6. **How to Apply** - Application instructions

        Make it professional, engaging, and specific to the role. Use proper formatting with bullet points and clear sections.
        """
        
        print(f"Generating content with Gemini API...")
        response = model.generate_content(prompt)
        
        # Parse and structure the response
        job_description = response.text
        print(f"Generated job description: {len(job_description)} characters")        # Create structured response with safe string handling
        structured_response = {
            "success": True,
            "jobDescription": job_description,
            "jobDetails": {
                "title": (data.get('jobTitle') or '').title(),
                "company": (data.get('companyName') or '').title(),
                "location": f"{(data.get('city') or '').title()}, {(data.get('state') or '').title()}",
                "jobType": (data.get('jobType') or '').replace('-', ' ').title(),
                "experienceLevel": get_experience_label(data.get('experienceLevel', '')),
                "salary": (data.get('salary') or '').upper(),
                "email": data.get('companyEmail', '')
            },
            "metadata": {
                "generatedAt": "now",
                "wordCount": len(job_description.split())
            }
        }
        
        return jsonify(structured_response)
        
    except Exception as e:
        print(f"Error in generate endpoint: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Failed to generate job description. Please try again."
        })

def get_experience_label(level):
    """Convert experience level to readable format"""
    labels = {
        'entry': 'Entry Level (0-2 years)',
        'mid': 'Mid Level (3-5 years)', 
        'senior': 'Senior Level (5-8 years)',
        'lead': 'Lead/Principal (8+ years)'
    }
    return labels.get(level, level.title())

if __name__ == "__main__":
    app.run(debug=True)
