import json
from google import genai
from ...stock.model import stock_model as sm


class genaiClient:
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)

    def evaluateText(self, stocks: list[sm.Stock]) -> str:
        text = ''
        for stock in stocks:
            text += json.dumps(stock.contextForAI()) + '\n'
        response = self.client.models.generate_content(
        model='gemini-2.0-flash-001', contents=f'For each json value evaluate as either positive or negative,'
                                            f'responding with a single number ranging from -10 to 10 in text on each row. Respond only with json, no other text.'
                                            f'If the json is not valid, respond with "Invalid JSON".'
                                            f'Format will be like this: {"reponse": ["symbol": "AAPL","rating": "number","symbol": "symbol","name": "number"]}'
                                            f'The json is: {text}')
        return(response)
    