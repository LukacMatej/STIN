import finnhub
import json
from ..model import stock_model as sm

class FinnhubClient:
    def __init__(self, api_key: str):
        self.client = finnhub.Client(api_key=api_key)

    def getGeneralNews(self, stocks: list[sm.Stock]) -> json:
        for stock in stocks:
            if stock.price is None:
                stock.setPrice(self.client.quote(symbol.symbol)['c'])
        symbols = [stock.symbol for stock in stocks]
        for symbol in symbols:
            stock.setNews(self.client.general_news(symbol, _category='general'))
        return stocks
    
def parseStockSymbols(stocks: json) -> list[str]:
    stocks: list[sm.Stock] = []
    for stock in stocks:
        if 'symbol' in stock:
            stocks.append(sm.Stock(stock['symbol'], stock.get('name', ''), stock.get('price', None)))
        else:
            raise ValueError("Invalid stock data: missing 'symbol' key")
    return stocks