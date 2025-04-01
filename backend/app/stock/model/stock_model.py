import json

class Stock:
    def __init__(self, symbol: str, name: str, price: float):
        self.symbol: str = symbol
        self.name: str = name
        self.price: float | None = price if price else None
        self.news: str | None = None
        self.rating: float | None = None

    def setRating(self, rating: float):
        self.rating = rating
    def setPrice(self, price: float):
        self.price = price
    def setNews(self, news: str):
        self.news = news
    def __repr__(self):
        return f"Stock(symbol={self.symbol}, name={self.name}, price={self.price}, news={self.news}, rating={self.rating})"
    def __str__(self):
        return f"Stock(symbol={self.symbol}, name={self.name}, price={self.price}, news={self.news}, rating={self.rating})"
    def contextForAI(self):
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