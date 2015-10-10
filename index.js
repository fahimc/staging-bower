#!/usr/bin/env node
var StagingBower = {
	commandIndex:2,
	command:{
		register:require('./src/command/register.js'),
		install:require('./src/command/install.js'),
		bowerrc:require('./src/command/bowerrc.js')
	},
	init: function () {
		this.checkCommand();
	},
	checkCommand:function(){
		if (process.argv.length > this.commandIndex) {
			var cmd = process.argv[this.commandIndex];
			if(this.command[cmd]){
				this.command[cmd](process.argv);
			}
		}
	}
};
StagingBower.init();
//npm -g install .

