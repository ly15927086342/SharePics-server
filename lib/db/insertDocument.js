const insertDocument = function(db,collectionName,msg,callback){
	let collection = db.collection(collectionName);
	collection.insertOne(msg,function(err,result){
		if(err) throw err;
		console.log('insert success');
		callback(result);
	})
}

module.exports = insertDocument;