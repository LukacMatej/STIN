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
    

def parserInit() -> argparse.Namespace:
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
    parser: argparse.ArgumentParser = parserInit()
    args: argparse.Namespace = parser.parse_args()
    docker_ip: str = os.environ.get("LISTEN_ADDRESS","0.0.0.0")
    docker_port: str = os.environ.get("HTTP_PORT",8000)
    if not args.development:
        # production
        waitress.serve(app, host=docker_ip, port=docker_port)
    else:
        # development
        app.run(debug=True, host=docker_ip, port=docker_port)
