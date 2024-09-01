from app.models.user import User
from app.models.file import File
from app import db

User.files = db.relationship('File', back_populates='user', lazy='dynamic')
File.user = db.relationship('User', back_populates='files')
