import flask
import argparse
from google.genai.types import GenerateContentResponse
import waitress
import sys
import os

from app.stock.service import stock_service as ss
from app.genai.service import genai_service as gs

app = flask.Flask(__name__)

@app.route('/')
def index():
    return 'Hello, Flask!'

@app.route('/getStock')
def getStockNews():
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
    return flask.jsonify(evaluated_stocks)
    

def argParse() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='A simple Flask application.')
    parser.add_argument('--debug', action='store_true', help='Run the application in debug mode.')
    args: argparse.Namespace = parser.parse_args()
    return args

if __name__ == '__main__':
    args: argparse.Namespace = argParse()
    if args.debug:
        app.run(debug=True)
    else:
        waitress.serve(app, port=5000)
