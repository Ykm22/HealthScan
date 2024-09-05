from flask import Blueprint, make_response, request, jsonify
from flask_jwt_extended import get_jwt_identity
from app import AD_model
from config import Config
import os
from models.input_processing import input_process, read_image
import torch

def find_file_paths(user_id, input_files_ids):
    file_paths = []
    users_storage = Config.UPLOAD_FOLDER

    for input_file_id in input_files_ids:
        file_path = f'{os.getcwd()}/{users_storage}/{user_id}/{input_file_id}.nii'
        file_paths.append(os.path.abspath(file_path))

    return file_paths

input_shapes = {
    (256, 256, 166) : 128,
}

predict_labels = {
    0: "Cognitively Normal",
    1: "Alzheimer's Disease",
}

def inference_AD(file, age, sex):
    img = read_image(file)
    if img.shape not in input_shapes:
        return "Incorrect file dimensions, try another"

    x, y = input_process(img, age, sex, AD_model.device)

    output = AD_model(x, y)

    return predict_labels[torch.argmax(output).item()]

predictions_blueprint = Blueprint('predictions', __name__)

@predictions_blueprint.route('/predict_ad', methods=['POST'])
def predict_ad():
    data = request.json

    user_id = get_jwt_identity()
    user_id = '1da806db-d148-42a2-bfe8-af9d1957a9c0'
    input_files_ids = data.get('input_files_ids', [])
    age = data.get('age')
    sex = data.get('sex')
    sex = 0 if sex == "M" else 1

    files = find_file_paths(user_id, input_files_ids)

    predictions = []
    for file in files:
        predictions.append(inference_AD(file, age, sex))

    return jsonify(predictions), 200
