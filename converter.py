from openpyxl import load_workbook
import json

def importcharacter(filename): #reads an xlsx file and returns a dict object with the character data.
    character = {
    'name': '',
    'bio': '',
    'filename' : '',
	'croppedfilename' : '',
    'questions' : [],
    'funfacts' : [],
    'tags' : [],

    }

    wb = load_workbook(filename)
    ws = wb['Taulukko1']

    for row in ws.values:
        if row[0] == 'Name':
            character['name'] = row[1]
        elif row[0] == 'Bio':
            character['bio'] = row[1]
        elif row[0] == 'Q':
            i = 3
            ans = []
            while i < len(row) and row[i] != None:
                ans.append(row[i])
                i = i+1

            character['questions'].append({
                'question' : row[1],
                'answertext' : row[2],
                'answers' : ans      
            }
            )
        elif row[0] == 'FF':
            character['funfacts'].append(row[1])
        elif row[0] == 'Tags':
            i = 1
            tag = []
            while i < len(row) and row[i] != None:
                tag.append(row[i])
                i = i+1
            character['tags'] = tag
        else:
            break
    return character

charjson = json.dumps(importcharacter('data.xlsx'), indent=4)
print(charjson)