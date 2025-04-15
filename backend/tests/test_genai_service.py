import pytest
from app.genai.service.genai_service import evaluate_text

def test_evaluate_text(mocker):
    """Test the evaluate_text function."""
    mocker.patch("app.genai.service.genai_service.requests.post", return_value=mocker.Mock(json=lambda: {"result": "Positive"}))
    result = evaluate_text("This is a test text.")
    assert result["result"] == "Positive"
