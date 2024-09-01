import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///HealthScan.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'secret-key'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'j<:&"G_BE]=4xvhW$7rz^+n-p"`s8%!~'
    UPLOAD_FOLDER = 'users_storage'
    ALLOWED_EXTENSIONS = {'nii', 'pdf', 'txt'}

    MAIL_DEFAULT_SENDER = 'health.scan94@gmail.com'
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'health.scan94@gmail.com'
    MAIL_PASSWORD = 'gvom hvio dqwx fahy'
