import pytest
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from unittest.mock import patch, MagicMock
from flask import Flask
from flask import abort
import jwt
from app.auth.token.jwt_token_service import token_required

@pytest.fixture
def app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "test_secret_key"
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@patch("app.auth.token.jwt_token_service.aservice.getCurrentUser")
@patch("jwt.decode")
def test_token_required_valid_token(mock_jwt_decode, mock_get_current_user, app):
    mock_jwt_decode.return_value = {"user_id": 1}
    mock_get_current_user.return_value = {"id": 1, "active": True}

    @token_required
    def protected_route(current_user):
        return {"message": "Success"}, 200

    with app.test_request_context(headers={"Authorization": "Bearer valid_token"}):
        response = protected_route()
        assert response[1] == 200
        assert response[0]["message"] == "Success"

def test_token_required_missing_token(app):
    @token_required
    def protected_route(current_user):
        return {"message": "Success"}, 200

    with app.test_request_context(headers={}):
        response = protected_route()
        assert response[1] == 401
        assert response[0]["message"] == "Authentication Token is missing!"

@patch("jwt.decode")
def test_token_required_invalid_token(mock_jwt_decode, app):
    """Test the token_required decorator with an invalid token."""
    mock_jwt_decode.side_effect = jwt.ExpiredSignatureError  # Fix: Use jwt.ExpiredSignatureError

    @token_required
    def protected_route(current_user):
        return {"message": "Success"}, 200

    with app.test_request_context(headers={"Authorization": "Bearer invalid_token"}):
        response = protected_route()
        assert response[1] == 500
        assert "Something went wrong" in response[0]["message"]

@patch("app.auth.token.jwt_token_service.aservice.getCurrentUser")
@patch("jwt.decode")
def test_token_required_user_not_found(mock_jwt_decode, mock_get_current_user, app):
    mock_jwt_decode.return_value = {"user_id": 1}
    mock_get_current_user.return_value = None

    @token_required
    def protected_route(current_user):
        return {"message": "Success"}, 200

    with app.test_request_context(headers={"Authorization": "Bearer valid_token"}):
        response = protected_route()
        assert response[1] == 401
        assert response[0]["message"] == "Invalid Authentication token!"