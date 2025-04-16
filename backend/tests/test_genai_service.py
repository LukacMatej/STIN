import pytest
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.genai.service.genai_service import genaiClient
from app.stock.model import stock_model as sm

def test_evaluate_text(mocker):
    """Test the evaluateText method of genaiClient."""
    mock_model = mocker.Mock()
    mock_model.generate_content.return_value.text = (
        '{"symbol": "AAPL", "rating": "8"}, {"symbol": "GOOGL", "rating": "9"}'
    )
    mocker.patch("app.genai.service.genai_service.genai.GenerativeModel", return_value=mock_model)

    client = genaiClient(api_key="test_api_key")
    stocks = [mocker.Mock(contextForAI=lambda: {"symbol": "AAPL"}), mocker.Mock(contextForAI=lambda: {"symbol": "GOOGL"})]
    result = client.evaluateText(stocks)

    assert result == {"AAPL": "8", "GOOGL": "9"}
