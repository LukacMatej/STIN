import pytest
from app.auth.token.jwt_token_service import generate_token, decode_token
import jwt

def test_generate_token(mocker):
    """Test the generate_token function."""
    mocker.patch("jwt.encode", return_value="mock_token")
    payload = {"user_id": "test@example.com"}
    secret = "test_secret"
    token = generate_token(payload, secret)
    assert token == "mock_token"

def test_decode_token(mocker):
    """Test the decode_token function."""
    mocker.patch("jwt.decode", return_value={"user_id": "test@example.com"})
    token = "mock_token"
    secret = "test_secret"
    decoded = decode_token(token, secret)
    assert decoded["user_id"] == "test@example.com"
