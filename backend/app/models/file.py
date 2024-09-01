from app import db
import uuid

class File(db.Model):
    __tablename__ = 'file'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    path = db.Column(db.String(255), nullable=False, unique=True)

    # user = db.relationship('User', back_populates='files')
