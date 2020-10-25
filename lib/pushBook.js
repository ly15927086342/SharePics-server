const MongoOpr = require('../lib/dbOpr');
const MongoDB = new MongoOpr('Book');

const pushBook = async function(data){
	let res = await MongoDB.findMsg({key:['ISBN'],value:[data.ISBN]});
	if(res.length > 0){//该书已入库
		return 1;
	}else{
		return new Promise((resolve,reject)=>{
			MongoDB.insertMsg({
				ISBN:data.ISBN == "" ? new Date().getTime() : data.ISBN,
				title:data.title,
				author:data.author,
				pos:{
					room:data.pos[0],
					floor:data.pos[1]
				},
				history:[],
				tab:{
					first:data.tab[0],
					second:data.tab[1]
				},
				city:data.city,
				url:data.url,
				summary:data.summary,
				uploader:data.uploader,
				uploadtime:new Date().getTime()
			})
			resolve(0)
		})
	}
}

module.exports = pushBook;