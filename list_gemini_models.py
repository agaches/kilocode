import google.generativeai as genai
import os

api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    print("Error: GEMINI_API_KEY environment variable not set.")
else:
    genai.configure(api_key=api_key)
    try:
        for m in genai.list_models():
            print(m.name)
    except Exception as e:
        print(f"Error listing models: {e}")