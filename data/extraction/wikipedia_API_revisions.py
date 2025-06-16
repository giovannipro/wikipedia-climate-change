import requests
import pandas as pd
import json

wikipedia_link = 'https://en.wikipedia.org/wiki/'
wikipedia_api = "https://en.wikipedia.org/w/api.php"

def get_all_revisions_paginated(title):

    params = {
        'action': 'query',
        'format': 'json',
        'prop': 'revisions',
        'titles': title,
        'rvlimit': 'max',
        'rvprop': 'ids|timestamp|user|comment|size'
    }

    params_b = {
        'action': 'query',
        'format': 'json',
        'ppprop': 'wikibase_item',
        'prop': 'pageprops',
        'redirects': 1,
        'titles': title
    }

    # wikidata Id
    response_b = requests.get(wikipedia_api, params=params_b)
    data_b = response_b.json()

    try:
        pageId = next(iter(data_b['query']['pages']))
    except StopIteration:
        pass
    
    wikidata_id = data_b['query']['pages'][pageId].get('pageprops', {}).get('wikibase_item', None)
    # print(wikidata_id)
    
    all_revisions = []

    while True:
        response = requests.get(url=wikipedia_api, params=params)
        data = response.json()
        
        pages = data.get("query", {}).get("pages", {})
        if not pages:
            # print(title, "No pages found.")
            break
        
        page = next(iter(pages.values()))
        page_revisions = page.get("revisions", [])
        all_revisions.extend(page_revisions)
        
        if "continue" in data:
            params["rvcontinue"] = data["continue"]["rvcontinue"]
        else:
            break

    return wikidata_id, all_revisions

def read_csv_file(file_path):

    input_file = file_path + 'input/article_list.tsv'
    output_file = file_path + 'output/output.json'
    output_file_b = file_path + 'output/output.tsv'

    df = pd.read_csv(input_file, delimiter='\t')

    all_data = []
    
    if 'wikidata_id' not in df.columns:
        df['wikidata_id'] = None
    
    count = 0   
    for index, row in df.iterrows():

        count += 1
        if count > 0 and count < 1000000:
            title = row['title']

            data = get_all_revisions_paginated(title)
            previous_edit = 0

            obj = {}
            obj['title'] = title
            obj['wikidata_id'] = data[0]
            obj['revisions'] = []

            for edits in data[1]:

                try: 
                    user = edits['user']
                except KeyError:
                    user = 'Unknown User'
                    pass

                size = int(edits['size'])
                # change = size - previous_edit
                timestamp = edits['timestamp']

                previous_edit = size

                obj['revisions'].append({
                    'timestamp': timestamp,
                    'size': size,
                    # 'change': change,
                    'user': user
                })

            all_data.append(obj)
                
            print(count, title, data[0], len(obj['revisions']))

            df.loc[index, 'wikidata_id'] = data[0]
            result_df = df[['title', 'wikidata_id']]

    result_df.to_csv(output_file_b, sep='\t', index=False)

    with open(output_file, 'w', encoding='utf-8') as f_out:
        json.dump(all_data, f_out, indent=4, ensure_ascii=False)

    print('done')

# -----------------------


read_csv_file('extraction/')


# -----------------------

'''

python3 extraction/wikipedia_API_revisions.py

'''