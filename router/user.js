const router = require('koa-router')();
const MongoOpr = require('../lib/dbOpr');
const MongoDB = new MongoOpr('User');

//获取所有成员
router.get('/getAll',async (ctx,next)=>{
	if (!ctx.session.user) {
		ctx.status = 403;
		ctx.body = {
			msg:'未登录'
		}
	}else{
		await next();
	}},async(ctx,next)=>{
		let res = await MongoDB.findMsg({key:[],value:[]});
		if(res.length == 0){
			ctx.body = {
				code:2,
				msg:'无成员'
			}
		}else{
			ctx.body = {
				code:0,
				users:res.map(item=>{
					return {
						name:item.name,
						role:item.role,
						sex:item.sex,
						isregister:item.isregister
					}
				})
			}
		}
	})

//验证登录
router.get('/islogin',async (ctx,next) => {
	if (!ctx.session.user) {
		ctx.status = 403;
		ctx.body = {
			msg:'未登录'
		}
	}else{
		ctx.body = {
			msg:'已登录'
		}
	}	
})

//借阅历史
router.get('/history',async(ctx,next) =>{
	let name = ctx.query.user;
	let res = await MongoDB.findMsg({key:['name'],value:[name]});
	if(res.length > 0){
		ctx.body = {
			history:res[0].history
		}
	}
})

//登录
router.post('/login',async (ctx,next) => {
	let name = ctx.request.body.name;
	let pwd = ctx.request.body.password;
	let res = await MongoDB.findMsg({key:['name'],value:[name]});
	if(res.length == 0){
		ctx.body = {
			code:2,
			msg:'该用户不存在'
		}
	}else if(res[0].password == pwd){
		ctx.session.user = name;
		ctx.body = {
			code:0,
			info:{
				name:res[0].name,
				role:res[0].role,
				isgraduate:res[0].isgraduate
			}
		}
	}else{
		ctx.body = {
			code:1,
			msg:'密码错误'
		}
	}
})

//登出
router.post('/logout',async (ctx,next) => {
	// let name = ctx.request.body.name;
	// MongoDB.updateMsg({
	// 	wherekey:'name',
	// 	wherevalue:name,
	// 	updatekey:['isonline'],
	// 	updatevalue:[false]
	// })
	// 将登录信息清空
	ctx.session = null;
	ctx.body = {
		code:0
	}
})

//注册
router.post('/register',async (ctx,next) => {
	let name = ctx.request.body.name;
	let pwd = ctx.request.body.password;
	let sex = ctx.request.body.sex;
	let res = await MongoDB.findMsg({key:['name'],value:[name]});
	if(res.length == 0){
		ctx.body = {
			code:2,
			msg:'数据库暂不存在该用户'
		}
	}else if(!res[0].isregister){
		MongoDB.updateMsg({
			wherekey:['_id'],
			wherevalue:[res[0]._id],
			updatekey:['password','isregister','sex','history'],
			updatevalue:[pwd,true,sex,[]]
		})
		ctx.body = {
			code:0
		}
	}else{//已注册
		ctx.body = {
			code:1,
			msg:'该用户已注册'
		}
	}
})

module.exports = router;