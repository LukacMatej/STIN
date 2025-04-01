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
from app.auth.entity.response_entity import create_response_entity
from app.stock.model import stock_model as sm

import secrets


app = Flask(__name__)

CORS(app, supports_credentials=True, origins=["http://localhost:3000","https://stin-2025-app-frontend-11efe8067f8c.herokuapp.com"])

app.secret_key = secrets.token_hex(16)

@app.route('/')
def index():
    logger.debug('User visited home page')
    return 'Hello, Flask!'

@app.route('/evaluateStocks', methods=['POST'])	
def evaluateStocks():
    data = request.json
    if data is None:
        logger.debug('No data provided')
        return create_response_entity(message="No data provided", status_code=400)
    if 'stocks' not in data:
        logger.debug('No stocks provided')
        return create_response_entity(message="No stocks provided", status_code=400)
    logger.debug('User visited evaluateStocks page')
    finnhub_api_key: str = os.environ.get('FINNHUB_API_KEY')
    genai_api_key: str = os.environ.get('GEN_AI_KEY')
    genai_client = gs.genaiClient(genai_api_key)
    client = ss.FinnhubClient(finnhub_api_key)
    parsed_stocks = ss.parseStockSymbols(data['stocks'])
    stocks = client.getStockNews(parsed_stocks)
    ai_response: GenerateContentResponse = genai_client.evaluateText(stocks)
    stocks: list[sm.Stock] = ss.appplyRatingToStocks(stocks, ai_response.text)
    ss.saveStocksToFile(stocks, filename='stocks_info.txt')
    logger.debug('Stocks evaluated')
    answer = ss.prepareAnswer(stocks)
    logger.debug(answer)
    response = {
        "message": "Stocks evaluated",
        "data": answer
    }
    return jsonify(response), 200
    
@app.route('/api/v1/auth/logout', methods=['POST'])
def logout():
    logger.debug('User logged out')
    session.pop('auth', None)
    session.pop('id', None)
    session.pop('username', None)
    return create_response_entity(message="Logged out", status_code=200)

@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    try:
        data: json.JSON = request.json
        logger.debug(data)
        if not data:
            return create_response_entity(message="Please provide user details", data=None, error="Bad request", status_code=400)

        logger.debug(data)
        response = auth_service.validateLogin(
            data["email"],
            data["password"]
        )
        logger.debug(response)
        if not response[0]:
            return create_response_entity(message="Error fetching auth token!, invalid email or password", data=None, error="Unauthorized", status_code=404)
        user: sim.SignInModel = response[1]
        logger.debug(user)
        if user:
            try:
                user_dict = {
                    "email": user.email,
                    "password": user.password,
                    "token": user.token,
                }

                user_dict["token"] = jwt.encode(
                    {"user_id": user_dict["email"]},
                    app.config["SECRET_KEY"],
                    algorithm="HS256"
                )
                return create_response_entity(message="Successfully fetched auth token", data=user_dict, status_code=200)  # Explicit 200

            except Exception as e:
                return create_response_entity(message=str(e), error="Something went wrong", status_code=500)
        return create_response_entity(message="Error fetching auth token!, invalid email or password", data=None, error="Unauthorized", status_code=404)

    except Exception as e:
        return create_response_entity(message="Something went wrong!", error=str(e), data=None, status_code=500)

@app.route("/users/", methods=["GET"])
@token_required
def get_current_user(current_user):
    return create_response_entity(message="Successfully retrieved user profile", data=current_user)

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
        return create_response_entity(message="Passwords do not match", status_code=400)  # Explicit message for the error
    sign_up_model = sum.SignUpModel(email, password, first_name, last_name, second_password)
    try:
        auth_service.saveRegistrationJson(sign_up_model)
        return create_response_entity(message="Registration successful", status_code=200)
    except Exception as e:  # Catch any potential exceptions during registration
        logger.error(f"Registration failed: {e}")
        return create_response_entity(message="Registration failed", error=str(e), status_code=500)


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