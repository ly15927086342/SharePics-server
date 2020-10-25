const router = require('koa-router')();
const MongoOpr = require('../lib/dbOpr');
const MongoDB = new MongoOpr('Book');
const doubanAPI = require('../lib/doubanAPI');
const uploadBookIMG = require('../lib/uploadBookIMG');
const pushBook = require('../lib/pushBook');

//判断是否登录，这里不能验证，因为用的是自带的上传，不是axios
// router.use(async (ctx,next)=>{
// 	if (!ctx.session.user) {
// 		ctx.status = 403;
// 		ctx.body = {
// 			msg:'未登录'
// 		}
// 	}else{
// 		await next();
// 	}	
// });

//上传书籍信息
router.post('/push',async (ctx)=>{
	let data = ctx.request.body.data;
	// let res = await uploadBookIMG(file);
	let res = await pushBook(data);
	ctx.response.body = res;
})

//上传书籍封面
router.post('/uploadIMG',async (ctx)=>{
	let file = ctx.request.files.file;
	let res = await uploadBookIMG(file);
	ctx.response.body = res;
})

//查询书籍信息
router.post('/search',async (ctx)=>{
	const rb = ctx.request.body;
	let m = await doubanAPI(rb.ISBN);
	if(m){
		ctx.response.body = {
			code:0,
			res:
			{
				title:m.entry.title[0],
				summary:m.entry.summary ? m.entry.summary[0] : '',
				// tab:m.entry['db:tag'].map(item=>{return item.$.name}),
				author:m.entry.author ? m.entry.author.map(item=>{return item.name}) : [],
				url:m.entry.link[6].$.href
			}
		};
	}else{
		ctx.response.body = {
			code:1
		}
	}
})

module.exports = router;