var spawn = require('child_process').spawn;

/*py.stdout.on('data', function(){
  dataString += data.toString();
});

/*Once the stream is done (on 'end') we want to simply log the received data to the console.*/
/*py.stdout.on('end', function(){
  console.log('Sum of numbers=',dataString);
});

py.stdin.write(JSON.stringify(data));

py.stdin.end();*/

class pyBridge {
  constructor() {
    this.connection = spawn('python3', ['./init.py']);
    var data = './pyLangparser/';
    this.supported = {};
    this.code = {};
    this.loading = true;
    this.connection.stdout.on('data', function(data){
      this.supported = JSON.parse(data);
    });
    this.connection.stdout.on('end', function(){
        console.log(this.supported);
    });
    this.connection.stdin.write(JSON.stringify(data));
    this.connection.stdin.end();
  }
  parseFile(toParse, excute) {
    this.connection = spawn('python3', ['./parser.py']);
    var data = ['C++', toParse];
    this.connection.stdout.on('data', function(data){
      this.code = JSON.parse(data);
    });
    this.connection.stdout.on('end', function(){
      this.loading = false;
      console.log(this.code);
      excute(this.code)
      //console.log(this.code);
      console.log('finished');
      return true;
    });
    this.connection.stdin.write(JSON.stringify(data));
    this.connection.stdin.end();
  }

  getCode() {
    return this.code;
  }
};

module.exports = pyBridge;
//start.js
/**var spawn = require('child_process').spawn,
    py    = spawn('python3', ['./init.py']),
    data = './pyLangparser/',
    dataString = {};
py.stdout.on('data', function(data){
  dataString = JSON.parse(data);
});
py.stdout.on('end', function(){
    console.log(dataString);
});
py.stdin.write(JSON.stringify(data));
py.stdin.end();
**/
