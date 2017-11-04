

def createTabs(tabounter):
    tabs = ''
    for i in range(0, tabounter):
        tabs += '\t'
    return tabs

class parser:

    def __init__(self):
        self.langObj = {}
        self.variableObj = {}
        self.translateObj = {}
        self.fileToSimp = ""
        self.varCounter = 1
        self.tabCounter = 0
    def setLang(self, val):
        self.langObj = val
        return

    def setFile(self, val):
        with open('tempfile.txt', 'w') as toWrite:
            toWrite.write(val)
        toRead =  open('tempfile.txt', 'r')
        self.fileToSimp = toRead
        return

    def simplify(self):
        if self.langObj['type'] == 'declerative-OOP':
            return self.declerativeSimp()

    def declerativeSimp(self):
        self.newCode = ''
        for line in self.fileToSimp:
            splitline = line.split()
            self.declartiveLine(splitline )
        return [self.newCode, self.variableObj]
    def declartiveLine(self, line):
        varbool = False
        for i in range(0, len(line)):
            if not varbool and line[i] in self.langObj['common-datatype']:
                varbool = True
                if i == 0:
                    self.newCode += createTabs(self.tabCounter)
                self.newCode +=  line[i] + ' '
            elif line[i] in self.langObj['conditionals']:
                self.newCode += createTabs(self.tabCounter) + line[i] + ' '
            elif line[i] in self.variableObj:
                if i == 0:
                    self.newCode += createTabs(self.tabCounter)
                self.newCode +=  self.variableObj[line[i]] + ' '
            elif varbool:
                self.variableObj[line[i]] = 'variable'+ str(self.varCounter)
                self.translateObj[('variable'+str(self.varCounter))] = line[i]
                self.newCode += ('variable'+str(self.varCounter)) + ' '
                self.varCounter += 1
                if line[i+1] == '=' and i < len(line) - 1:
                    varbool = False
            elif line[i] == '{':
                self.newCode += '{'
                self.tabCounter += 1
            elif line[i] == '}':
                self.tabCounter -= 1
                self.newCode += createTabs(self.tabCounter) + '}'
            else:
                self.newCode += line[i] + ' '
        self.newCode +='\n'
