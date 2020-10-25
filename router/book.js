const router = require('koa-router')();
const searchBooks = require('../lib/searchBooks');
const borrowBook = require('../lib/borrowBook');
const MongoOpr = require('../lib/dbOpr');
const MongoDB = new MongoOpr('User');
const MongoDB_book = new MongoOpr('Book');

//判断是否登录
router.use(async (ctx,next)=>{
	if (!ctx.session.user) {
		ctx.status = 403;
	}
	await next();
});

//查找book
router.get('/search',async (ctx,next)=>{
	let query = JSON.parse(ctx.query.query)
	let res = await searchBooks(query);
	ctx.body = res;
});

//还book
router.post('/return',async(ctx,next)=>{
	let ISBN = ctx.request.body.ISBN;
	let user = ctx.request.body.user;
	//更新user表中的借阅历史
	let res1 = await MongoDB.findMsg({key:['name'],value:[user]});
	let his = res1[0].history;
	let index = his.findIndex(item=>{
		return item.ISBN == ISBN;
	})
	if(index > -1){
		his.splice(index,1);
	}
	await MongoDB.updateMsg({
		wherekey:['name'],
		wherevalue:[user],
		updatekey:['history'],
		updatevalue:[his]
	});
	//更新book表中的借阅历史
	let res2 = await MongoDB_book.findMsg({key:['ISBN'],value:[ISBN]});
	let his2 = res2[0].history;
	his2[0].returntime = new Date().getTime();
	await MongoDB_book.updateMsg({
		wherekey:['ISBN'],
		wherevalue:[ISBN],
		updatekey:['history'],
		updatevalue:[his2]
	});
	ctx.body = {code:0}
})

//借book
router.post('/borrow',async (ctx,next)=>{
	let ISBN = ctx.request.body.ISBN;
	let user = ctx.request.body.user;
	let book = ctx.request.body.title;
	let pos = ctx.request.body.pos;
	let bookres = await MongoDB_book.findMsg({key:['ISBN'],value:[ISBN]});
	let hisbook = bookres[0].history;
	if(hisbook.length > 0 && hisbook[0].returntime == null){//已借阅
		ctx.body = {code:1,name:hisbook[0].name};
	}else{
		let res = await MongoDB.findMsg({key:['name'],value:[user]});
		let his = res[0].history;
		let time = new Date().getTime();
		his.unshift({
			title:book,
			ISBN:ISBN,
			pos:pos,
			borrowtime:time
		})
		let updateres = await MongoDB.updateMsg({
			wherekey:['_id'],
			wherevalue:[res[0]._id],
			updatekey:['history'],
			updatevalue:[his]
		})
		let bookinfo = {
			borrowtime:time,
			returntime:null,
			name:user,
			_id:res[0]._id
		}
		hisbook.unshift(bookinfo)	
		let borrowres = await borrowBook(hisbook,ISBN);
		ctx.body = {code:0,res:bookinfo};
	}
});

module.exports = router;