
import sys, json, numpy as np
from pyLangparser.supportedlanguages import LanguageChoice

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return str(lines)

def main():
    #get our data as an array from read_in()
    lines = read_in()
    langSup = LanguageChoice('./pyLangparser/')
    supported = langSup.getSupported()

    #return the sum to the output stream
    #print(supported['supported'])
    print(json.dumps(supported['supported']))

#start process
if __name__ == '__main__':
    main()
