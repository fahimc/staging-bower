require('shelljs/global');
var fs = require('fs');
var path = require('path');
var BowerRCCommand = {
	Logger: require('../logger.js'),
	argsLength: 3,
	path: '',
	root: '',
	init: function (args) {
		this.root = path.dirname(require.main.filename);
		this.getTask(args);
	},
	getTask:function(args){
		if (args.length - 1 == this.argsLength) {
			this.path = args[this.argsLength];
			this.save();
		}
	},
	save:function(){
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
		var filePath = this.root+'/src/bower/bowerrc.json';
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

