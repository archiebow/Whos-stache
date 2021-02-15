from openpyxl import load_workbook
import json

wb = load_workbook(filename = 'data.xlsx')
sheet = wb['Taulukko1']

character = {
    'name':
    'bio':
    'questions' : []
    'funfacts' : []
    'tags' : []

}

row = 1
while True:
    if sheet['A'+str(row)].value == None:
        break
    switch(sheet['A'+str(row)].value.lower)
    case 'name': character.name = sheet['B'+str(row)]
    case 'bio': character.bio = sheet['B'+str(row)]
    case 'Q': questions.append({
        question : sheet['B'+str(row)]
        anwertext : sheet['C'+str(row)]
    })
    default break
    row = row+1