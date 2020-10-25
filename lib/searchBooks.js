const MongoOpr = require('../lib/dbOpr');
const MongoDB = new MongoOpr('Book');
const Config = require('../config.js')

const searchBooks = async function(query){
	let pos = query.pos;
	let tag = query.tag;
	let city = query.city;
	let filter = query.filter;
	let page = query.page;
	let key = [],value = [];
	if(pos.length == 2){
		key.push('pos');
		value.push({
			room:pos[0],
			floor:pos[1]
		})
	}
	if(tag.length == 2){
		key.push('tab');
		value.push({
			first:tag[0],
			second:tag[1]
		})
	}
	if(city != ''){
		key.push('city');
		value.push(city);
	}
	if(filter != ''){
		if(isNaN(filter)){
			key.push('title');
			value.push({$regex:`${filter}`,$options:"i"});
		}else{
			key.push('ISBN');
			value.push(filter);
		}
	}
	let len = await MongoDB.findMsg({key:key,value:value,limit:20000});
	let res = await MongoDB.findMsg({key:key,value:value,skip:page*10,limit:10});
	//如果本地ip改了，需要修改图片的url
	res.map(item=>{
		item.url = item.url.replace(/http:\/\/.+:3001/i,Config.url)
		return item
	})
	return {
		len:len.length,
		res:res
	}
}

module.exports = searchBooks;