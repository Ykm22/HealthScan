from app import db
from app.models import User

def insert_users():
    user1 = User(
        email='stefanichim2201@gmail.com',
        password='password',
        sex='M',
        age=30,
        is_admin=False
    )

    user2 = User(
        email='johndoe@example.com',
        password='securepass123',
        sex='F',
        age=25,
        is_admin=True
    )

    try:
        db.session.add(user1)
        db.session.commit()
    except Exception as e:
        print(f"error = {e}")
    
    try:
        db.session.add(user2)
        db.session.commit()
    except Exception as e:
        print(f"error = {e}")

def init_db():
    db.create_all()
    insert_users()
