import io
import re
import warnings
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import pdfplumber
from pymongo import MongoClient
from bson import ObjectId
from docx import Document
from pptx import Presentation
from bson.errors import InvalidId
from transformers import BartForConditionalGeneration, BartTokenizer, pipeline
import torch
from currentsapi import CurrentsAPI


# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Suppress warnings
warnings.filterwarnings("ignore")

# Configure device
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load ML models
try:
    # Summarization model
    summary_model_name = "facebook/bart-large-cnn"
    tokenizer = BartTokenizer.from_pretrained(summary_model_name)
    summary_model = BartForConditionalGeneration.from_pretrained(summary_model_name).to(device)
    if device == "cuda":
        summary_model = summary_model.half()  # Use half-precision for GPU
        
    # Classification model
    classifier = pipeline(
        "zero-shot-classification",
        model="facebook/bart-large-mnli",
        device=0 if device == "cuda" else -1,
        batch_size=8
    )
    print("✅ Models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models: {str(e)}")
    exit(1)

# MongoDB configuration
client = MongoClient("mongodb://localhost:27017/")

# Separate databases and collections
news_db = client["news_db"]
news_collection = news_db["news"]

file_db = client["file_storage_db"]
file_collection = file_db["files"]

<<<<<<< HEAD
# File upload configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'ppt', 'pptx', 'doc', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB

# Classification categories
CATEGORIES = [
    "Software Development", "Cybersecurity", "Cloud Computing",
    "Artificial Intelligence", "Machine Learning", "Deep Learning",
    "Business Strategy", "Stock Market", "Cryptocurrency",
    "Physics", "Chemistry", "Biology", "Medicine",
    "Education", "Online Learning", "Mental Health",
    "Journalism", "Social Media", "Marketing",
    "Sports", "E-Sports", "History", "Politics",
    "Renewable Energy", "Climate Change", "Environment",
    "Food & Cuisine", "Travel", "Personal Development"
]
=======
ALLOWED_EXTENSIONS = {'pdf', 'ppt', 'pptx', 'doc', 'docx'}
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size
>>>>>>> 5b1ec20b7e136511b2597898afdee5a58d638cab

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def clean_text(text):
    if not text:
        return ""
<<<<<<< HEAD
=======
    
>>>>>>> 5b1ec20b7e136511b2597898afdee5a58d638cab
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'[^\w\s.,;!?()"\']', '', text)
    return text

<<<<<<< HEAD
def extract_text_from_docx(file_path):
    try:
        doc = Document(file_path)
        return clean_text('\n'.join([para.text for para in doc.paragraphs]))
=======
def extract_text_from_docx(file_bytes):
    try:
        doc = Document(io.BytesIO(file_bytes))
        text = '\n'.join([para.text for para in doc.paragraphs])
        return clean_text(text)
>>>>>>> 5b1ec20b7e136511b2597898afdee5a58d638cab
    except Exception as e:
        return f"Error extracting DOCX: {str(e)}"

<<<<<<< HEAD
def extract_text_from_pptx(file_path):
=======
def extract_text_from_pptx(file_bytes):
>>>>>>> 5b1ec20b7e136511b2597898afdee5a58d638cab
    try:
        prs = Presentation(io.BytesIO(file_bytes))
        text = ''
        for slide in prs.slides:
            for shape in slide.shapes:
                if hasattr(shape, "text"):
                    text += shape.text + '\n'
        return clean_text(text)
    except Exception as e:
        return f"Error extracting PPT/PPTX: {str(e)}"

def generate_summary(text):
    try:
        inputs = tokenizer(text[:2000], return_tensors="pt", truncation=True, padding="longest").to(device)
        summary_ids = summary_model.generate(
            inputs['input_ids'],
            max_length=150,
            min_length=30,
            num_beams=3,
            length_penalty=1.0,
            early_stopping=True
        )
        return tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    except Exception as e:
        print(f"Summarization error: {str(e)}")
        return "Could not generate summary"

def classify_text(text):
    try:
        result = classifier(text[:1500], CATEGORIES, multi_label=True)
        return [
            {"category": label, "confidence": round(score, 2)}
            for label, score in zip(result["labels"][:3], result["scores"][:3])
        ]
    except Exception as e:
        print(f"Classification error: {str(e)}")
        return []

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if not file or file.filename == '':
        return jsonify({"error": "No selected file"}), 400

<<<<<<< HEAD
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    file.save(file_path)

    # Extract text
    if filename.endswith(".pdf"):
        with pdfplumber.open(file_path) as pdf:
            text = clean_text("\n".join(page.extract_text() or '' for page in pdf.pages))
    elif filename.endswith((".docx", ".doc")):
        text = extract_text_from_docx(file_path)
    elif filename.endswith((".ppt", ".pptx")):
        text = extract_text_from_pptx(file_path)
    else:
        text = "Unsupported file format"
=======
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_bytes = file.read()  # Read file into memory

        # Extract text from the file
        summary = ''
        try:
            if filename.endswith('.pdf'):
                with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                    text = ' '.join([page.extract_text() or '' for page in pdf.pages])
                    summary = clean_text(text)[:10000]
            elif filename.endswith('.docx'):
                summary = extract_text_from_docx(file_bytes)[:10000]
            elif filename.endswith(('.ppt', '.pptx')):
                summary = extract_text_from_pptx(file_bytes)[:10000]
        except Exception as e:
            return jsonify({"error": f"Error extracting text: {str(e)}"}), 500

        file_data = {
            'filename': filename,
            'file_type': file.mimetype,
            'file_content': file_bytes,
            'summary': summary,
            'upload_date': datetime.utcnow()
        }
        result = file_collection.insert_one(file_data)
>>>>>>> 5b1ec20b7e136511b2597898afdee5a58d638cab

    # Generate summary and classify text
    summary = generate_summary(text) if text else "No content available"
    categories = classify_text(text) if text else []

    # Store in MongoDB
    file_data = {
        "filename": filename,
        "file_type": file.filename.rsplit('.', 1)[1].lower(),
        "summary": summary,
        "categories": categories
    }
    inserted_id = file_collection.insert_one(file_data).inserted_id

    return jsonify({"message": "File uploaded successfully", "file_id": str(inserted_id)}), 200


@app.route('/files', methods=['GET'])
def get_all_files():
    try:
        files = list(file_collection.find({}, {
            "_id": 1,
            "filename": 1,
            "file_type": 1,
            "summary": 1,
            "categories": 1
        }))
        return jsonify([{
            "id": str(f["_id"]),
            "name": f["filename"],
            "type": f["file_type"],
            "summary": f.get("summary", ""),
            "categories": f.get("categories", [])
        } for f in files]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get-summary/<file_id>', methods=['GET'])
def get_summary(file_id):
    try:
        if not ObjectId.is_valid(file_id):
            return jsonify({"error": "Invalid ID format"}), 400
            
        file_data = file_collection.find_one({"_id": ObjectId(file_id)})
        if not file_data:
            return jsonify({"error": "File not found"}), 404
        return jsonify({"summary": file_data.get('summary', 'No summary available.')})
    except Exception as e:
        return jsonify({"error": str(e), "message": "Failed to retrieve summary"}), 500

@app.route('/download/<file_id>', methods=['GET'])
def download_file(file_id):
    try:
        file_data = file_collection.find_one({"_id": ObjectId(file_id)})
        if not file_data:
            return jsonify({"error": "File not found"}), 404
        
        return file_data['file_content'], 200, {
            'Content-Type': file_data['file_type'],
            'Content-Disposition': f'attachment; filename={file_data["filename"]}'
        }
    except Exception as e:
        return jsonify({"error": str(e), "message": "Failed to download file"}), 500

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
    app.run(debug=True)