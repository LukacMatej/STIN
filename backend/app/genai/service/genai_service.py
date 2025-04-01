import json
import google.generativeai as genai
from google.generativeai import GenerationConfig
from pydantic import BaseModel
from google.generativeai.types.generation_types import GenerateContentResponse
from ...stock.model import stock_model as sm

class Output(BaseModel):
  symbol: str
  rating: str


class genaiClient:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-pro-latest')
        

    def evaluateText(self, stocks: list[sm.Stock]) -> str:
        text = ''
        for stock in stocks:
            text += json.dumps(stock.contextForAI()) + '\n'
        prompt = (
            "Analyze the sentiment of each stock provided in the JSON data below. "
            "For each stock, respond with a JSON object containing two fields: 'symbol' (string) and 'rating' (string). "
            "The 'rating' should be a string representation of a number from -10 (very negative) to 10 (very positive). "
            "If a JSON input line is invalid, you can omit it or return an object like {\"symbol\": \"INVALID\", \"rating\": \"N/A\"}. "
            "The final output MUST be a single JSON array containing these objects. Use only double quotes. Do not include any text before or after the JSON array.\n"
            f"The JSON data:\n{text}"
        )
        config = GenerationConfig(
            temperature=0.0,
            response_mime_type="application/json",
            response_schema=list[Output]
        )
        response: GenerateContentResponse = self.model.generate_content(
             contents=prompt,
             generation_config=config
        )        
        return(response)
    