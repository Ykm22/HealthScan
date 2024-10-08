from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flasgger import Swagger
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from app.middlewares import jwt_required_for_routes

db = SQLAlchemy()
swagger = Swagger()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__, template_folder="../templates/")
    app.config.from_object(Config)

    db.init_app(app)
    swagger.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    from app.routes.main import  main_blueprint
    from app.routes.authentication import authorization_blueprint
    from app.routes.file_management import file_management_blueprint
    from app.routes.password_reset import password_reset_blueprint
    from app.routes.user_settings import user_settings_blueprint

    app.register_blueprint(main_blueprint)
    app.register_blueprint(authorization_blueprint)
    app.register_blueprint(file_management_blueprint)
    app.register_blueprint(password_reset_blueprint)
    app.register_blueprint(user_settings_blueprint)

    @app.before_request
    @jwt_required_for_routes
    def before_request():
        # This will run before each request
        pass

    return app
