from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flasgger import Swagger
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
swagger = Swagger()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    swagger.init_app(app)
    bcrypt.init_app(app)

    from app.routes.main import  main_blueprint
    from app.routes.authentication import authorization_blueprint
    from app.routes.file_management import file_management_blueprint

    app.register_blueprint(main_blueprint)
    app.register_blueprint(authorization_blueprint)
    app.register_blueprint(file_management_blueprint)

    return app
