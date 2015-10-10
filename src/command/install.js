require('shelljs/global');
rmdir = require('rimraf');
var fs = require('fs');
var InstallCommand = {
	Logger: require('../logger.js'),
	argsLength: 3,
	packageName: '',
	init: function (args) {
		this.getTask(args);
		//TODO - set the bower template file with user input
	},
	getTask:function(args){
		if (args.length - 1 == this.argsLength) {
			this.packageName = args[this.argsLength];
			this.install();
		}
	},
	install:function(){
		//create the bowerrc file
		this.createBowerFolder();
		this.removeProject();
		
	},
	createBowerFolder:function(){
		var dir = './bower_components';
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
	},
	getInstallJSON:function(){
		var filePath = './installed_modules/'+this.packageName+'.json';
		fs.readFile(filePath, 'utf8', this.onGetJSON.bind(this));
	},
	getBowerRCJSON:function(){
		var filePath = './src/bower/bowerrc.json';
		fs.readFile(filePath, 'utf8', this.onGetBowerRCJSON.bind(this));
	},
	getProjectBowerJSON:function(){
		var filePath = './bower_components/'+this.packageName+'/bower.json';
		fs.readFile(filePath, 'utf8', this.onGetProjectBowerJSON.bind(this));
	},
	createBowerRC:function(content){
		content["directory"]="../";
		fs.writeFile('./bower_components/'+this.packageName+'/.bowerrc', JSON.stringify(content, null, 4), this.onBowerFileCreated.bind(this));
	},
	updateVersionNumber:function(content){
		content["version"]="1000.200.200";
		var filePath = './bower_components/'+this.packageName+'/bower.json';
		fs.writeFile(filePath, JSON.stringify(content, null, 4), this.onVersionUpdated.bind(this));
	},
	runBowerInstall:function(){
		cd('./bower_components/'+this.packageName);
		if (exec('bower install').code !== 0) {
			this.Logger.error('Can\'t run bower install' );
		}else{
			this.Logger.ok('Installation Complete' );
		}
	},
	removeProject:function(){
		var dir = './bower_components/'+this.packageName;
		if (!fs.existsSync(dir)){
			this.getInstallJSON();
		}else{
			rmdir(dir, this.onRemoveProject.bind(this));
		}
	},
	getProjectFromGit:function(obj){
		if (exec('git clone -b '+obj.branch+' '+obj.repo+' bower_components/'+this.packageName).code !== 0) {
			this.Logger.error('Can\'t clone repo' );
		}else{
			this.getProjectBowerJSON();
		}
	},
	onRemoveProject:function(err){
		if (err) {
			this.Logger.error('Can\'t remove project folder');
		}else{
			this.getInstallJSON();
		}
	},
	onGetJSON:function(err,data){
		if (err) {
			this.Logger.error('Cant find installation');
		}else{
			var obj = JSON.parse(data);
			this.getProjectFromGit(obj);
		}
	},
	onGetBowerRCJSON:function(err,data){
		if (err) {
			this.Logger.error('Cant find bower template');
		}else{
			var obj = JSON.parse(data);
			this.createBowerRC(obj);
		}
	},
	onGetProjectBowerJSON:function(err,data){
		if (err) {
			this.Logger.error('Cant find bower.json in project');
		}else{
			var obj = JSON.parse(data);
			this.updateVersionNumber(obj);
		}
	},
	onBowerFileCreated:function(err){
		if (err) {
			this.Logger.error('could not create bowerrc');
		}else{
			this.runBowerInstall();
		}
	},
	onVersionUpdated:function(err){
		if (err) {
			this.Logger.error('could not updated version number');
		}else{
			this.getBowerRCJSON();
		}
	}
}

module.exports = InstallCommand.init.bind(InstallCommand);

