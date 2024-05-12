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
    with open(f"ai-scripts/dummy-data/transcript{id}.txt", "r") as file:
      transcript = file.read()
    return transcript

def get_topic (transcript_id):
    """
    Get the topic of a transcript
    """
    # Unhardcode this later from backend
    return "Abolishing Greeklife at Stanford"


def ask_gpt(messages, model):
    chat_completion = client.chat.completions.create(
        messages=messages, model=model,
      )
    return chat_completion.choices[0].message.content