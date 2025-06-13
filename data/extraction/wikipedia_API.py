import requests
import csv
import pandas as pd

wikipedia_link = 'https://en.wikipedia.org/wiki/'
wikipedia_api = "https://en.wikipedia.org/w/api.php"

import requests
import time

def get_article_stats(title, delay=0.1):

    params_contributors = {
        "action": "query",
        "titles": title,
        "prop": "contributors",
        "pclimit": "max",  # Up to 5000 contributors
        "format": "json"
    }
    
    try:
        response = requests.get(wikipedia_api, params=params_contributors)
        response.raise_for_status()
        contributors_data = response.json()
        
        unique_editors = []
        pages = contributors_data["query"]["pages"]
        
        for page_id, page_data in pages.items():
            if page_id == "-1":
                print(f"Page '{title}' not found")
                return None
                
            if "contributors" in page_data:
                unique_editors = [contrib["name"] for contrib in page_data["contributors"]]
        
        time.sleep(delay)
        
        # Get total edits with pagination
        total_edits = 0
        rvcontinue = None
        
        while True:
            params_edits = {
                "action": "query",
                "titles": title,
                "prop": "revisions",
                "rvlimit": "max",
                "rvprop": "timestamp",  # Minimal data for counting
                "format": "json"
            }
            
            if rvcontinue:
                params_edits["rvcontinue"] = rvcontinue
            
            response = requests.get(wikipedia_api, params=params_edits)
            response.raise_for_status()
            revisions_data = response.json()
            
            pages = revisions_data["query"]["pages"]
            for page_id, page_data in pages.items():
                if "revisions" in page_data:
                    total_edits += len(page_data["revisions"])
            
            if "continue" in revisions_data:
                rvcontinue = revisions_data["continue"]["rvcontinue"]
                time.sleep(delay)
            else:
                break
        
        data = {
            'title': title,
            'total_edits': total_edits,
            'unique_editors': len(unique_editors)
            # 'editors': unique_editors
        }

        # print(data)
        return data
        
    except requests.exceptions.RequestException as e:
        print(f"Request error for '{title}': {e}")
        return None

# def get_wikipedia_edits(title):

#     # params_edits = {
#     #     "action": "query",
#     #     "titles": title,
#     #     "prop": "revisions",
#     #     "rvlimit": "max",
#     #     "rvprop": "timestamp",  # Minimal data to reduce response size
#     #     "format": "json"
#     # }

#     params_editors = {
#         "action": "query",
#         "titles": title,
#         "prop": "contributors",
#         "pclimit": "max",
#         "format": "json"
#     }

#     # total_edits = get_total_edit_count(wikipedia_api, title)

#     # response_a = requests.get(wikipedia_api, params=params_edits).json()
#     # pages_a = response_a["query"]["pages"]
#     # for page_id, page_data in pages_a.items():
#     #     total_edits = len(page_data["revisions"])
#     #     print(total_edits)
        
        
#     # response_a = requests.get(wikipedia_api, params=params_edits).json()
#     # page_a = next(iter(response_a["query"]["pages"].values()))
#     # total_edits = page_a.get("editcount") # page_a.get("edits", "N/A")

#     response_b = requests.get(wikipedia_api, params=params_editors).json()
#     pages_b = response_b["query"]["pages"]

#     total_editors = 0
#     for page_id in pages_b:
#         if "contributors" in pages_b[page_id]:
#             contributors = pages_b[page_id]["contributors"]

#             unique_editors = [contrib["name"] for contrib in contributors]

#     total_editors = len(unique_editors)

#     # return total_edits, total_editors

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

    if 'edits' not in df.columns:
        df['edits'] = None

    if 'editors' not in df.columns:
        df['editors'] = None
    
    count = 0   
    for index, row in df.iterrows():
        count += 1
        if count > 0 and count < 100000:
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

            data = get_article_stats(title)
            print(count, title, data.get('total_edits'), data.get('unique_editors'))

            df.loc[index, 'edits'] = data.get('total_edits')
            df.loc[index, 'editors'] = data.get('unique_editors')

            result_df = df[['title', 'edits', 'editors']]

    result_df.to_csv(output_file, sep='\t', index=False)

    print('done')


# -----------------------


read_csv_file('extraction/')


# -----------------------

'''

python3 extraction/wikipedia_API.py

'''