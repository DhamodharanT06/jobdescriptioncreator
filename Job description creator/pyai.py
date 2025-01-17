from flask import Flask, render_template, request
from google import genai
from google.genai import types

# Initialize Flask app
app = Flask(__name__)

# Initialize Google GenAI client
client = genai.Client(api_key='AIzaSyAU_veFrtWj2h5S-UScEeQt1i6a7V24U_E')

# Define the route to the home page and handle form submissions
@app.route('/', methods=['GET', 'POST'])
def index():
    job_description = None
    
    if request.method == 'POST':
        # Get form data
        j_t = request.form['job_title']
        deg = request.form['degree']
        com = request.form['company']
        ski = request.form['languages']
        exp_lev = request.form['experience_level']
        loc = request.form['location']
        j_ty = request.form['job_type']
        
        # Create prompt dictionary
        prompt = {
            "job title": j_t,
            "degree": deg,
            "company": com,
            "languages": ski,
            "experience level": exp_lev,
            "location": loc,
            "job type": j_ty
        }
        
        # Generate job description using GenAI
        response = client.models.generate_content(
            model='gemini-1.5-flash', contents=f'Job Description for {prompt} for about company give general 7 points based on other inputs'
        )
        
        # Extract and clean the response
        job_description = response.text.replace("**", "")
        
        # Optionally, save the job description to a file
        file=open("sample_output.txt", "w")
        file.write("-----" * 50)
        file.write("\n")
        file.write(job_description)
        file.write("\n")
        file.write("-----" * 50)
    
    return render_template('index.html', job_description=job_description)

if __name__ == '__main__':
    app.run(debug=True)
