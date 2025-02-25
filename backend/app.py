import flask
import argparse
import waitress
from app.stock.service import stock_service as ss 
from app.stock.model import stock_model as sm

app = flask.Flask(__name__)

@app.route('/')
def index():
    return 'Hello, Flask!'

@app.route('/getStock')
def getStock():
    stock_client = ss.Finnhub()
    stock = stock_client.getCompanyEarning()
    return flask.jsonify(stock)
    

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
