import os
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
   ws = wb.active
   print("Attempting to read "+ filename)
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
      elif row[0] == None:
         break
      else:
         print("Jävla Humanister!\n" + str(row))
      
   print("Sucessfully added "+ character['name'])
   return character

characters = []

for root, dirs, files in os.walk(".", topdown=False):
   for name in files:
      if name.endswith('.xlsx'):
         try:
            characters.append(importcharacter(os.path.join(root, name)))
         except:
            print("Huää humanist-error!")

print(json.dumps(characters, indent=4))