import json
from typing import Any

class Stock:
    def __init__(self, symbol: str, name: str, price: float, news: str = None, rating: float = None, newsCounter: int = 0, recommendation: str = None) -> None:
        self.symbol: str = symbol
        self.name: str | None = name if name else None
        self.price: float | None = price if price else None
        self.news: str | list | None = news if news else None
        self.rating: float | None = rating
        self.newsCounter: int = newsCounter
        self.recommendation: str | None = recommendation

    def setNewsCounter(self, newsCounter) -> None:
        self.newsCounter = newsCounter
    def setRating(self, rating: float | None) -> None:
        self.rating = float(rating) if rating not in [None, ""] else None
    def setPrice(self, price: float) -> None:
        self.price = price
    def setNews(self, news: str) -> None:
        self.news = news
    def setRecommendation(self, recommendation: str) -> None:
        self.recommendation = recommendation
    def __repr__(self) -> str:
        return f"Stock(symbol={self.symbol}, name={self.name}, price={self.price}, news={self.news}, rating={self.rating})"
    def __str__(self) -> str:
        return f"{self.symbol}|{self.name}|{self.price}|{self.recommendation}|{self.rating}|{self.newsCounter}|{self.news}"
    def __dict__(self) -> dict[str, Any]:
        return {
            "symbol": self.symbol,
            "name": self.name,
            "price": self.price,
            "news": self.news if isinstance(self.news, list) else (json.loads(self.news) if self.news else None),
            "rating": self.rating,
            "newsCounter": self.newsCounter,
            "recommendation": self.recommendation
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