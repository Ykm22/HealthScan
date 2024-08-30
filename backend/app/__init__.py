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
    app.register_blueprint(main_blueprint)

    return app
