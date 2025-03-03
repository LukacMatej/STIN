from google import genai

class genaiClient:
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)

    def evaluateText(self, text):
        response = self.client.models.generate_content(
        model='gemini-2.0-flash-001', contents=f'For each json value evaluate as either positive or negative,'
                                            f'responding with a single word in text on each row: "positive" or "negative."'
                                            f'The json is: {text}')
        return(response)
    