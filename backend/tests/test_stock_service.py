import pytest
import os
import sys
import json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.stock.service.stock_service import (
    getStocks,
    filterStocks,
    saveStocksToFile,
    applyRecommendationToStocks,
    recommendationBuySell
)
from app.stock.model.stock_model import Stock

@pytest.fixture
def mock_stocks():
    """Fixture to provide mock stock data."""
    return [
        Stock(symbol="AAPL", name="Apple", price=150.0, rating=5, newsCounter=15),
        Stock(symbol="GOOGL", name="Google", price=2800.0, rating=3, newsCounter=10)
    ]

def test_getStocks(mocker, mock_stocks):
    """Test the getStocks function."""
    mocker.patch("app.stock.service.stock_service.open", mocker.mock_open(read_data=json.dumps([
        {
            "symbol": "AAPL",
            "name": "Apple",
            "price": 150.0,
            "news": ["Apple news 1", "Apple news 2"],
            "rating": 5,
            "newsCounter": 15,
            "recommendation": "BUY"
        },
        {
            "symbol": "GOOGL",
            "name": "Google",
            "price": 2800.0,
            "news": ["Google news 1"],
            "rating": 3,
            "newsCounter": 10,
            "recommendation": "HOLD"
        }
    ])))
    stocks = getStocks()
    assert len(stocks) == 2
    assert stocks[0].symbol == "AAPL"
    assert stocks[1].symbol == "GOOGL"

def test_getStocks_from_file(mocker):
    """Test the getStocks function when reading from a file."""
    mock_file_data = [
        {
            "symbol": "AAPL",
            "name": "Apple",
            "price": 150.0,
            "news": ["Apple news 1", "Apple news 2"],
            "rating": 5,
            "newsCounter": 15,
            "recommendation": "BUY"
        },
        {
            "symbol": "GOOGL",
            "name": "Google",
            "price": 2800.0,
            "news": ["Google news 1"],
            "rating": 3,
            "newsCounter": 10,
            "recommendation": "HOLD"
        }
    ]
    mock_open = mocker.patch("builtins.open", mocker.mock_open(read_data=json.dumps(mock_file_data)))
    mocker.patch("json.load", return_value=mock_file_data)

    stocks = getStocks("mock_stocks.json")
    mock_open.assert_called_once_with("mock_stocks.json", "r")
    assert len(stocks) == 2
    assert stocks[0].symbol == "AAPL"
    assert stocks[0].name == "Apple"
    assert stocks[0].price == 150.0
    assert stocks[0].news == json.dumps(["Apple news 1", "Apple news 2"])
    assert stocks[0].rating == 5
    assert stocks[0].newsCounter == 15
    assert stocks[0].recommendation == "BUY"
    assert stocks[1].symbol == "GOOGL"
    assert stocks[1].name == "Google"
    assert stocks[1].price == 2800.0
    assert stocks[1].news == json.dumps(["Google news 1"])
    assert stocks[1].rating == 3
    assert stocks[1].newsCounter == 10
    assert stocks[1].recommendation == "HOLD"

def test_filterStocks(mocker, mock_stocks):
    """Test the filterStocks function."""
    mock_filter_criteria = {"newsCounter": {"value": 10}, "rating": {"value": 4}}
    mock_filter_model = mocker.Mock()
    mock_filter_model.newsCounter = mock_filter_criteria["newsCounter"]
    mock_filter_model.rating = mock_filter_criteria["rating"]
    filtered_stocks = filterStocks(mock_stocks, mock_filter_model)
    assert len(filtered_stocks) == 1
    assert filtered_stocks[0].symbol == "AAPL"
    assert filtered_stocks[0].rating == 5
    assert filtered_stocks[0].newsCounter == 15

def test_saveStocksToFile(mocker, mock_stocks):
    """Test the saveStocksToFile function."""
    mock_save = mocker.patch("builtins.open", mocker.mock_open())
    saveStocksToFile(mock_stocks)
    mock_save.assert_called_once_with("stocks_info.json", "w")

def test_applyRecommendationToStocks(mocker, mock_stocks):
    """Test the applyRecommendationToStocks function."""
    mock_recommendations = {"stocks": [{"symbol": "AAPL", "recommendation": "BUY"}]}
    updated_stocks = applyRecommendationToStocks(mock_stocks, mock_recommendations)
    assert len(updated_stocks) == 2
    assert updated_stocks[0].symbol == "AAPL"
    assert updated_stocks[0].rating == 5

def test_recommendationBuySell(mocker, mock_stocks):
    """Test the recommendationBuySell function."""
    mock_file = mocker.patch("builtins.open", mocker.mock_open())
    mock_logger = mocker.patch("app.stock.service.stock_service.logger.info")
    mock_datetime = mocker.patch("app.stock.service.stock_service.datetime")
    mock_datetime.now.return_value.strftime.return_value = "2025-04-15 13:43:41"

    # Set recommendations for the mock stocks
    mock_stocks[0].recommendation = "BUY"
    mock_stocks[1].recommendation = "SELL"

    recommendationBuySell(mock_stocks)

    # Verify file writes
    mock_file.assert_called_once_with("transactions.txt", "a")
    mock_file().write.assert_any_call("2025-04-15 13:43:41 - AAPL:BOUGHT\n")
    mock_file().write.assert_any_call("2025-04-15 13:43:41 - GOOGL:SOLD\n")

    # Verify logger calls
    mock_logger.assert_any_call("Stock AAPL marked as BOUGHT on 2025-04-15 13:43:41.")
    mock_logger.assert_any_call("Stock GOOGL marked as SOLD on 2025-04-15 13:43:41.")
