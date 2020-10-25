const router = require('koa-router')();
const createDirectory = require('../lib/createDirectory');
const deleteDir = require('../lib/deleteDir');
const MongoOpr = require('../lib/dbOpr');
const MongoDB = new MongoOpr('File');

//判断是否登录
router.use(async (ctx,next)=>{
	if (!ctx.session.user) {
		ctx.status = 403;
	}
	await next();
});

//创建文件夹
router.post('/create',async (ctx)=>{
  const rb = ctx.request.body;
  let res = createDirectory(rb.path,rb.name,rb.user);
  ctx.response.body = {res:res};
})

//删除文件夹
router.delete('/delete/:name',async (ctx,next) => {
	let dirname = ctx.params.name;
	let dirpath = ctx.query.path;
	let user = ctx.query.user;
	let dres = deleteDir(dirname,dirpath);
	dres.then(res=>{
		ctx.body = {
			code:0
		}
	}).catch(err=>{
		ctx.body = {
			code:1,
			message:err
		}
	})
	await next();
});

module.exports = router;

