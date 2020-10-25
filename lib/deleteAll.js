const fs = require('fs');
const path = require('path');
const Config = require('../config.js');
const MongoOpr = require('../lib/dbOpr');
const MongoDB = new MongoOpr('File');

const deleteAll = function(path,type) {
	console.log(path,type)
	var files = [];
	if(fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function(file, index) {
			var curPath = path + "/" + file;
			if(fs.statSync(curPath).isDirectory()) { // recurse
				deleteAll(curPath,type);
			} else { // delete file
				if(type == 1){
					console.log(path,file)
					MongoDB.deleteMsg({
						key:['path','name'],
						value:[path+'/',file]
					})
				}				
				fs.unlinkSync(curPath);
			}
		});
		let p = path.substring(0,path.lastIndexOf('/')+1);
		let n = path.substring(path.lastIndexOf('/')+1);
		if(type == 1){
			console.log(p,n)
			MongoDB.deleteMsg({
				key:['path','name'],
				value:[p,n]
			})
		}
		fs.rmdirSync(path);
	}
};

module.exports = deleteAll;