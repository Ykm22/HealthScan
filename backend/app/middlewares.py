from flask import request, jsonify
from flask_jwt_extended import decode_token, verify_jwt_in_request
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from functools import wraps

def jwt_required_for_routes(f):
    pass

# def jwt_required_for_routes(f):
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         # Exclude routes that do not require JWT authentication
#         if request.endpoint in ['auth.login', 'auth.register']:
#             return f(*args, **kwargs)
# 
#         # Check if the JWT token is provided
#         if not request.headers.get('Authorization'):
#             return jsonify({"msg": "Missing Authorization Header"}), 401
# 
#         jwt_header = request.headers.get('Authorization')
#         token = jwt_header.split(' ')[1] if jwt_header and jwt_header.startswith('Bearer ') else None
# 
#         if not token:
#             return jsonify({"msg": "Missing or invalid token"}), 401
# 
#         try:
#             # Decode and verify the token
#             decode_token(token)
#         except Exception as e:
#             return jsonify({"msg": "Token is invalid"}), 401
# 
#         return f(*args, **kwargs)
#     return decorated_function

def jwt_required_except(excluded_blueprints):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            print(request.blueprint)
            if request.blueprint not in excluded_blueprints:
                try:
                    verify_jwt_in_request()
                except ExpiredSignatureError:
                    return jsonify({"message": "Token has expired"}), 401
                except InvalidTokenError:
                    return jsonify({"message": "Invalid token"}), 401
            return fn(*args, **kwargs)
        return wrapper
    return decorator
