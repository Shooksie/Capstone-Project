import os
import json


class LanguageChoice:

    def __init__(self):
        self.dirlist = os.listdir(path='.')
        self.dirlist.remove('supportedlanguages.py')

    def printDir(self):
        print(self.dirlist)
    def getSupported(self):
        if 'supported.json' not in self.dirlist:
            self.updateSupported()
        else:
            file = open('supported.json', 'r')
            supdata = json.load(file)
            names =  self.loadNames()
            if supdata['supported'] == names:
                print('they equal')
            else:
                print('they are not equal')
                self.updateSupported()

    def loadNames(self):
        data = []
        for supfile in self.dirlist:
            if supfile  != 'supported.json':
                val = self.fileOpener(supfile)
                data.append(val['name'])
        return data

    def updateSupported(self):
        file = open('supported.json', 'w')
        new_data = {'supported': []}
        new_data['supported'] = self.loadNames()
        json.dump(new_data, file)

    def fileOpener(self, filename):
        with open(filename, 'r') as json_data:
            data = json.load(json_data)
            return data


