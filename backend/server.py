from flask import Flask, redirect, url_for, session, jsonify, request
import argparse
from google.genai.types import GenerateContentResponse
from waitress import serve
import os

from app.stock.service import stock_service as ss
from app.genai.service import genai_service as gs
from app.auth.sign_up.model import sign_up_model as sum
from app.auth.sign_in.model import sign_in_model as sim
from app.auth.service import auth_service

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello, Flask!'

@app.route('/getStock')
def getStock():
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
    
@app.route('/v1/auth/logout')
def logout():
    session.pop('auth', None)
    session.pop('id', None)
    session.pop('username', None)
    return redirect(url_for('login'))    

@app.route('/v1/auth/login', methods=['POST'])
def login():
    email: str = request.json.get('email')
    password: str = request.json.get('password')
    sign_in_model = sim.SignInModel(email, password)
    validated: bool = auth_service.validateLogin(sign_in_model)
    if validated:
        session['auth'] = True
        session['id'] = sign_in_model['id']
        session['username'] = sign_in_model['username']
        redirect(url_for(''))
        return 200, 'Login successful'
    else:
        return 401, 'Invalid credentials'
@app.route('/v1/auth/register', methods=['POST'])
def register():
    email: str = request.json.get('email')
    password: str = request.json.get('password')
    first_name: str = request.json.get('first_name')
    last_name: str = request.json.get('last_name')
    second_password: str = request.json.get('second_password')
    sign_up_model = sum.SignUpModel(email, password, first_name, last_name, second_password)
    auth_service.saveRegistrationJson(sign_up_model)
    redirect(url_for('login'))
    return 200, 'Registration successful'

def argParse() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='A simple Flask application.')
    parser.add_argument('--debug', action='store_true', help='Run the application in debug mode.')
    args: argparse.Namespace = parser.parse_args()
    return args

if __name__ == "__main__":
    parser: argparse.ArgumentParser = argParse()
    args: argparse.Namespace = parser.parse_args()
    docker_ip: str = os.environ.get("LISTEN_ADDRESS")
    docker_port: str = os.environ.get("HTTP_PORT")
    if not args.development:
        # production
        serve(app, host=docker_ip, port=docker_port)
    else:
        # development
        app.run(debug=True, host=docker_ip, port=docker_port)
