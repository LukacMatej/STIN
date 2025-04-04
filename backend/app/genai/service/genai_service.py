import json
import google.generativeai as genai
import re
from google.generativeai import GenerationConfig
from pydantic import BaseModel
from google.generativeai.types.generation_types import GenerateContentResponse
from ...stock.model import stock_model as sm

class genaiClient:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-lite')

    def evaluateText(self, stocks: list[sm.Stock]) -> str:
        text: str = ''
        for stock in stocks:
            text += json.dumps(stock.contextForAI()) + '\n'
        prompt: str = (
            "Use this JSON schema:"
            'Output =[{"symbol": "AAPL", "rating": -8},, {"symbol": "GOOGL", "rating": 9}]'
            "Return: list[Output]"
            "Analyze the sentiment of each symbol stock provided in the JSON data below. "
            "The 'rating' should be a string representation of a number from -10 (very negative) to 10 (very positive). "
            f"The JSON data:\n{text}"
        )
        config = GenerationConfig(
            temperature=0.1,
            response_mime_type="application/json",
        )
        response: GenerateContentResponse = self.model.generate_content(
             contents=prompt,
             generation_config=config
        )
        pattern = r'"symbol":\s*"([^"]+)",\s*"rating":\s*"([^"]+)"'
        matches = re.findall(pattern, response.text)
        response_dict = {}
        for symbol, rating in matches:
            response_dict[symbol] = rating
        return(response_dict)
    