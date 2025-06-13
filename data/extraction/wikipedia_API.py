import requests
import csv
import pandas as pd

wikipedia_link = 'https://en.wikipedia.org/wiki/'
wikipedia_api = "https://en.wikipedia.org/w/api.php"


def get_wikipedia_issues(title):
        
    params = {
        "action": "parse",
        "page": title,
        "prop": "templates",
        "format": "json"
    }

    response = requests.get(wikipedia_api, params=params).json()
    templates = response.get("parse", {}).get("templates", [])

    issue_keywords = ['cleanup', 'unsourced', 'disputed', 'POV', 'issues', 'tone', 'orphan', 'rewrite']
    issues = [tpl for tpl in templates if any(kw in tpl['*'].lower() for kw in issue_keywords)]
    issue_count = len(issues)

    # print(title, issue_count)

    return issue_count

def get_wikipedia_images(title):

    params = {
        "action": "query",
        "titles": title,
        "prop": "images",
        "imlimit": "max",  # gets up to 500 images
        "format": "json"
    }

    response = requests.get(wikipedia_api, params=params).json()
    page = next(iter(response["query"]["pages"].values()))
    images = page.get("images", [])

    # Filter only actual image files (optional)
    image_count = sum(1 for img in images if img['title'].lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.svg')))
    return image_count

def get_wikipedia_talkPage(title):

    params = {
        "action": "query",
        "prop": "revisions",
        "titles": title,
        "rvprop": "content",
        "format": "json"
    }

    response = requests.get(wikipedia_api, params=params).json()
    page = next(iter(response["query"]["pages"].values()))
    revisions = page.get("revisions", [])

    if revisions:
        content = revisions[0].get("*", "") or revisions[0].get("slots", {}).get("main", {}).get("*", "")
        size = int(len(content))
    else:
        print(title +  '\t' + "No content found")
        size = 0

    return size

def get_wikipedia_extract(title):

    params = {
        "action": "query",
        "prop": "extracts",
        "exintro": True,
        "explaintext": True,
        "titles": title,
        "format": "json"
    }

    response = requests.get(wikipedia_api, params=params).json()
    page = next(iter(response["query"]["pages"].values()))
    extract = page.get("extract", "")

    character_count = len(extract)
    word_count = len(extract.split())

    return character_count, word_count

def read_csv_file(file_path):

    input_file = file_path + 'input/article_list.tsv'
    output_file = file_path + 'output/output.tsv'

    df = pd.read_csv(input_file, delimiter='\t')
    
    # if 'incipit_size' not in df.columns:
    #     df['incipit_size'] = None

    # if 'discussion_size' not in df.columns:
    #     df['discussion_size'] = None

    # if 'images' not in df.columns:
    #     df['images'] = None

    if 'issues' not in df.columns:
        df['issues'] = None
    
    count = 0   
    for index, row in df.iterrows():
        count += 1
        if count > 0 and count < 10000:
            title = row['title']

            # data = get_wikipedia_extract(title)[0]
            # df.loc[index, 'incipit_size'] = data

            # data = get_wikipedia_talkPage('Talk:' + title)
            # df.loc[index, 'discussion_size'] = data
            # print (count, title, data)

            # data = get_wikipedia_images(title)
            # df.loc[index, 'images'] = data
            # print (count, title, data)

            data = get_wikipedia_issues(title)
            df.loc[index, 'issues'] = data
            print (count, title, data)
            
        result_df = df[['title', 'issues']]

    result_df.to_csv(output_file, sep='\t', index=False)

    print('done')


# -----------------------


read_csv_file('extraction/')


# -----------------------

'''

python3 extraction/wikipedia_API.py

'''