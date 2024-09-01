from flask import Blueprint, request, jsonify, make_response
from app.models.user import User
from app.models.file import File
from app import db, bcrypt
from sqlalchemy.exc import NoResultFound, IntegrityError

authorization_blueprint = Blueprint('auth', __name__, url_prefix='/auth')

@authorization_blueprint.route('/login', methods=['POST'])
def login():
    data = request.json
    
    if not data or 'email' not in data or 'password' not in data:
        return make_response(jsonify({"error": "Missing email or password"}), 400)
    
    email = data['email']
    password = data['password']
    
    try:
        user = User.query.filter_by(email=email).one()
        if bcrypt.check_password_hash(user.password, password):
            # Passwords match
            return jsonify({
                "id": user.id,
                "email": user.email,
                "sex": user.sex,
                "age": user.age,
                "is_admin": user.is_admin
            }), 200
        else:
            # Passwords don't match
            return make_response(jsonify({"error": "Invalid password"}), 401)
    
    except NoResultFound:
        # Email doesn't exist
        return make_response(jsonify({"error": "Email not found"}), 404)

@authorization_blueprint.route('/register', methods=['POST'])
def register():
    data = request.json
    print(data)
    print('register called!')
    
    if not data or 'email' not in data or 'password' not in data or 'sex' not in data or 'age' not in data:
        return make_response(jsonify({"error": "Missing required fields"}), 400)
    
    email = data['email']
    password = data['password']
    sex = data['sex']
    age = data['age']
    is_admin = data.get('is_admin', False)  # Default to False if not provided
    
    try:
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(email=email, password=hashed_password, sex=sex, age=age, is_admin=is_admin)
        db.session.add(new_user)
        # id is only assigned after commit(). before, it is None
        db.session.commit()
        # print(new_user.id)
        
        return jsonify({
            "id": new_user.id,
            "email": new_user.email,
            "sex": new_user.sex,
            "age": new_user.age,
            "is_admin": new_user.is_admin
        }), 201
    
    except IntegrityError:
        db.session.rollback()
        return make_response(jsonify({"error": "Email already exists"}), 409)
    
    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({"error": "Registration failed", "details": str(e)}), 500)
