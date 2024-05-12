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
  from datasets import load_dataset
  from transformers import pipeline

  print ("Loading the Data")

  dataset = load_dataset("newsmediabias/news-bias-full-data")
  print(dataset["train"][0]) 


result = flag_profanity(1)
print (result)