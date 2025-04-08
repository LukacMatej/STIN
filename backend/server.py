from flask import Flask, redirect, url_for, session, jsonify, request, make_response  # Import make_response for creating Flask Response objects
from flask.wrappers import Response
from flask_cors import CORS
import argparse
from waitress import serve
import os
import jwt
import json
from datetime import datetime, timedelta, timezone

from app.stock.service import stock_service as ss
from app.genai.service import genai_service as gs
from app.auth.sign_up.model import sign_up_model as sum
from app.auth.sign_in.model import sign_in_model as sim
from app.auth.service import auth_service
from app.logger.logger_conf import logger
from app.auth.token.jwt_token_service import token_required
from app.auth.entity.response_entity import create_response_entity
from app.stock.model import stock_model as sm
from app.stock.model import stock_filter_model as sfm
from app.auth.user.model import user_model as um

app = Flask(__name__)

CORS(app, supports_credentials=True, origins=["http://localhost:4200","https://stin-2025-app-frontend-11efe8067f8c.herokuapp.com"])

app.secret_key = "my_static_secret_key_12345"

@app.route('/evaluateStocks', methods=['POST'])	
def evaluateStocks() -> tuple[Response, int]:
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
    ai_response: dict[str,int] = genai_client.evaluateText(stocks)
    stocks: list[sm.Stock] = ss.appplyRatingToStocks(stocks, ai_response)
    ss.saveStocksToFile(stocks)
    logger.debug('Stocks evaluated')
    answer = ss.prepareAnswer(stocks)
    logger.debug(answer)
    answer_json = json.loads(answer)
    return create_response_entity(data=answer_json, status_code=200)
    
@app.route('/recommendation', methods=['POST'])
def recommendation() -> tuple[Response, int]:
    data = request.json
    if data is None:
        logger.debug('No data provided')
        return create_response_entity(message="No data provided", status_code=400)
    if 'stocks' not in data:
        logger.debug('No stocks provided')
        return create_response_entity(message="No stocks provided", status_code=400)
    logger.debug('User visited recommendation page')
    stocks: list[sm.Stock] = ss.getStocks()
    stocks = ss.applyRecommendationToStocks(stocks, data)
    ss.saveStocksToFile(stocks)
    ss.recommendationBuySell(stocks)
    return create_response_entity(message="Recommendation applied", status_code=200)
    
@app.route('/api/v1/stocks', methods=['GET'])
def get_stocks() -> tuple[Response, int]:
    logger.debug('User visited stocks page')
    try:
        stocks: list[sm.Stock] = ss.getStocks()
        stocks_serializable = [stock.__dict__() for stock in stocks]
        return create_response_entity(message="Stocks retrieved successfully", data=stocks_serializable, status_code=200)
    except Exception as e:
        logger.error(f"Error retrieving stocks: {e}")
        return create_response_entity(message="Error retrieving stocks", error=str(e), status_code=500)
    
@app.route('/api/v1/stocks/filter', methods=['POST'])
def filter_stocks():
    data = request.json
    logger.debug('User visited filter stocks page')
    if not data:
        logger.debug('No data provided for filtering')
        return create_response_entity(message="No data provided", status_code=400)
    try:
        filterStockModel = sfm.StockFilterModel(**data)
    except Exception as e:
        logger.error(f"Error parsing filter model: {e}")
        return create_response_entity(message="Invalid filter data", error=str(e), status_code=400)
    try:
        stocks: list[sm.Stock] = ss.getStocks()
        stocks = ss.filterStocks(stocks, filterStockModel)
        stocks_serializable = [stock.__dict__() for stock in stocks]
        return create_response_entity(message="Stocks filtered successfully", data=stocks_serializable, status_code=200)
    except Exception as e:
        logger.error(f"Error filtering stocks: {e}")
        return create_response_entity(message="Error filtering stocks", error=str(e), status_code=500)
    
@app.route('/api/v1/auth/logout', methods=['POST'])
def logout():
    logger.debug('User logged out')
    return create_response_entity(message="Logged out successfully", status_code=200)

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
                user_dict["exp"] = datetime.now(tz=timezone.utc) + timedelta(days=1)

                user_dict["token"] = jwt.encode(
                    {"user_id": user_dict["email"]},
                    app.config["SECRET_KEY"],
                    algorithm="HS256"
                )

                response = make_response(create_response_entity(message="Successfully fetched auth token", data={"email": user.email}, status_code=200))
                response.set_cookie('jwt', user_dict["token"], httponly=True, secure=True)
                return response

            except Exception as e:
                return create_response_entity(message=str(e), error="Something went wrong", status_code=500)
        return create_response_entity(message="Error fetching auth token!, invalid email or password", data=None, error="Unauthorized", status_code=404)

    except Exception as e:
        return create_response_entity(message="Something went wrong!", error=str(e), data=None, status_code=500)

@app.route("/users/", methods=["GET"])
@token_required
def get_current_user(current_user):
    return create_response_entity(message="Successfully retrieved user profile", data=current_user)

@app.route('/api/v1/auth/user', methods=['GET'])
def getUserInfo():
    logger.debug('User visited user info page')
    try:
        token = request.cookies.get('jwt')  # Retrieve JWT from cookies
        if not token:
            logger.debug('No JWT token found in cookies')
            return create_response_entity(message="Authentication token is missing", status_code=401)

        try:
            decoded_token = jwt.decode(token, app.secret_key, algorithms=["HS256"])
            user_email = decoded_token.get("user_id")
            if not user_email:
                logger.debug('Invalid token payload')
                return create_response_entity(message="Invalid token", status_code=401)

            current_user: um.UserModel | None = auth_service.getUserByEmail(user_email)
            if not current_user:
                logger.debug('No user found for the given email')
                return create_response_entity(message="User not found", status_code=404)

            user_data = {
                "first_name": current_user.first_name,
                "last_name": current_user.last_name
            }
            logger.debug(f"Retrieved user info: {user_data}")
            return create_response_entity(message="User info retrieved successfully", data=user_data, status_code=200)

        except jwt.ExpiredSignatureError:
            logger.debug('JWT token has expired')
            return create_response_entity(message="Token has expired", status_code=401)
        except jwt.InvalidTokenError:
            logger.debug('Invalid JWT token')
            return create_response_entity(message="Invalid token", status_code=401)

    except Exception as e:
        logger.error(f"Unexpected error retrieving user info: {e}")
        return create_response_entity(message="Something went wrong", error=str(e), status_code=500)

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

@app.route('/api/v1/auth/invoke-refresh-token', methods=['POST'])
def invoke_refresh_token():
    logger.debug('User invoked refresh token endpoint')
    try:
        token = request.cookies.get('jwt')
        if not token:
            logger.debug('No JWT token found in cookies')
            return create_response_entity(message="Authentication token is missing", status_code=401)

        try:
            decoded_token = jwt.decode(token, app.secret_key, algorithms=["HS256"])
            user_email = decoded_token.get("user_id")
            if not user_email:
                logger.debug('Invalid token payload')
                return create_response_entity(message="Invalid token", status_code=401)
            refresh_token['exp'] = datetime.now(tz=timezone.utc) + timedelta(seconds=3600)

            # Generate a new refresh token
            refresh_token = jwt.encode(
                {"user_id": user_email, "type": "refresh"},
                app.config["SECRET_KEY"],
                algorithm="HS256"
            )

            response = make_response(create_response_entity(message="Refresh token generated successfully", data=None, status_code=200))
            response.set_cookie('refresh_token', refresh_token, httponly=True, secure=True)
            return response

        except jwt.ExpiredSignatureError:
            logger.debug('JWT token has expired')
            return create_response_entity(message="Token has expired", status_code=401)
        except jwt.InvalidTokenError:
            logger.debug('Invalid JWT token')
            return create_response_entity(message="Invalid token", status_code=401)

    except Exception as e:
        logger.error(f"Unexpected error generating refresh token: {e}")
        return create_response_entity(message="Something went wrong", error=str(e), status_code=500)

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