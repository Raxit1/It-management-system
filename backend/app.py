from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def root():
    return {"message": "Server Running"}

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    return jsonify({
        "message": "Login Works",
        "received": data
    })