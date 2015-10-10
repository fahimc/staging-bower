var fs = require('fs');
var path = require('path');
var RegisterCommand = {
	Logger: require('../logger.js'),
	argsLength: 4,
	packageName:'',
	repo:'',
	branch:'staging',
	filePath:'',
	root:'',
	init: function (args) {
		this.root = path.dirname(require.main.filename);
		this.getTask(args);
	},
	getTask: function (args) {
		if (args.length - 1 == this.argsLength) {
			this.packageName = args[this.argsLength - 1];
			this.repo = args[this.argsLength];
			this.createFolder();
		}
	},
	createFolder:function(){
		var dir = this.root+'/installed_modules';
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
		this.install();
	},
	install: function () {
		this.filePath = this.root+'/installed_modules/' + this.packageName + '.json';
		fs.stat(this.filePath, this.onCheckFile.bind(this));
	},
	onCheckFile:function(err, stat){
		if (!err) {
			this.Logger.warn(this.packageName+' is already registered');
		}else{
			var content ={
				packageName:this.packageName,
				repo:this.repo,
				branch:this.branch
			};
			fs.writeFile(this.filePath, JSON.stringify(content, null, 4), this.onFileCreated.bind(this));
		}
	},
	onFileCreated:function(err){
		if (err) {
			this.Logger.error('could not register package');
		}else{
			this.Logger.ok(this.packageName + ' registered successfully');
		}
	}
}

module.exports = RegisterCommand.init.bind(RegisterCommand);

