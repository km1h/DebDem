# TODO: Add fake news data set when Will has more space on his computer
import pandas as pd
import numpy as np

"""
New Bias Data Set:
Navigating News Narratives: A Media Bias Analysis Dataset,
Raza, Shaina, arXiv preprint arXiv:2312.00168, 2023
"""
from datasets import load_dataset
from transformers import pipeline

print ("Loading the Data")

dataset = load_dataset("newsmediabias/news-bias-full-data")
print(dataset) 
