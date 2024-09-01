
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

@file_management_blueprint.route('/delete', methods=['POST'])
def delete_files():
    if not request.is_json:
        return make_response(jsonify({"error": "Request must be JSON"}), 400)
    
    data = request.get_json()
    
    if 'file_ids' not in data or not isinstance(data['file_ids'], list):
        return make_response(jsonify({"error": "Missing or invalid file_ids"}), 400)
    
    file_ids = data['file_ids']
    
    deleted_files = []
    not_found_files = []
    
    try:
        for file_id in file_ids:
            file = File.query.get(file_id)
            if file:
                # Delete the file from the filesystem
                if os.path.exists(file.path):
                    os.remove(file.path)
                
                # Delete the file record from the database
                db.session.delete(file)
                deleted_files.append(file_id)
            else:
                not_found_files.append(file_id)
        
        db.session.commit()
        
        response_data = {
            "message": "File deletion process completed",
            "files_deleted": deleted_files,
        }
        
        if not_found_files:
            response_data["files_not_found"] = not_found_files
        
        return jsonify(response_data), 200
    
    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({"error": "Failed to delete files", "details": str(e)}), 500)
