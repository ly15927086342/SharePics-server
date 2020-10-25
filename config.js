// 获取本机ip
function getIPAddress(){
	var interfaces = require('os').networkInterfaces();
	for(var devName in interfaces){
		var iface = interfaces[devName];
		for(var i=0;i<iface.length;i++){
			var alias = iface[i];
			if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
				return alias.address;
			}
		}
	}
}

const IPv4 = getIPAddress()

module.exports = {
	StorageRoot:'./static/Storage',
	ThumbnailRoot:'./static/Thumbnail',
	BookRoot:'./static/img/book',
	url:"http://"+IPv4+":3001",
	ip:IPv4,
	port:3001
}