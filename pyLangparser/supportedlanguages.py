import os
import json


class LanguageChoice:

    def __init__(self):
        self.dirlist = os.listdir(path='.')
        self.pyRemover()
        self.getSupported()



    def getSupported(self):
        if 'supported.json' not in self.dirlist:
            self.updateSupported()
            self.supported = self.fileOpener('supported.json')
            return self.supported
        else:
            file = open('supported.json', 'r')
            supdata = json.load(file)
            names =  self.loadNames()
            if supdata['supported'] != names:
                self.updateSupported()
            self.supported = self.fileOpener('supported.json')
            return self.supported

    def loadNames(self):
        data = {}
        for supfile in self.dirlist:
            if supfile  != 'supported.json':
                val = self.fileOpener(supfile)
                data[val['name']] = supfile
        return data

    def updateSupported(self):
        file = open('supported.json', 'w')
        new_data = {'supported': []}
        new_data['supported'] = self.loadNames()
        json.dump(new_data, file)

    def fileOpener(self, filename, read='r'):
        with open(filename, read) as json_data:
            data = json.load(json_data)
            return data
    def pyRemover(self):
        supportedFiles = []
        for file in self.dirlist:
            if (file[-5:] == '.json'):
                supportedFiles.append(file)
        self.dirlist = supportedFiles

