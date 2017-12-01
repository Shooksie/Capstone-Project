import sys, json, numpy as np

from Parser.parser import parser
from supportedlanguages import LanguageChoice

fileToParse =  open('utils.cpp', 'r').read()

langSup = LanguageChoice()
supported = langSup.getSupported()


print('choose a value for languages bellow')
for key in supported['supported']:
    print(key)

print()
val = input("enter the name of the language you want to check > ")
fileObj = langSup.fileOpener(supported['supported'][val])

fileToParse = fileToParse
c = parser()
c.setLang(fileObj)
c.setFile(fileToParse)
c.simplify()
with open('temp.txt', 'w') as EX:

    EX.write(c.newCode)
