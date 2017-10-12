

class parser:

    def __init__(self):
        self.langObj = {}
        self.fileToSimp = ""
    def setLang(self, val):
        self.langObj = val
        return

    def setFile(self, val):
        self.fileToSimp = val
        return

    def simplify(self):
        if self.langObj['type'] == 'declerative-OOP':
            self.declerativeSimp()
        return
    def declerativeSimp(self):
        for line in self.fileToSimp:
            value = line.split()
            if len(value) > 0:
                print(value)
        return