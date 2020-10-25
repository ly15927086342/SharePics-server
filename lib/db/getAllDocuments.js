const getAllDocuments = function(db,collectionName,callback){
	let collection = db.collection(collectionName);
	collection.find().toArray(function(err,docs){
		if(err ) throw err;
		callback(docs)
	})
}

module.exports = getAllDocuments;