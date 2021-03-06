#include <fstream>
#include <iostream>
#include <string>
#include "utils.h"

using namespace std;

void getUsers(ifstream& ifs, User* &allUsers, int& nbrUsers, int& currentSize){

	if (ifs.fail())
	{
		throw UserException("Could not open the user file for reading.");
	}

	//While loop for reading in users and checkouts
	while (!ifs.eof())
	{
		//Check the array size.  If the current index is the max capacity of the array, resize the user array.
		if (nbrUsers == currentSize)
		{
			currentSize = expand(allUsers, nbrUsers);
		}

		User newUser;

		//Get the user info from the text file
		ifs >> newUser;
		
		//Make use of the assingment overload here.  Deep copies the user into the array.
		allUsers[nbrUsers] = newUser;

		//Since we added a user, increment the number of users count
		nbrUsers++;

		//The destructor will be called when we are out of scope bc the compiler thinks we don't need the user anymore.
		//The deep copy works around this.
	}
}
void checkIns(ifstream& cir, User* &allUsers, int& nbrUsers) throw(UserException){

	if (cir.fail())
	{
		throw UserException("Could not open check ins for reading.");
	}

	//Read the isbns to be checked back in
	while (!cir.eof())
	{
		//Capture each isbn number as we loop through the text file
		bool found = false;
		string isbn;
		cir >> isbn;

		//Try to check in each isbn for all users.
		//If the user has the isbn in his check outlist, it is removed, otherwise, do nothing.
		for (int i = 0; i < nbrUsers; i++)
		{
			if (allUsers[i].CheckIn(isbn))
			{
				found = true;
				break;
			} 
		}

		if (!found)
		{
			cerr << "No user could be found for ISBN " << isbn << endl;
		}
	}
}
void checkOuts(ifstream& cor, User* &allUsers, int& nbrUsers) throw(UserException){

	if (cor.fail())
	{
		throw UserException("Could not open check outs for reading.");
	}

	while (!cor.eof())
	{
		bool found = false;
		unsigned int id;
		string isbn;

		cor >> id;
		cor >> isbn;

		for (int i = 0; i < nbrUsers; i++)
		{
			if (allUsers[i].getid() == id)
			{
				found = true;
				allUsers[i].CheckOut(isbn);
				break;
			}
		}

		if (!found)
		{
			cerr <<"ID " << id << " does not exist in our records." << endl;
		}
	}
}
void outputToFile(ofstream& fout, User* &allUsers, int& nbrUsers) throw(UserException){

	if (fout.fail())
	{
		throw UserException("Could not open file for output.");
	}

	//Print the updated user array to the output file.
	for (int i = 0; i < nbrUsers; i++)
	{
		fout << allUsers[i];
	}
}

int expand(User* &oldArray, int oldSize){

	int newsize = oldSize * 2;

	User *newArray = new User[newsize];

	for (int i = 0; i < oldSize; i++)
	{
		newArray[i] = oldArray[i];
	}

	delete[] oldArray;
	oldArray = newArray;

	return newsize;
}