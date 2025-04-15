import pytest
import json
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))  # Add backend to PYTHONPATH
from server import app
from app.stock.model.stock_model import Stock
from app.auth.sign_in.model.sign_in_model import SignInModel

@pytest.fixture
def client():
    """Fixture to set up a Flask test client."""
    os.environ["FINNHUB_API_KEY"] = "test_finnhub_key"
    os.environ["GEN_AI_KEY"] = "test_genai_key"
    
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_getStockNews(client, mocker):
    """Test the getStockNews route with mocked API responses."""
    mock_stocks = [
        Stock(symbol="AAPL", name="Apple", price=150.0, news="Apple news"),
        Stock(symbol="GOOGL", name="Google", price=2800.0, news="Google news")
    ]
    mock_ai_response = {"AAPL": "Positive sentiment", "GOOGL": "Neutral sentiment"}

    # Mock FinnhubClient response
    mocker.patch("app.stock.service.stock_service.FinnhubClient.getStockNews", return_value=mock_stocks)

    # Mock GenAIClient response
    mocker.patch("app.genai.service.genai_service.genaiClient.evaluateText", return_value=mock_ai_response)

    response = client.get("/getStock")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data == mock_ai_response

def test_evaluateStocks(client, mocker):
    """Test the evaluateStocks route with mocked API responses."""
    mock_request_data = {"stocks": [{"symbol": "AAPL"}, {"symbol": "GOOGL"}]}
    mock_stock_news = [
        Stock(symbol="AAPL", name="Apple", price=150.0, news="Apple news"),
        Stock(symbol="GOOGL", name="Google", price=2800.0, news="Google news")
    ]
    mock_ai_response = {"AAPL": 5, "GOOGL": 3}
    mock_final_stocks = [
        Stock(symbol="AAPL", name="Apple", price=150.0, rating=5),
        Stock(symbol="GOOGL", name="Google", price=2800.0, rating=3)
    ]
    mock_answer = json.dumps({"stocks": [stock.__dict__() for stock in mock_final_stocks]})

    # Mock FinnhubClient response
    mocker.patch("app.stock.service.stock_service.FinnhubClient.getStockNews", return_value=mock_stock_news)

    # Mock GenAIClient response
    mocker.patch("app.genai.service.genai_service.genaiClient.evaluateText", return_value=mock_ai_response)

    # Mock saveStocksToFile and prepareAnswer
    mocker.patch("app.stock.service.stock_service.saveStocksToFile")
    mocker.patch("app.stock.service.stock_service.prepareAnswer", return_value=mock_answer)

    response = client.post("/evaluateStocks", json=mock_request_data)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data["data"]["stocks"]) == 2
    assert data["data"]["stocks"][0]["symbol"] == "AAPL"
    assert data["data"]["stocks"][0]["rating"] == 5
    assert data["data"]["stocks"][1]["symbol"] == "GOOGL"
    assert data["data"]["stocks"][1]["rating"] == 3

def test_recommendation(client, mocker):
    """Test the recommendation route."""
    mock_request_data = {"stocks": [{"symbol": "AAPL", "action": "BUY"}]}
    mock_stocks = [Stock(symbol="AAPL", name="Apple", price=150.0, rating=5)]
    
    mocker.patch("app.stock.service.stock_service.getStocks", return_value=mock_stocks)
    mocker.patch("app.stock.service.stock_service.applyRecommendationToStocks", return_value=mock_stocks)
    mocker.patch("app.stock.service.stock_service.saveStocksToFile")
    mocker.patch("app.stock.service.stock_service.recommendationBuySell")

    response = client.post("/recommendation", json=mock_request_data)
    assert response.status_code == 200
    assert b"Recommendation applied" in response.data

class MockStock:
    def __init__(self, symbol, rating):
        self.symbol = symbol
        self.rating = rating

    def __dict__(self):
        return {"symbol": self.symbol, "rating": self.rating}

def test_get_stocks(client, mocker):
    """Test the get_stocks route."""
    mock_stocks = [Stock(symbol="AAPL", name="Apple", price=150.0, rating=5)]
    mocker.patch("app.stock.service.stock_service.getStocks", return_value=mock_stocks)

    response = client.get("/api/v1/stocks")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data["data"]) == 1
    assert data["data"][0]["symbol"] == "AAPL"
    assert data["data"][0]["rating"] == 5

def test_filter_stocks(client, mocker):
    """Test the filter_stocks route."""
    mock_request_data = {"newsCounter": {"value": 10}, "rating": {"value": 4}}
    mock_stocks = [
        Stock(symbol="AAPL", name="Apple", price=150.0, rating=5, newsCounter=15)
    ]
    mocker.patch("app.stock.service.stock_service.getStocks", return_value=mock_stocks)
    mocker.patch("app.stock.service.stock_service.filterStocks", return_value=mock_stocks)

    response = client.post("/api/v1/stocks/filter", json=mock_request_data)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data["data"]) == 1
    assert data["data"][0]["symbol"] == "AAPL"
    assert data["data"][0]["rating"] == 5
    assert data["data"][0]["newsCounter"] == 15

def test_logout(client):
    """Test the logout route."""
    response = client.post("/api/v1/auth/logout")
    assert response.status_code == 200
    assert b"Logged out successfully" in response.data

def test_login(client, mocker):
    """Test the login route."""
    mock_request_data = {"email": "test@test.com", "password": "password"}
    mock_user = SignInModel(email="test@test.com", password="password", token="test_token")
    mocker.patch("app.auth.service.auth_service.validateLogin", return_value=(True, mock_user))
    mocker.patch("jwt.encode", return_value="test_token")

    response = client.post("/api/v1/auth/login", json=mock_request_data)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["message"] == "Successfully fetched auth token"
    assert data["data"]["email"] == "test@test.com"

def test_getUserInfo(client, mocker):
    """Test the getUserInfo route."""
    mock_token = "test_token"
    mock_user = mocker.Mock()
    mock_user.first_name = "Test"
    mock_user.last_name = "User"

    # Mock jwt.decode to return a valid payload
    mocker.patch("jwt.decode", return_value={"user_id": "test@test.com"})

    # Mock auth_service.getUserByEmail to return a mock user
    mocker.patch("app.auth.service.auth_service.getUserByEmail", return_value=mock_user)

    # Set the JWT token in the cookies
    client.set_cookie("jwt", mock_token)

    response = client.get("/api/v1/auth/user")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["data"]["first_name"] == "Test"
    assert data["data"]["last_name"] == "User"

def test_register(client, mocker):
    """Test the register route."""
    mock_request_data = {
        "email": "test@test.com",
        "password": "password",
        "firstName": "Test",
        "lastName": "User",
        "secondPassword": "password"
    }
    mocker.patch("app.auth.service.auth_service.saveRegistrationJson")

    response = client.post("/api/v1/auth/registration", json=mock_request_data)
    assert response.status_code == 200
    assert b"Registration successful" in response.data
