const fs = require('fs');
const path = require('path');
const Config = require('../config.js');
const deleteAll = require('./deleteAll');

const deleteDir = function(dirname,dirpath){
	let dirpathStorage = Config.StorageRoot + `${dirpath}${dirname}`;
	let dirpathThumb = Config.ThumbnailRoot + `${dirpath}${dirname}`;
	return new Promise((resolve,reject)=>{
		deleteAll(dirpathStorage,1);
		deleteAll(dirpathThumb,0);
		resolve();
	})
}

module.exports = deleteDir;