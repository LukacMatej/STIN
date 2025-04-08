class StockFilterModel:
    def __init__(self, newsCounter: int, rating: float, page: int = 1, pageSize: int = 10) -> None:
        self.page: int = page
        self.newsCounter: int = newsCounter
        self.rating: float = rating
        self.pageSize: int = pageSize