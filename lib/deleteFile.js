const fs = require('fs');
const path = require('path');
const Config = require('../config.js');
const MongoOpr = require('../lib/dbOpr');
const MongoDB = new MongoOpr('File');

const deleteFile = function(filename,filepath){
	let storagepath = Config.StorageRoot + `${filepath}${filename}`;
	let thumbnailpath = Config.ThumbnailRoot + `${filepath}${filename}`;
	let extname = path.extname(storagepath);
	MongoDB.deleteMsg({
		key:['path','name'],
		value:[Config.StorageRoot + `${filepath}`,`${filename}`]
	})

	return new Promise((resolve,reject)=>{
		if(['.png','.jpg','.jpeg'].includes(extname.toLowerCase())){
			if(fs.existsSync(thumbnailpath)){
				fs.unlinkSync(thumbnailpath);
			}
		}
		if(fs.existsSync(storagepath)){
			fs.unlinkSync(storagepath);
		}
		resolve();
	})
}

module.exports = deleteFile;