import finnhub
import json

class FinnhubClient:
    def __init__(self, api_key: str):
        self.client = finnhub.Client(api_key=api_key)

    def getGeneralNews(self, category: str) -> json:
        return self.client.general_news(category, min_id=0)