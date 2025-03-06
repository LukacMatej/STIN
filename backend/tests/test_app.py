import pytest
import json
import os
from server import app

@pytest.fixture
def client():
    """Fixture to set up a Flask test client."""
    os.environ["FINNHUB_API_KEY"] = "test_finnhub_key"
    os.environ["GEN_AI_KEY"] = "test_genai_key"
    
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_index(client):
    """Test the home route."""
    response = client.get("/")
    assert response.status_code == 200
    assert b"Hello, Flask!" in response.data

def test_getStockNews(client, mocker):
    """Test the getStockNews route with mocked API responses."""
    mock_stocks = [{"summary": "Stock ABC is rising"}, {"summary": "Stock XYZ is falling"}]

    # Mock FinnhubClient response
    mocker.patch("app.stock.service.stock_service.FinnhubClient.getGeneralNews", return_value=mock_stocks)

    # Mock GenAIClient response
    class MockGenAIResponse:
        text = "Stock ABC is good.\nStock XYZ is bad."

    mocker.patch("app.genai.service.genai_service.genaiClient.evaluateText", return_value=MockGenAIResponse())

    response = client.get("/getStock")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 2
    assert "Stock ABC is good." in data
    assert "Stock XYZ is bad." in data
