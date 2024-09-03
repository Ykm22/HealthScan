from flask import Blueprint, request, jsonify
from app import db, bcrypt
from app.models import User
from flask_jwt_extended import jwt_required, get_jwt_identity

user_settings_blueprint = Blueprint('user', __name__, url_prefix='/users')

@user_settings_blueprint.route('/<string:user_id>', methods=['PUT'])
@jwt_required
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json

    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    if 'sex' in data:
        user.sex = data['sex']
    if 'age' in data:
        user.age = data['age']
    if 'is_admin' in data:
        user.is_admin = data['is_admin']

    db.session.commit()

    return jsonify({
        'message': 'User updated successfully',
        'user': {
            'id': user.id,
            'email': user.email,
            'sex': user.sex,
            'age': user.age,
            'is_admin': user.is_admin
        }
    }), 200

@user_settings_blueprint.route('/<string:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    # Get the identity of the current user
    current_user_id = get_jwt_identity()
    
    # Fetch the user to be deleted
    user_to_delete = User.query.get_or_404(user_id)
    
    # Check if the current user is trying to delete themselves or if they're an admin
    current_user = User.query.get(current_user_id)
    if current_user_id != user_id and not current_user.is_admin:
        return jsonify({'message': 'You do not have permission to delete this user'}), 403
    
    db.session.delete(user_to_delete)
    db.session.commit()
    
    return jsonify({'message': 'User deleted successfully'}), 200
