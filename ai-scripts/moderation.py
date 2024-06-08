# TODO: Add fake news data set when Will has more space on his computer
import pandas as pd
import numpy as np
from bad_words import PROFANITY_LIST
from utils import *

def flag_profanity(transcript_id, detected_words = None):
    """
    Flag a transcript for profanity
    If a DETECTED_WORDS list is provided, we will store detected bad words in it
    """
    text = load_transcript (transcript_id)
    words = text.lower().split()
    profanity = [word for word in words if word in PROFANITY_LIST]
    if detected_words:
        detected_words.extend(profanity)
    return len(profanity) > 0
    

"""
New Bias Data Set:
Navigating News Narratives: A Media Bias Analysis Dataset,
Raza, Shaina, arXiv preprint arXiv:2312.00168, 2023
"""
def flag_bias (transcript_id):
  import torch
  from transformers import AutoModelForSequenceClassification, AutoTokenizer

  text = load_transcript (transcript_id)

  model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased")
  model.load_state_dict(torch.load("model_epoch_2.pt"))
  tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

  device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
  model.to(device)

  model.eval()
  encoded_text = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=256).to(device)
  with torch.no_grad():
      output = model(**encoded_text)
      prediction = torch.argmax(output.logits, dim=1)
  
  return predict(text)
  

  