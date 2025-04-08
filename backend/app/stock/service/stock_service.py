import finnhub
import re
import json
from ..model import stock_model as sm
from ..model import stock_filter_model as sfm
from datetime import datetime, timedelta
from ...logger.logger_conf import logger

class FinnhubClient:
    def __init__(self, api_key: str):
        self.client = finnhub.Client(api_key=api_key)

    def getStockNews(self, stocks: list[sm.Stock]) -> json:
        date_to = datetime.today().strftime('%Y-%m-%d')
        date_from = (datetime.today() - timedelta(days=30)).strftime('%Y-%m-%d')
        for stock in stocks:
            news: json = self.client.company_news(stock.symbol, _from=date_from, to=date_to)
            news_count = len(news)  # Count the number of news items
            stock.setNews(json.dumps(news))
            stock.setNewsCounter(news_count)
            logger.debug(f"Stock {stock.symbol} has {news_count} news items.")
            logger.info(f"Retrieved {news_count} news items for stock {stock.symbol}.")
        return stocks
    
def parseStockSymbols(stocks: json) -> list[str]:
    parsed_stocks: list[sm.Stock] = []
    for stock in stocks:
        if 'symbol' in stock:
            parsed_stocks.append(sm.Stock(stock['symbol'], stock.get('name', ''), stock.get('price', None)))
        else:
            raise ValueError("Invalid stock data: missing 'symbol' key")
    return parsed_stocks

def appplyRatingToStocks(stocks: list[sm.Stock], response: dict[str, int]) -> list[sm.Stock]:
    try:
        print(response)
        for stock in stocks:
            if stock.symbol in response.keys():
                stock.setRating(response[stock.symbol])
            else:
                logger.warning(f"Stock symbol {stock.symbol} not found in response. Setting rating to None.")
                stock.setRating(None)  # Explicitly set rating to None if not found
    except json.JSONDecodeError as e:
        raise ValueError("Invalid JSON response from AI") from e
    except Exception as e:
        raise ValueError("An error occurred while applying ratings to stocks") from e
    return stocks

def saveStocksToFile(stocks: list[sm.Stock], filename: str = 'stocks_info.json') -> None:
    with open(filename, 'w') as file: 
        json.dump([stock.__dict__() for stock in stocks], file, indent=4)

def getStocks(filename: str = 'stocks_info.json') -> list[sm.Stock]:
    stocks: list[sm.Stock] = []
    try:
        with open(filename, 'r') as file:
            stock_data_list = json.load(file)
            for stock_data in stock_data_list:
                stock = sm.Stock(
                    symbol=stock_data['symbol'],
                    name=stock_data.get('name', None),
                    price=stock_data.get('price', None),
                    news=json.dumps(stock_data.get('news', None)),
                    rating=stock_data['rating'],
                    newsCounter=stock_data.get('newsCounter', 0),
                    recommendation=stock_data.get('recommendation', None)
                )
                stocks.append(stock)
    except FileNotFoundError:
        logger.warning(f"File {filename} not found. Returning an empty stock list.")
    for stock in stocks:
        logger.debug(f"Stock loaded: {stock.symbol}, Rating: {stock.rating}")
    return stocks
    
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

def applyRecommendationToStocks(stocks: list[sm.Stock], data: json) -> list[sm.Stock]:
    try:
        recommendations = {item["symbol"]: item["recommendation"] for item in data["stocks"]}
        for stock in stocks:
            if stock.symbol in recommendations:
                stock.setRecommendation(recommendations[stock.symbol])
            else:
                logger.warning(f"Stock symbol {stock.symbol} not found in recommendation data. Setting recommendation to None.")
                stock.setRecommendation(None)
    except KeyError as e:
        raise ValueError("Invalid data format: missing required keys") from e
    except Exception as e:
        raise ValueError("An error occurred while applying recommendations to stocks") from e
    return stocks

def recommendationBuySell(stocks: list[sm.Stock]) -> None:
    try:
        with open('transactions.txt', 'a') as file:
            for stock in stocks:
                date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                if stock.recommendation == "BUY":
                    file.write(f"{date} - {stock.symbol}:BOUGHT\n")
                    logger.info(f"Stock {stock.symbol} marked as BOUGHT on {date}.")
                elif stock.recommendation == "SELL":
                    file.write(f"{date} - {stock.symbol}:SOLD\n")
                    logger.info(f"Stock {stock.symbol} marked as SOLD on {date}.")
                else:
                    file.write(f"{date} - {stock.symbol}:No action\n")
                    logger.info(f"Stock {stock.symbol} has no actionable recommendation on {date}.")
    except Exception as e:
        logger.error("An error occurred while writing transactions to file.", exc_info=True)
        raise
    
def filterStocks(stocks: list[sm.Stock], filterStockModel: sfm.StockFilterModel):
    filtered_stocks = []
    logger.debug(f"Filtering stocks with newsCounter: {filterStockModel.newsCounter}, rating: {filterStockModel.rating}")
    for stock in stocks:
        if filterStockModel.newsCounter and stock.newsCounter < int(filterStockModel.newsCounter.get('value', 0)):
            continue
        if filterStockModel.rating and stock.rating is not None:
            try:
                if float(stock.rating) < float(filterStockModel.rating.get('value', 0)):
                    continue
            except ValueError:
                logger.error(f"Invalid rating value for stock {stock.symbol}: {stock.rating}")
                continue
        filtered_stocks.append(stock)
    return filtered_stocks
    