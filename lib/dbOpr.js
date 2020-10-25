const MongoClient = require('mongodb').MongoClient;
const { url, dbName, collectionName_User, option } = require('./MongoCfg.js');
const clearCollection = require('./db/clearCollection');
const deleteDocument = require('./db/deleteDocument');
const findDocument = require('./db/findDocument');
const getAllDocuments = require('./db/getAllDocuments');
const insertDocument = require('./db/insertDocument');
const insertDocuments = require('./db/insertDocuments');
const updateDocument = require('./db/updateDocument');


//用集合名对数据库操作类进行初始化
class MongoOpr{
	constructor(collectionName){
		this.CN = collectionName;
	}
	insertMsg(msg){
		MongoClient.connect(url,option,(err,client)=>{
			if(err) throw err;
			console.log('connect to db server');
			let db = client.db(dbName);
			insertDocument(db,this.CN,msg,(res)=>{
				// console.log(res)
				client.close()
			})
		})
	}
	insertMsgs(msg){
		MongoClient.connect(url,option,(err,client)=>{
			if(err) throw err;
			console.log('connect to db server');
			let db = client.db(dbName);
			insertDocuments(db,this.CN,msg,(res)=>{
				// console.log(res)
				client.close()
			})
		})
	}
	deleteMsg(msg){
		MongoClient.connect(url,option,(err,client)=>{
			if(err) throw err;
			let db = client.db(dbName);
			deleteDocument(db,this.CN,msg,(res)=>{
				// console.log(res)
				client.close()
			})
		})
	}
	clearMsg(){
		MongoClient.connect(url,option,(err,client)=>{
			if(err) throw err;
			let db = client.db(dbName);
			clearCollection(db,this.CN,(res)=>{
				// console.log(res)
				client.close()
			})
		})
	}
	findMsg(msg){
		return new Promise((resolve,reject)=>{
			MongoClient.connect(url,option,(err,client)=>{
				if(err) throw err;
				let db = client.db(dbName);
				findDocument(db,this.CN,msg,(res)=>{
					client.close();
					resolve(res);
				})
			})
		})
	}
	async getAllMsg(){
		return await new Promise((resolve,reject)=>{
			MongoClient.connect(url,option,(err,client)=>{
				if(err) throw err;
				let db = client.db(dbName);
				getAllDocuments(db,this.CN,(res)=>{
					client.close()
					resolve(res)
				})
			})
		})
	}
	updateMsg(msg){
		MongoClient.connect(url,option,(err,client)=>{
			if(err) throw err;
			let db = client.db(dbName);
			updateDocument(db,this.CN,msg,(res)=>{
				client.close()
			})
		})
	}
}

module.exports = MongoOpr;