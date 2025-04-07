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

def appplyRatingToStocks(stocks: list[sm.Stock], response: dict[str,int]) -> list[sm.Stock]:
    try:
        print(response)
        for stock in stocks:
            if stock.symbol in response.keys():
                stock.setRating(response[stock.symbol])
            else:
                raise ValueError(f"Stock symbol {stock.symbol} not found in response")
    except json.JSONDecodeError as e:
        raise ValueError("Invalid JSON response from AI") from e
    except Exception as e:
        raise ValueError("An error occurred while applying ratings to stocks") from e
    return stocks

def saveStocksToFile(stocks: list[sm.Stock], filename: str = 'stocks_info.txt') -> None:
    with open(filename, 'a') as file:
        for stock in stocks:
            file.write(f"{stock.symbol, stock.name, stock.news, stock.price, stock.rating}\n")
    file.close()
    
def prepareAnswer(stocks: list[sm.Stock]) -> str:
    response = {
        "stocks": [
            {
                "symbol": stock.symbol,
                "rating": str(stock.rating) if stock.rating is not None else "N/A"
            }
            for stock in stocks
        ]
    }
    return json.dumps(response, indent=4)
