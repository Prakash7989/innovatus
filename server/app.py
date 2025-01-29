from flask import Flask, jsonify
from currentsapi import CurrentsAPI
from pymongo import MongoClient
from datetime import datetime
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# MongoDB configuration
client = MongoClient("mongodb://localhost:27017/app")
db = client["news_db"]
collection = db["news"]

# Initialize CurrentsAPI client with your API key
api = CurrentsAPI(api_key="_NSfqmF4m1zJsae2Ins7F0RPOBlaHvhNQVSj5N7c2dnHG7Tx")

@app.route("/fetch-news", methods=["GET"])
def fetch_news():
    try:
        # Fetch the latest news
        news_data = api.latest_news()
        
        # Print the fetched data for debugging
        print(news_data)
        
        articles = news_data.get("news", [])
        
        for article in articles:
            article["stored_at"] = datetime.utcnow()
            collection.update_one({"url": article["url"]}, {"$set": article}, upsert=True)
        
        return jsonify({"message": "News articles fetched and stored successfully!"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch news. Error: {str(e)}"}), 500

@app.route("/get-news", methods=["GET"])
def get_news():
    news_articles = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB ID
    return jsonify(news_articles), 200

if __name__ == "__main__":
    app.run(debug=True)
