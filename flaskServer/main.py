import os
import math
from app import app
from flask import Flask, request, redirect, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers import Conv2D, MaxPooling2D
from keras.preprocessing import image
import cv2
import numpy as np
import pandas as pd
from tqdm import tqdm
from keras.applications.vgg16 import VGG16
from glob import glob
from scipy import stats as s
from PIL import Image

ALLOWED_EXTENSIONS = {'mp4'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/translator/uploadVideo', methods=['POST'])
@cross_origin()
def upload_file():
    # check if the post request has the file part
    if 'file' not in request.files:
        resp = jsonify({'message': 'No file part in the request'})
        resp.status_code = 400
        return resp
    file = request.files['file']
    if file.filename == '':
        resp = jsonify({'message': 'No file selected for uploading'})
        resp.status_code = 400
        return resp
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        base_model = VGG16(weights='imagenet', include_top=False)

        # defining the model architecture
        model = Sequential()
        model.add(Dense(1115, activation='relu', input_shape=(25088,)))
        model.add(Dropout(0.5))
        model.add(Dense(512, activation='relu'))
        model.add(Dropout(0.5))
        model.add(Dense(256, activation='relu'))
        model.add(Dropout(0.5))
        model.add(Dense(128, activation='relu'))
        model.add(Dropout(0.5))
        model.add(Dense(10, activation='softmax'))

        # loading the trained weights
        model.load_weights("weight.hdf5")

        # compiling the model
        model.compile(loss='categorical_crossentropy', optimizer='Adam', metrics=['accuracy'])

        # creating the tags
        train = pd.read_csv('train_new.csv')
        y = train['class']
        y = pd.get_dummies(y)

        # creating two lists to store predicted and actual tags
        predict = []
        actual = []

        # for loop to extract frames from each test video
        count = 0
        cap = cv2.VideoCapture(app.config['UPLOAD_FOLDER'] + '/' + filename)  # capturing the video from the given path

        framerate = cap.get(5)  # frame rate
        x = 1
        # removing all other files from the temp folder
        files = glob('temp/*')
        for f in files:
            os.remove(f)
        while cap.isOpened():
            frameId = cap.get(1)  # current frame number
            ret, frame = cap.read()
            if not ret:
                break
            if frameId % 3 == 0:
                # storing the frames in a new folder named train_image_frames
                filename = 'temp/' + "_frame%d.jpg" % count;
                count += 1
                cv2.imwrite(filename, frame)
        cap.release()

        # reading all the frames from temp folder
        images = glob("temp/*.jpg")

        prediction_images = []
        for i in range(len(images)):
            img = image.load_img(images[i], target_size=(224, 224, 3))
            img = image.img_to_array(img)
            img = img / 255
            prediction_images.append(img)
        print(filename.split('/')[1].split('_')[0])
        # converting all the frames for a test video into numpy array
        prediction_images = np.array(prediction_images)

        # extracting features using pre-trained model
        prediction_images = base_model.predict(prediction_images)

        # converting features in one dimensional array
        prediction_images = prediction_images.reshape(prediction_images.shape[0], 7 * 7 * 512)

        # predicting tags for each array
        prediction = np.argmax(model.predict(prediction_images), axis=-1)

        # appending the mode of predictions in predict list to assign the tag to the video
        predict.append(y.columns.values[s.mode(prediction)[0][0]])
        print(filename.split('/')[1].split('_')[0])

        # appending the actual tag of the video
        actual.append(filename.split('/')[1].split('_')[0])
        print(predict)

        resp = jsonify({'message': 'File successfully uploaded', 'statusCode': 200, 'data': predict})
        resp.status_code = 200
        return resp
    else:
        resp = jsonify({'message': 'Allowed file type is mp4'})
        resp.status_code = 400
        return resp


if __name__ == "__main__":
    app.run()
