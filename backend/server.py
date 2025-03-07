from flask import Flask, redirect, url_for, session, jsonify, request
from flask_cors import CORS
import argparse
from google.genai.types import GenerateContentResponse
from waitress import serve
import os

from app.stock.service import stock_service as ss
from app.genai.service import genai_service as gs
from app.auth.sign_up.model import sign_up_model as sum
from app.auth.sign_in.model import sign_in_model as sim
from app.auth.service import auth_service
from app.logger.logger_conf import logger
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
    return redirect(url_for('login'))

@app.route('/api/v1/auth/login', methods=['GET','POST'])
def login():
    if request.method == 'GET':
        logger.debug('User visited login page (GET)')
        return 'Login page'
    if request.method == 'POST':
        logger.debug('User visited login page (POST)')
        email: str = request.json.get('email')
        password: str = request.json.get('password')
        validated: bool
        model: sim.SignInModel
        validated, model = auth_service.validateLogin(email, password)
        if validated:
            logger.debug('User logged in')
            session['auth'] = True
            session['id'] = model['id']
            session['username'] = model['username']
            redirect(url_for(''))
            return 'Login successful',200
        else:
            logger.debug('Invalid credentials')
            return 'Invalid credentials', 401

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
    redirect(url_for('login'))
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
