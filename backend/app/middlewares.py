from flask import request, jsonify
from flask_jwt_extended import decode_token
from functools import wraps

def jwt_required_for_routes(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Exclude routes that do not require JWT authentication
        if request.endpoint in ['auth.login', 'auth.register']:
            return f(*args, **kwargs)

        # Check if the JWT token is provided
        if not request.headers.get('Authorization'):
            return jsonify({"msg": "Missing Authorization Header"}), 401

        jwt_header = request.headers.get('Authorization')
        token = jwt_header.split(' ')[1] if jwt_header and jwt_header.startswith('Bearer ') else None

        if not token:
            return jsonify({"msg": "Missing or invalid token"}), 401

        try:
            # Decode and verify the token
            decode_token(token)
        except Exception as e:
            return jsonify({"msg": "Token is invalid"}), 401

        return f(*args, **kwargs)
    return decorated_function
