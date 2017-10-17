from Parser.parser import parser
from supportedlanguages import LanguageChoice

fileToParse =  open('file.cpp', 'r')

langSup = LanguageChoice()
supported = langSup.getSupported()

print('choose a value for languages bellow')
for key in supported['supported']:
    print(key)

print()
val = input("enter the name of the language you want to check > ")
fileObj = langSup.fileOpener(supported['supported'][val])
c = parser()
c.setLang(fileObj)
c.setFile(fileToParse)
c.simplify()

