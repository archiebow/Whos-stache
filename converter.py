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
      if not isinstance(row[0], str):
         break
      elif row[0].strip() == 'Name':
         character['name'] = row[1].replace("\n"," ")
      elif row[0].strip() == 'Bio':
         character['bio'] = row[1].replace("\n"," ")
      elif row[0].strip() == 'Q':
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
      elif row[0].strip() == 'FF':
         character['funfacts'].append(row[1].replace("\n"," "))
      elif row[0].strip() == 'Tags':
         i = 1
         tag = []
         while i < len(row) and row[i] != None:
               tag.append(row[i].strip().lower().capitalize())
               i = i+1
         character['tags'] = tag
      else:
         print("Jävla Humanister!\n" + str(row))
         return 
      
   print("Sucessfully added "+ character['name'])
   return character

characters = []
photodir = "photodir"
if os.path.exists(photodir):
   shutil.rmtree(photodir)
os.mkdir(photodir)
i = 0
q = 0

for root, dirs, files in os.walk(".", topdown=False):
   photof = ""
   crophotof = ""
   dataf = ""
   for name in files:
      photodest = str(i)+".jpg"
      cropdest = str(i)+".png"
      i = i+1
      if name.endswith('.jpg') or name.endswith('.jpeg'):
         photof = name
      elif name.endswith('.png'):
         crophotof = name
      elif name.endswith('.xlsx'):
         dataf = name
   if "" not in (photof, crophotof, dataf):
      try:
         shutil.copy(os.path.join(root, photof), os.path.join(photodir, photodest))
         shutil.copy(os.path.join(root, crophotof), os.path.join(photodir, cropdest))
         characters.append(importcharacter(os.path.join(root, dataf),photodest,cropdest))
         
      except Exception as e:
         print(e)
      q = q+1
   else:
      print("Invalid character! Name:" +  dataf +", File: " + photof + ", Croppedfile:" + crophotof)

print("Read " + str(q) + " characters\nWriting JSON")
if os.path.exists("data.js"):
   os.remove("data.js")
f = open("data.js","x")
f.write("var data = {\n\t\"characters\": ")
f.write(json.dumps(characters, indent=4))
f.write("\n}")
f.close()
print("Write succesful, have a nice day!")