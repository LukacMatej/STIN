from flask import Flask, redirect, url_for, session, jsonify, request
from flask_cors import CORS
import argparse
from google.genai.types import GenerateContentResponse
from waitress import serve
import os
import jwt
import json

from app.stock.service import stock_service as ss
from app.genai.service import genai_service as gs
from app.auth.sign_up.model import sign_up_model as sum
from app.auth.sign_in.model import sign_in_model as sim
from app.auth.service import auth_service 
from app.logger.logger_conf import logger
from app.auth.token.jwt_token_service import token_required

import secrets

app = Flask(__name__)

CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

app.secret_key = secrets.token_hex(16)

@app.route('/')
def index():
    logger.debug('User visited home page')
    return 'Hello, Flask!'

@app.route('/getStock')
def getStock():
    logger.debug('User visited getStock page')
    finnhub_api_key: str = os.environ.get('FINNHUB_API_KEY')
    genai_api_key: str = os.environ.get('GEN_AI_KEY')
    genai_client = gs.genaiClient(genai_api_key)
    client = ss.FinnhubClient(finnhub_api_key)
    stocks = client.getGeneralNews("general")
    stocks_summary = []
    for stock in stocks:
        stocks_summary.append(stock['summary'])
    response: GenerateContentResponse = genai_client.evaluateText(stocks_summary)
    evaluated_stocks: list[str] = str(response.text).split('\n')
    print(evaluated_stocks)
    print(len(evaluated_stocks))
    return jsonify(evaluated_stocks)
    
@app.route('/api/v1/auth/logout')
def logout():
    logger.debug('User logged out')
    session.pop('auth', None)
    session.pop('id', None)
    session.pop('username', None)
    return "Logged out", 200

@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    try:
        data: json.JSON = request.json
        logger.debug(data)
        if not data:
            return {
                "message": "Please provide user details",
                "data": None,
                "error": "Bad request"
            }, 400
        logger.debug(data)
        is_validated = (data.get('email'), data.get('password'))
        logger.debug(is_validated)
        # if is_validated is not True:
            # return dict(message='Invalid data', data=None, error=is_validated), 400
        response = auth_service.validateLogin(
            data["email"],
            data["password"]
        )
        logger.debug(response)
        if not response[0]:
            return {
                "message": "Error fetching auth token!, invalid email or password",
                "data": None,
                "error": "Unauthorized"
            }, 404
        user: sim.SignInModel = response[1]
        logger.debug(user)
        if user:
            try:
                user["token"] = jwt.encode(
                    {"user_id": user["_id"]},
                    app.config["SECRET_KEY"],
                    algorithm="HS256"
                )
                return {
                    "message": "Successfully fetched auth token",
                    "data": user
                }
            except Exception as e:
                return {
                    "error": "Something went wrong",
                    "message": str(e)
                }, 500
        return {
            "message": "Error fetching auth token!, invalid email or password",
            "data": None,
            "error": "Unauthorized"
        }, 404
    except Exception as e:
        return {
                "message": "Something went wrong!",
                "error": str(e),
                "data": None
        }, 500

@app.route("/users/", methods=["GET"])
@token_required
def get_current_user(current_user):
    return jsonify({
        "message": "successfully retrieved user profile",
        "data": current_user
    })

@app.route('/api/v1/auth/registration', methods=['POST'])
def register():
    logger.debug('User visited registration page')
    email: str = request.json.get('email')
    password: str = request.json.get('password')
    first_name: str = request.json.get('firstName')
    last_name: str = request.json.get('lastName')
    second_password: str = request.json.get('secondPassword')
    if password != second_password:
        logger.debug('Passwords do not match')
        return 'Passwords do not match', 400
    sign_up_model = sum.SignUpModel(email, password, first_name, last_name, second_password)
    auth_service.saveRegistrationJson(sign_up_model)
    return 'Registration successful', 200

def parser_init() -> argparse.ArgumentParser:
    """
    Initialize the argument parser for the server.

    Returns:
        argparse.ArgumentParser: The argument parser object.
    """
    argparser = argparse.ArgumentParser(description="Turn on/off production.")
    argparser.add_argument(
        "-d", "--development", help="Turn on development server", action="store_true"
    )
    argparser.add_argument(
        "-debug", "--debug", help="Turn on debug mode", action="store_true"
    )
    return argparser

if __name__ == "__main__":
    parser: argparse.ArgumentParser = parser_init()
    args: argparse.Namespace = parser.parse_args()
    docker_ip: str = os.environ.get("LISTEN_ADDRESS")
    docker_port: str = os.environ.get("HTTP_PORT")
    if not args.development:
        # production
        serve(app, host=docker_ip, port=docker_port)
    else:
        # development
        app.run(debug=True, host=docker_ip, port=docker_port)
