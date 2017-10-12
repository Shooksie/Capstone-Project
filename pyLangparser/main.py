from Languages.supportedlanguages import LanguageChoice
from Parser.parser import  parser

fileToParse =  open('file.cpp', 'r')

c = parser()

c.setFile(fileToParse)
c.declerativeSimp()

