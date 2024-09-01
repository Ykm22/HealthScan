from app import create_app
from app.database import init_db
import os

app = create_app()

if __name__ == '__main__':
    with app.app_context():
       init_db()
    print(f"Flask app is starting as user: {os.getuid()}")
    import pwd
    print(f"Current user: {pwd.getpwuid(os.getuid()).pw_name}")
    app.run(debug=True)
