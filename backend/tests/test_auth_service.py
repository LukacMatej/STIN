import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from app.auth.service import auth_service
from app.auth.sign_in.model import sign_in_model as sim
from app.auth.sign_up.model import sign_up_model as sum
from unittest.mock import patch, MagicMock

def test_validateLogin_success(mocker):
    """Test validateLogin with valid credentials."""
    mock_user_data = "test@test.com password Test User password 1234\n"
    mock_open = mocker.patch("builtins.open", mocker.mock_open(read_data=mock_user_data))

    result = auth_service.validateLogin("test@test.com", "password")
    assert result[0] is True
    assert result[1].email == "test@test.com"
    assert result[1].password == "password"
    assert result[1].token == "1234"
    mock_open.assert_called_once_with("users.txt", "r")

def test_validateLogin_invalid_email(mocker):
    """Test validateLogin with invalid email."""
    mock_user_data = "test@test.com password Test User password 1234\n"
    mock_open = mocker.patch("builtins.open", mocker.mock_open(read_data=mock_user_data))

    result = auth_service.validateLogin("invalid@test.com", "password")
    assert result[0] is False
    assert result[1] is None
    mock_open.assert_called_once_with("users.txt", "r")

def test_validateLogin_invalid_password(mocker):
    """Test validateLogin with invalid password."""
    mock_user_data = "test@test.com correct_password Test User password 1234\n"
    mock_open = mocker.patch("builtins.open", mocker.mock_open(read_data=mock_user_data))

    result = auth_service.validateLogin("test@test.com", "wrong_password")
    assert result[0] is False
    assert result[1] is None
    mock_open.assert_called_once_with("users.txt", "r")

def test_saveRegistrationJson_success(mocker):
    """Test saveRegistrationJson with valid data."""
    mock_sign_up_model = sum.SignUpModel(
        email="test@test.com",
        password="test",
        first_name="test",
        last_name="test",
        second_password="test"
    )
    mock_open = mocker.patch("builtins.open", mocker.mock_open())  # Mock the open function

    auth_service.saveRegistrationJson(mock_sign_up_model)

    # Assert that open was called with the correct arguments
    mock_open.assert_called_with("users.txt", "a")

    # Assert that the correct data was written to the file
    written_data = mock_open().write.call_args[0][0]
    assert written_data.startswith("test@test.com test test test test ")
    assert len(written_data.split()) == 6  # Ensure the token is included as the 6th field

def test_saveRegistrationJson_failure(mocker):
    """Test saveRegistrationJson with exception handling."""
    mock_sign_up_model = MagicMock()
    mocker.patch("builtins.open", side_effect=Exception("File error"))

    with pytest.raises(Exception, match="File error"):
        auth_service.saveRegistrationJson(mock_sign_up_model)
