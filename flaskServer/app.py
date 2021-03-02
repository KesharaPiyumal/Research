from flask import Flask
from flask_cors import CORS, cross_origin

UPLOAD_FOLDER = 'C:/Users/dimut/Desktop/RS/Uploads'

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
