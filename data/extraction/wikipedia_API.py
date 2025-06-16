import requests
import csv
import pandas as pd
import time

wikipedia_link = 'https://en.wikipedia.org/wiki/'
wikipedia_api = "https://en.wikipedia.org/w/api.php"


def get_linguistic_versions(title):

    params = {
        "action": "query",
        "titles": title,
        "prop": "langlinks",
        "lllimit": "max",
        "format": "json"
    }
    
    response = requests.get(url=wikipedia_api, params=params)
    data = response.json()
    
    pages = data.get("query", {}).get("pages", {})
    page = next(iter(pages.values()))

    langlinks = page.get("langlinks", [])
    
    return len(langlinks)

def check_article_restrictions(title):
    
    params = {
        'action': 'query',
        'format': 'json',
        'prop': 'info',
        'inprop': 'protection',
        'titles': title
    }
    
    response = requests.get(wikipedia_api, params=params)
    data = response.json()
    
    pages = data['query']['pages']
    for page_id, page_info in pages.items():
        if 'protection' in page_info:
            types = [item['type'] for item in page_info['protection']]
            return types
        else:
            return "No restrictions"

def get_edits_editors(title, delay=0.1):
    try:
        
        total_edits = 0
        unique_editors = set()  # Use set for efficient uniqueness tracking
        rvcontinue = None
        
        while True:
            params_edits = {
                "action": "query",
                "titles": title,
                "prop": "revisions",
                "rvlimit": "max",
                "rvprop": "user|timestamp",  # Include user to get editor names
                "format": "json"
            }
            
            if rvcontinue:
                params_edits["rvcontinue"] = rvcontinue
            
            response = requests.get(wikipedia_api, params=params_edits)
            response.raise_for_status()
            revisions_data = response.json()
            
            pages = revisions_data["query"]["pages"]
            for page_id, page_data in pages.items():
                if page_id == "-1":
                    print(f"Page '{title}' not found")
                    return None
                    
                if "revisions" in page_data:
                    revisions = page_data["revisions"]
                    total_edits += len(revisions)
                    
                    # Extract unique editors from revisions
                    for revision in revisions:
                        if "user" in revision:
                            unique_editors.add(revision["user"])
            
            if "continue" in revisions_data:
                rvcontinue = revisions_data["continue"]["rvcontinue"]
                time.sleep(delay)
            else:
                break
        
        data = {
            'title': title,
            'total_edits': total_edits,
            'unique_editors': len(unique_editors)
            # 'editors': list(unique_editors)
        }

        return data
        
    except requests.exceptions.RequestException as e:
        print(f"Request error for '{title}': {e}")
        return None

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

    # if 'issues' not in df.columns:
    #     df['issues'] = None

    # if 'edits' not in df.columns:
    #     df['edits'] = None

    # if 'editors' not in df.columns:
    #     df['editors'] = None

    # if 'restrictions' not in df.columns:
    #     df['restrictions'] = None

    # if 'linguistic_versions' not in df.columns:
    #     df['linguistic_versions'] = None

    if 'revisions' not in df.columns:
        df['revisions'] = None
    
    count = 0   
    for index, row in df.iterrows():
        count += 1
        if count > 0 and count < 10:
            title = row['title']

            # data = get_wikipedia_extract(title)[0]
            # df.loc[index, 'incipit_size'] = data

            # data = get_wikipedia_talkPage('Talk:' + title)
            # df.loc[index, 'discussion_size'] = data
            # print (count, title, data)

            # data = get_wikipedia_images(title)
            # df.loc[index, 'images'] = data
            # print (count, title, data)

            # data = get_wikipedia_issues(title)
            # df.loc[index, 'issues'] = data
            # print (count, title, data)
            
            # data = get_edits_editors(title)
            # print(count, title, data.get('total_edits'), data.get('unique_editors'))

            # data = check_article_restrictions(title)
            # restrictions = str(data).replace('[', '').replace(']', '').replace("'", '')
            # print(count, title, restrictions)

            data = get_linguistic_versions(title)
            linguistic_versions = data + 1 # +1 for the English version itself
            print(count, title, linguistic_versions)

            df.loc[index, 'revisions'] = data
            result_df = df[['title', 'revisions']]

    result_df.to_csv(output_file, sep='\t', index=False)

    # print('done')


# -----------------------


read_csv_file('extraction/')


# -----------------------

'''

python3 extraction/wikipedia_API.py

'''