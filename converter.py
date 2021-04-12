import os, json, shutil
from openpyxl import load_workbook

def importcharacter(filename, photof, crophotof): #reads an xlsx file and returns a dict object with the character data.
   character = {
   'name': '',
   'bio': '',
   'filename' : "photodir/"+photof,
   'croppedfilename' : "photodir/"+crophotof,
   'questions' : [],
   'funfacts' : [],
   'tags' : [],

   }

   wb = load_workbook(filename)
   ws = wb.active
   print("Attempting to read "+ filename)
   for row in ws.values:
      if row[0] == 'Name':
         character['name'] = row[1].replace("\n"," ")
      elif row[0] == 'Bio':
         character['bio'] = row[1].replace("\n"," ")
      elif row[0] == 'Q':
         i = 3
         ans = []
         while i < len(row) and row[i] != None:
               ans.append(str(row[i]).replace("\n"," "))
               i = i+1

         character['questions'].append({
               'question' : row[1].replace("\n"," "),
               'answertext' : row[2].replace("\n"," "),
               'answers' : ans      
         }
         )
      elif row[0] == 'FF':
         character['funfacts'].append(row[1].replace("\n"," "))
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
         return Null
      
   print("Sucessfully added "+ character['name'])
   return character

characters = []
photodir = "photodir"
if os.path.exists(photodir):
   shutil.rmtree(photodir)
os.mkdir(photodir)
i = 0

for root, dirs, files in os.walk(".", topdown=False):
   photof = ""
   crophotof = ""
   dataf = ""
   for name in files:
      if name.endswith('.jpg'):
         photof = str(i)+".jpg"
         shutil.copy(os.path.join(root, name), os.path.join(photodir, photof))
      elif name.endswith('.png'):
         crophotof = str(i)+".png"
         shutil.copy(os.path.join(root, name), os.path.join(photodir, crophotof))
      elif name.endswith('.xlsx'):
         dataf = name
   if "" not in (photof, crophotof, dataf):
      try:
         characters.append(importcharacter(os.path.join(root, dataf),photof,crophotof))
         i = i+1
      except Exception as e:
         print(e)
   else:
      print("Invalid character! " + dataf + photof + crophotof)


if os.path.exists("data.js"):
   os.remove("data.js")
f = open("data.js","x")
f.write("var data = {\n\t\"characters\": ")
f.write(json.dumps(characters, indent=4))
f.write("\n}")
f.close()