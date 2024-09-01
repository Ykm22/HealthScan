from flask import Blueprint, request, jsonify, make_response, current_app, url_for, render_template
from sqlalchemy.exc import NoResultFound
from app import db
from app.models.user import User
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app import bcrypt

password_reset_blueprint = Blueprint('password_reset', __name__, url_prefix='/password')

def get_reset_token(email):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(email, salt='password-reset-salt')

def verify_reset_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = serializer.loads(token, salt='password-reset-salt', max_age=expiration)
    except (SignatureExpired, BadSignature):
        return None
    return email

def send_reset_email(email, reset_url):
    msg = MIMEMultipart()
    msg['From'] = current_app.config['MAIL_DEFAULT_SENDER']
    msg['To'] = email
    msg['Subject'] = "Password Reset Request"

    body = f"To reset your password, visit the following link: {reset_url}"
    msg.attach(MIMEText(body, 'plain'))

    with smtplib.SMTP(current_app.config['MAIL_SERVER'], current_app.config['MAIL_PORT']) as server:
        server.starttls()
        server.login(current_app.config['MAIL_USERNAME'], current_app.config['MAIL_PASSWORD'])
        server.send_message(msg)

@password_reset_blueprint.route('/forgot', methods=['POST'])
def forgot_password():
    if not request.is_json:
        return make_response(jsonify({"error": "Request must be JSON"}), 400)
    
    data = request.get_json()
    
    if 'email' not in data:
        return make_response(jsonify({"error": "Missing email"}), 400)
    
    email = data['email']
    
    try:
        user = User.query.filter_by(email=email).one()
        token = get_reset_token(email)
        reset_url = url_for('password_reset.reset_password', token=token, _external=True)
        send_reset_email(email, reset_url)
        return jsonify({"message": "Password reset email sent"}), 200
    except NoResultFound:
        return make_response(jsonify({"error": "User not found"}), 404)
    except Exception as e:
        return make_response(jsonify({"error": "Failed to send reset email", "details": str(e)}), 500)

@password_reset_blueprint.route('/reset/<token>', methods=['GET', 'POST'])
def reset_password(token):
    email = verify_reset_token(token)
    if not email:
        return make_response(jsonify({"error": "Invalid or expired token"}), 400)

    if request.method == 'GET':
        # Render a form for the user to enter a new password
        return render_template('reset_password.html', token=token)

    elif request.method == 'POST':
        if not request.is_json:
            return make_response(jsonify({"error": "Request must be JSON"}), 400)
        
        data = request.get_json()
        
        if 'new_password' not in data:
            return make_response(jsonify({"error": "Missing new password"}), 400)
        
        try:
            user = User.query.filter_by(email=email).one()
            password = data['new_password']
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            user.password = hashed_password
            db.session.commit()
            return jsonify({"message": "Password has been reset successfully"}), 200
        except NoResultFound:
            return make_response(jsonify({"error": "User not found"}), 404)
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": "Failed to reset password", "details": str(e)}), 500)
