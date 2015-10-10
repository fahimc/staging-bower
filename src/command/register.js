var fs = require('fs');
var RegisterCommand = {
	Logger: require('../logger.js'),
	argsLength: 4,
	packageName:'',
	repo:'',
	branch:'staging',
	filePath:'',
	init: function (args) {
		this.getTask(args);
	},
	getTask: function (args) {
		if (args.length - 1 == this.argsLength) {
			this.packageName = args[this.argsLength - 1];
			this.repo = args[this.argsLength];
			this.install();
		}
	},
	install: function () {
		this.filePath = './installed_modules/' + this.packageName + '.json';
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

