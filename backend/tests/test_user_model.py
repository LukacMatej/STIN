import pytest
from app.auth.user.model.user_model import UserModel

def test_user_model_initialization():
    """Test the initialization of UserModel."""
    user = UserModel(
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        password="password123",
        second_password="password123",
        token="test_token"
    )
    assert user.first_name == "John"
    assert user.last_name == "Doe"
    assert user.email == "john.doe@example.com"
    assert user.password == "password123"
    assert user.second_password == "password123"
    assert user.token == "test_token"

def test_user_model_repr():
    """Test the __repr__ method of UserModel."""
    user = UserModel(
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        password="password123",
        second_password="password123",
        token="test_token"
    )
    assert repr(user) == "<UserModel(first_name='John', last_name='Doe', email='john.doe@example.com')>"
