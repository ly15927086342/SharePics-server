const deleteDocument = function(db,collectionName,msg,callback){
	let collection = db.collection(collectionName);
	let del = {}
	msg.key.forEach((item,index)=>{
		del[item] = msg.value[index]
	})
	collection.deleteMany(del,function(err,res){
		if(err) throw err;
		callback(res);
	})
}

module.exports = deleteDocument;