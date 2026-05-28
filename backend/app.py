from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/")
def home():
    return {"message": "Backend Running"}

@app.route("/api/login")
def login():
    return {"message": "Login Works"}