from utils import *

HARD_CODED_NUM_TOPICS = 3 #consider adding a heuristic later

def run_synthesis(transcript_ids, model = "gpt-4"):
    
    # Load the transcripts and topic
    transcripts = [load_transcript (transcript_id) for transcript_id in transcript_ids]
    topic = get_topic(transcript_ids[0])

    num_themes_to_surface = get_num_topics(len(" ".join(transcripts)))
    
    all_themes = []

    # identify topics and key themes
    for transcript in transcripts:
        prompts = [
          {
            "role": "system",
            "content": f"Please review the provided transcript of a student discussion about {topic} and identify the primary themes or topics. List these themes or topics in a comma-separated format. Generate no more than {3 * num_themes_to_surface // 2} topics. Do not respond with anything else."
          }, {
            "role": "user",
            "content": transcript
          }
        ]
        res = ask_gpt(prompts, model)
        all_themes.extend(res.split(','))
    
    # condense into core themes
    prompts = [
      {
        "role": "system",
        "content": f"These discussion topics have been extracted from a deliberation about {topic}. Please condense these discussion topics into {num_themes_to_surface} distinct main themes that cover the overall themes of the conversation. List these themes in a comma-separated format."
      }, {
        "role": "user",
        "content": ", ".join(all_themes)
      }
    ]
    res = ask_gpt(prompts, model)
    core_themes = res.split(',')

    # generate an overall summary
    prompts = [
      {
        "role": "system",
        "content": f"Please generate a summary of the discussion based on the provided transcript of a discussion about {topic}. The summary should be concise and capture the main points of the conversation. Draw out points of consensus and disagreement. Do not use any specific names or pronouns."
      }, {
        "role": "user",
        "content": " ".join(transcripts)
      }
    ]
    overall_summary = ask_gpt(prompts, model)

    # surface examples of key points for each theme
    for theme in core_themes:
        for transcript in transcripts:
            # identify the key points for each theme
            prompts = [
              {
                "role": "system",
                "content": f"Please review the provided transcript of a student discussion about {topic} and identify the key points related to the theme: {theme}. Do not use any specific names or pronouns. When strongly relevant try to quote directly and anonymously from the transcript. Be consice and provide the key points only and adhere to the themes."
              }, {
                "role": "user",
                "content": transcript
              }
            ]
            res = ask_gpt(prompts, model)
            overall_summary += (theme + res)
    
    total_length = 100 + 100 * num_themes_to_surface
    prompts = [
        {
            "role": "system",
            "content": f"You will be provided with a summary of a discussion about {topic} in addition to the key themes and student quotes related to those themes. Please synthesize them into a {total_length} word summary that captures the essence of the discussion. Include a paragraph for each of the key themes, {', '.join(core_themes)}."
        }, {
            "role": "user",
            "content": overall_summary
        }
    ]
    synthesized_summary = ask_gpt(prompts, model)
    print (synthesized_summary)
      
    return synthesized_summary

def get_num_topics (total_length):
    return HARD_CODED_NUM_TOPICS

run_synthesis([1, 2])