require('shelljs/global');
var fs = require('fs');
var BowerRCCommand = {
	Logger: require('../logger.js'),
	argsLength: 3,
	path: '',
	init: function (args) {
		this.getTask(args);
		//TODO - set the bower template file with user input
	},
	getTask:function(args){
		if (args.length - 1 == this.argsLength) {
			this.path = args[this.argsLength];
			this.save();
		}
	},
	save:function(){
		console.log(this.path);
		if (!fs.existsSync(this.path)){
			this.Logger.error('file does not exist');
		}else{
			this.getBowerRC();
		}
	},
	getBowerRC:function(){
		fs.readFile(this.path, 'utf8', this.onGetRC.bind(this));
	},
	storeRC:function(content){
		content["directory"]="../";
		var filePath = './src/bower/bowerrc.json';
		fs.writeFile(filePath, JSON.stringify(content, null, 4), this.onBowerFileCreated.bind(this));
	},
	onGetRC:function(err,data){
		if (err) {
			this.Logger.error('Cant find bowerrc file');
		}else{
			var obj = JSON.parse(data);
			this.storeRC(obj);
		}
	},
	onBowerFileCreated:function(err){
		if (err) {
			this.Logger.error('Cant create bowerrc template');
		}else{
			this.Logger.ok('Bowerrc template saved');
		}
	}
}

module.exports = BowerRCCommand.init.bind(BowerRCCommand);

