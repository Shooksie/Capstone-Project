// Josh Gregory
// CS 451r
// Fall 2017
// Prof. Kendall Bingham

#include <fstream>
#include <unordered_set>
#include <functional>
#include <node.h>

#include <iostream>
#include <vector>
#include <map>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::Persistent;
using v8::String;
using v8::Value;


struct line {
	string str = "";
	size_t hashVal = 0;
	int similar = 0;
};

struct overall {
	double copied = 0;
	double total = 0;
	double percent = 0;
};

void initiate(istream& in, map<int, line>& inMap)
{
	int lineNum = 1;
	string tempStr;

	while (getline(in, tempStr))
	{
		line ln;
		ln.str = tempStr;
		ln.hashVal = hash<string>{}(tempStr);
		inMap.insert(pair<int, line>(lineNum, ln));
		lineNum++;
	}
}

void MOSS(map<int, line>& aMap, map<int, line>& bMap, overall& stats)
{
	for (map<int, line>::iterator iter = aMap.begin(); iter != aMap.end(); iter++)
	{
		for (map<int, line>::iterator iter2 = bMap.begin(); iter2 != bMap.end(); iter2++)
		{
			if ((*iter).second.hashVal == (*iter2).second.hashVal)
			{
				(*iter).second.similar = (*iter2).first;
				stats.copied++;
			}
		}
		stats.total++;
	}
	stats.percent = stats.copied / stats.total * 100;
}

void print(map<int, line>& outMap, overall& stats)
{
	cout << stats.percent << "% plagiarised\n";
	for (map<int, line>::iterator iter = outMap.begin(); iter != outMap.end(); iter++)
	{
		cout << (*iter).first << ":\t" <<
			(*iter).second.hashVal << "\t" <<
			(*iter).second.str << "\n";
		if ((*iter).second.similar != 0)
		{
			cout << "~copy of line: " << (*iter).second.similar << endl;
		}
	}
	system("pause");
}

void printHTML(map<int, line>& outMap, overall& stats)
{
	ofstream fout("output.txt");

	if (fout.fail())
	{
		exit(1);
	}

	fout << "<p><strong>Measure Of Software Similarity: " << stats.percent << "% plagiarised</strong></p>\n";

	for (map<int, line>::iterator iter = outMap.begin(); iter != outMap.end(); iter++)
	{
		if ((*iter).second.similar == 0)
		{
			fout << "<div style=\"background-color: #bef5cb;\"><p>";
		}
		else
		{
			fout << "<div style=\"background-color: #fdaeb7;\"><p>";
		}
		fout << (*iter).first << ":\t" <<
			(*iter).second.str << "</p></div>\n";
	}

	fout.close();
}

string parseFiles(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

 // Check the number of arguments passed.
 if (args.Length() < 2) {
   // Throw an Error that is passed back to JavaScript
   isolate->ThrowException(Exception::TypeError(
       String::NewFromUtf8(isolate, "Wrong number of arguments")));
   return;
 }
 if (!args[0]->IsString() || !args[1]->IsString()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "Wrong arguments")));
    return;
  }
  std::vector<String> array1;
  std::vector<String> array2;
  Local<Array> input1 = Local<Array>::Cast(args[0]);
    unsigned int num_locations = input->Length();
    for (unsigned int i = 0; i < num_locations; i++) {
      array1.push_back(
             unpack_location(isolate, Local<Object>::Cast(input->Get(i))));
  }
  Local<Array> input2 = Local<Array>::Cast(args[0]);
    unsigned int num_locations = input->Length();
    for (unsigned int i = 0; i < num_locations; i++) {
      array2.push_back(
             unpack_location(isolate, Local<Object>::Cast(input->Get(i))));
  }
  map<int, line> aMap;
	map<int, line> bMap;
  initiate(input1, aMap);
	initiate(input2, bMap);
	overall stats;
	MOSS(aMap, bMap, stats);
	printHTML(aMap, stats);
}
int main()
{
	ifstream afin("input.txt"), bfin("input2.txt");
	if (afin.fail() || bfin.fail())
	{
		exit(1);
	}

	map<int, line> aMap;
	map<int, line> bMap;
	overall stats;

	initiate(afin, aMap);
	initiate(bfin, bMap);

	MOSS(aMap, bMap, stats);

	printHTML(aMap, stats);

	afin.close();
	bfin.close();
	return 0;
}

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Local<Object> obj = Object::New(isolate);
  obj->Set(String::NewFromUtf8(isolate, "msg"), args[0]->ToString());

  args.GetReturnValue().Set(obj);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateFunction);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}
