import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import pdfplumber
from currentsapi import CurrentsAPI
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
from docx import Document
from pptx import Presentation

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient("mongodb://localhost:27017/")

# Separate databases and collections
news_db = client["news_db"]
news_collection = news_db["news"]

file_db = client["file_storage_db"]
file_collection = file_db["files"]

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'ppt', 'pptx', 'doc', 'docx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

# Function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to extract text from DOCX file
def extract_text_from_docx(file_path):
    try:
        doc = Document(file_path)
        text = '\n'.join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        return str(e)

# Function to extract text from PPT/PPTX files
def extract_text_from_pptx(file_path):
    try:
        prs = Presentation(file_path)
        text = ''
        for slide in prs.slides:
            for shape in slide.shapes:
                if hasattr(shape, "text"):
                    text += shape.text + '\n'
        return text
    except Exception as e:
        return str(e)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Ensure the upload folder exists
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])
        
        file.save(file_path)

        # Extract text from the file based on type (PDF, DOCX, PPT, etc.)
        summary = ''
        try:
            if filename.endswith('.pdf'):
                with pdfplumber.open(file_path) as pdf:
                    text = ' '.join([page.extract_text() or '' for page in pdf.pages])
                    summary = text[:10000]  # Summary of the first 10000 characters
            elif filename.endswith('.docx'):
                text = extract_text_from_docx(file_path)
                summary = text[:10000]  # Summary of the first 10000 characters
            elif filename.endswith(('.ppt', '.pptx')):
                text = extract_text_from_pptx(file_path)
                summary = text[:10000]  # Summary of the first 10000 characters
        except Exception as e:
            return jsonify({"error": f"Error extracting text: {str(e)}"}), 500
        finally:
            # Ensure the file is closed after processing
            if 'pdf' in locals():
                pdf.close()

        # Store file details and summary in MongoDB
        file_data = {
            'filename': filename,
            'file_path': file_path,
            'file_type': file.mimetype,
            'summary': summary
        }
        result = file_collection.insert_one(file_data)

        return jsonify({
            "message": "File uploaded successfully",
            "file_id": str(result.inserted_id),
            "summary": summary
        }), 200

    return jsonify({"error": "Invalid file type. Only PDF, PPT, PPTX, DOC, or DOCX allowed."}), 400

# Route to fetch summary for a file
@app.route('/get-summary/<file_id>', methods=['GET'])
def get_summary(file_id):
    try:
        # Replace this with your actual summary generation logic
        summaries = {
            '1': 'This is a sample summary for document 1.',
            '2': 'Here is a summary for document 2.',
            # Add more mappings as needed
        }
        
        summary = summaries.get(file_id, 'No summary found for this document.')
        
        return jsonify({
            'summary': summary,
            'file_id': file_id
        }), 200
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Failed to retrieve summary'
        }), 500


# Initialize CurrentsAPI client with environment variable for API key
currents_api_key = "_NSfqmF4m1zJsae21ns7FØRPOB1aHvhNQVSj5N7c2dnHG7Tx"
if not currents_api_key:
    raise ValueError("CURRENTS_API_KEY environment variable is not set. Please set it before running the application.")
api = CurrentsAPI(api_key=currents_api_key)

@app.route("/fetch-news", methods=["GET"])
def fetch_news():
    try:
        news_data = api.latest_news()
        articles = news_data.get("news", [])

        for article in articles:
            article["stored_at"] = datetime.utcnow()
            news_collection.update_one({"url": article["url"]}, {"$set": article}, upsert=True)

        return jsonify({"message": "News articles fetched and stored successfully!"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch news. Error: {str(e)}"}), 500

@app.route("/get-news", methods=["GET"])
def get_news():
    news_articles = list(news_collection.find({}, {"_id": 0}))  # Exclude MongoDB ID
    return jsonify(news_articles), 200

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)