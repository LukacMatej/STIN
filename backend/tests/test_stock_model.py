import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.stock.model.stock_model import Stock
import pytest

def test_stock_initialization():
    """Test the initialization of Stock."""
    stock = Stock(symbol="AAPL", name="Apple", price=150.0, rating=5, newsCounter=10)
    assert stock.symbol == "AAPL"
    assert stock.name == "Apple"
    assert stock.price == 150.0
    assert stock.rating == 5
    assert stock.newsCounter == 10

def test_stock_repr():
    """Test the __repr__ method of Stock."""
    stock = Stock(symbol="AAPL", name="Apple", price=150.0, rating=5, newsCounter=10)
    assert repr(stock) == "Stock(symbol=AAPL, name=Apple, price=150.0, news=None, rating=5)"
