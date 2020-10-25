const updateDocument = function(db,collectionName,msg,callback){
	let collection = db.collection(collectionName);
	let whereobj = {};
	let setobj = {};
	msg.wherekey.forEach((item,index)=>{
		whereobj[item] = msg.wherevalue[index]
	})
	msg.updatekey.forEach((item,index)=>{
		setobj[item] = msg.updatevalue[index]
	})
	collection.updateOne(whereobj,
		{$set:setobj},
		function(err,result){
			if(err) throw err;
			console.log('update success');
			callback(result);
		})
}

module.exports = updateDocument;