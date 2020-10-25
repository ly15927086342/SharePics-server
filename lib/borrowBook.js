const MongoOpr = require('../lib/dbOpr');
const MongoDB = new MongoOpr('Book');

// title:book,
// ISBN:ISBN,
// pos:pos,
// borrowtime:time

const borrowBook = async function(result,ISBN){
	let res2 = await MongoDB.updateMsg({
		wherekey:['ISBN'],
		wherevalue:[ISBN],
		updatekey:['history'],
		updatevalue:[result]
	})
}

module.exports = borrowBook;