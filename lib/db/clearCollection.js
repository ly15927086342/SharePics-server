const clearCollection = function(db,collectionName,callback){
	let collection = db.collection(collectionName);
	collection.deleteMany({},function(err,result){
		if(err) throw err;
		callback(result);
	})
}

module.exports = clearCollection;