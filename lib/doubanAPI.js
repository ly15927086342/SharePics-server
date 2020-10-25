const axios = require('axios');
const xml2js = require('xml2js');

const doubanAPI = function(ISBN){
	return new Promise((resolve,reject)=>{
		axios.get('https://api.douban.com/book/subject/isbn/'+ISBN,{
			params:{
				apikey:'0df993c66c0c636e29ecbb5344252a4a'
			},
			headers:{
				'Content-Type':'text/xml; charset=UTF-8'
			}
		}).then(res=>{
			let parser = new xml2js.Parser();
			parser.parseString(res.data,function(err,result){
				if(err) return;
				// console.log(result)
				resolve(result)
			})
		}).catch(err=>{
			resolve(null)
		})
	})
}

module.exports = doubanAPI;