import finnhub

class FinnhubClient:
    def __init__(self, api_key: str):
        self.client = finnhub.Client(api_key=api_key)
        
    def getCompanyEarning(self):
        return self.client.company_earnings('TSLA', limit=5)
