const fs = require('fs');
const path = require('path');
const Config = require('../config.js');
const gm = require('gm');

const uploadBookIMG = function(file){
	return new Promise((resolve,reject)=>{
		let readStream = fs.createReadStream(file.path);
		let pa = Config.BookRoot + '/' + file.name;
		try{
			gm(readStream)
			.resize(300, 300)
			.write(pa, function (err) {
				resolve({
					url:'http://'+Config.ip+':'+Config.port+'/'+path.join(pa).replace(/\\/g,'\/'),
					code:0
				})
			});
		}catch(err){
			resolve({
				code:1
			})
		}		
	})
}

module.exports = uploadBookIMG;