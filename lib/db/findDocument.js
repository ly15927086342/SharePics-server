const findDocument = function(db,collectionName,msg,callback){
	let collection = db.collection(collectionName);
	let whereobj = {};
	msg.key.forEach((item,index)=>{
		whereobj[item] = msg.value[index]
	})
	collection.find(whereobj).limit(msg.limit ? msg.limit : 100).skip(msg.skip ? msg.skip : 0).toArray(function(err,docs){
		if(err) throw err;
		callback(docs)
	})
}

module.exports = findDocument;