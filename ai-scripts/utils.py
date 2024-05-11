import openai
import os
from dotenv import load_dotenv

load_dotenv('secrets.env')
openai.api_key = os.environ.get("OPENAI_API_KEY")
client = openai.Client()

def load_transcript (id):
    """
    Load the transcripts from the backend
    """
    # TEMPORARY: Load the transcript from a file
    with open(f"transcripts{id}.txt", "r") as file:
      transcript = file.read()
    return transcript


def ask_gpt(messages, model):
    chat_completion = client.chat.completions.create(
        messages=messages, model=model,
      )
    return chat_completion.choices[0].message.content