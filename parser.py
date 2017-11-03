import sys, json, numpy as np

from pyLangparser.Parser.parser import parser
from pyLangparser.supportedlanguages import LanguageChoice


def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():


    #get our data as an array from read_in()
    lines = read_in()

    fileType = lines[0]
    fileToParse = lines[1]
    langSup = LanguageChoice('./pyLangparser/')
    supported = langSup.getSupported()
    fileObj = langSup.fileOpener('./pyLangparser/'+ supported['supported'][fileType])
    c = parser()
    c.setLang(fileObj)
    c.setFile(fileToParse)
    val = c.simplify()
    print(json.dumps(val))
    #return the sum to the output stream
    #print(json.dumps(supported['supported']))
    #print(lines)'''

#start process
if __name__ == '__main__':
    main()
