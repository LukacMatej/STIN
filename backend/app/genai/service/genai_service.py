import json
from google import genai
from google.generativeai.types import GenerationConfig
from ...stock.model import stock_model as sm


class genaiClient:
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)

    def evaluateText(self, stocks: list[sm.Stock]) -> str:
        text = ''
        for stock in stocks:
            text += json.dumps(stock.contextForAI()) + '\n'
        prompt = (
            "For each JSON value evaluate as either positive or negative, "
            "responding with a single number ranging from -10 to 10 in text on each row. "
            "Respond only with JSON, no other text. "
            "If the JSON is not valid, respond with 'Invalid JSON'. "
            "Format will be JSON, with each line being a JSON object. If there's only one symbol, respond with a single JSON object. "
            f"The JSON is: {text} "
            "Output JSON should be like this example: [{'symbol': 'AAPL', 'rating': 5}, {'symbol': 'GOOG', 'rating': -3}]"
        )
        config = GenerationConfig(
            temperature=0.0,
            response_mime_type="application/json"
        )
        response = self.client.models.generate_content(
            model='gemini-2.0-flash-001',
            contents=prompt,
            generation_config=config
        )
        
        return(response)
    