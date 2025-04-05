import json
from typing import Any

class Stock:
    def __init__(self, symbol: str, name: str, price: float) -> None:
        self.symbol: str = symbol
        self.name: str | None = name if name else None
        self.price: float | None = price if price else None
        self.news: str | None = None
        self.rating: float | None = None

    def setRating(self, rating: float) -> None:
        self.rating = rating
    def setPrice(self, price: float) -> None:
        self.price = price
    def setNews(self, news: str) -> None:
        self.news = news
    def __repr__(self) -> str:
        return f"Stock(symbol={self.symbol}, name={self.name}, price={self.price}, news={self.news}, rating={self.rating})"
    def __str__(self) -> str:
        return f"Stock(symbol={self.symbol}, name={self.name}, rating={self.rating})"
    def __dict__(self) -> dict[str, Any]:
        return {
            "symbol": self.symbol,
            "name": self.name,
            "price": self.price,
            "news": self.news,
            "rating": self.rating
        }
    def contextForAI(self) -> dict[str, Any]:
        news: list[str] = []
        self.news = json.loads(self.news)
        for new in self.news:
            news.append(new['summary'])
        self.news = news
        return {
            "symbol": self.symbol,
            "name": self.name,
            "price": self.price,
            "news": self.news
        }