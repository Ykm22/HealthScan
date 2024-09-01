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
