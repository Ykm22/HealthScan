
from flask import Blueprint, request, jsonify, make_response, current_app
from sqlalchemy.exc import NoResultFound
from app import db
from app.models.user import User
from app.models.file import File
import uuid
import os

file_management_blueprint = Blueprint('files', __name__, url_prefix='/files')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def safe_filename(filename):
    return ''.join(c for c in filename if c.isalnum() or c in ('-', '_', '.')) or 'unnamed'

@file_management_blueprint.route('/save', methods=['POST'])
def save_files():
    if 'email' not in request.form:
        return make_response(jsonify({"error": "Missing email"}), 400)
    
    email = request.form['email']
    
    if 'files' not in request.files:
        return make_response(jsonify({"error": "No file part"}), 400)
    
    files = request.files.getlist('files')
    
    if len(files) == 0:
        return make_response(jsonify({"error": "No selected file"}), 400)

    try:
        user = User.query.filter_by(email=email).one()
        storage_path = os.path.join(current_app.config['UPLOAD_FOLDER'], str(user.id))

        if not os.path.exists(storage_path):
            os.makedirs(storage_path)
        
        saved_files = []
        skipped_files = [] 

        for file in files:
            if file and allowed_file(file.filename):
                filename = safe_filename(file.filename)
                file_path = os.path.join(storage_path, filename)

                if os.path.exists(file_path):
                    skipped_files.append(filename)
                    continue

                file.save(file_path)
                
                new_file = File(user_id=user.id, path=file_path)

                db.session.add(new_file)
                db.session.commit()

                saved_files.append({
                    "id": new_file.id,
                    "filename": filename,
                    "path": file_path
                })

        response_data = {
            "message": "File upload process completed",
            "files_saved": saved_files,
        }
        
        if skipped_files:
            response_data["files_skipped"] = skipped_files
        
        return jsonify(response_data), 201
    
    except NoResultFound:
        return make_response(jsonify({"error": "User not found"}), 404)
    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({"error": "Failed to save files", "details": str(e)}), 500)

# returns paths, not proper files
@file_management_blueprint.route('/get/<email>', methods=['GET'])
def get_user_files(email):
    try:
        user = User.query.filter_by(email=email).one()
        files = user.files.all()
        return jsonify([
            {
                "id": file.id,
                "path": file.path
            } for file in files
        ]), 200
    except NoResultFound:
        return make_response(jsonify({"error": "User not found"}), 404)
    except Exception as e:
        return make_response(jsonify({"error": "Failed to retrieve files", "details": str(e)}), 500)
