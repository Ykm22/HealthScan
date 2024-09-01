from flask import Blueprint, request, jsonify
from app.models.user import User
from app.models.file import File
from app import db, bcrypt
from flask_jwt_extended import jwt_required, get_jwt_identity

main_blueprint = Blueprint('main', __name__)

@main_blueprint.route('/')
def index():
    return jsonify({"message": "Welcome to the API"})

@main_blueprint.route('/add_user', methods=['POST'])
def add_user():
    data = request.json

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(
        email=data['email'],
        password=hashed_password,
        sex=data['sex'],
        age=data['age'],
        is_admin=data.get('is_admin', False)
    ) 

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully", "user_id": new_user.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500 

@main_blueprint.route('/get_user/<email>', methods=['GET'])
def get_user_by_email(email):
    try:
        user = User.query.filter_by(email=email).first()
        if user:
            user_data = {
                "id": user.id,
                "email": user.email,
                "sex": user.sex,
                "age": user.age,
                "is_admin": user.is_admin
            }
            return jsonify(user_data), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@main_blueprint.route('/add_file', methods=['POST'])
def add_file():
    data = request.json
    if not data or 'email' not in data or 'file_path' not in data:
        return jsonify({"error": "Missing email or file_path"}), 400

    try:
        # Find the user by email
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Create a new file
        new_file = File(
            user_id=user.id,
            path=data['file_path']
        )

        # Add and commit the new file
        db.session.add(new_file)
        db.session.commit()

        return jsonify({
            "message": "File added successfully",
            "file_id": new_file.id,
            "user_id": user.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
