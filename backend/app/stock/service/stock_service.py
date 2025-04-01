import finnhub
import json
from ..model import stock_model as sm
from datetime import datetime, timedelta

class FinnhubClient:
    def __init__(self, api_key: str):
        self.client = finnhub.Client(api_key=api_key)

    def getStockNews(self, stocks: list[sm.Stock]) -> json:
        date_to = datetime.today().strftime('%Y-%m-%d')
        date_from = (datetime.today() - timedelta(days=30)).strftime('%Y-%m-%d')
        for stock in stocks:
            news: json = self.client.company_news(stock.symbol, _from=date_from, to=date_to)
            stock.setNews(json.dumps(news))
        return stocks
    
def parseStockSymbols(stocks: json) -> list[str]:
    parsed_stocks: list[sm.Stock] = []
    for stock in stocks:
        if 'symbol' in stock:
            parsed_stocks.append(sm.Stock(stock['symbol'], stock.get('name', ''), stock.get('price', None)))
        else:
            raise ValueError("Invalid stock data: missing 'symbol' key")
    return parsed_stocks