import json

input_file = 'input/revisions.json'
output_file = 'output/simplified_output.json'

def simplify_json(inp, out):
    with open(inp, 'r', encoding='utf-8') as infile:
        data = json.load(infile)

    simplified_data = []
    
    for item in data:
        simplified_item = {
            'title': item.get('title'),
            'wikidata_id': item.get('wikidata_id'),
            'revisions': []
        }
        
        for revision in item.get('revisions', []):
            simplified_revision = {
                'timestamp': revision.get('timestamp'),
                'size': revision.get('size')
            }
            simplified_item['revisions'].append(simplified_revision)
        
        simplified_data.append(simplified_item)

    with open(out, 'w', encoding='utf-8') as outfile:
        json.dump(simplified_data, outfile, indent=4, ensure_ascii=False)

simplify_json(input_file, output_file)