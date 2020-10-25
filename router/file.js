const router = require('koa-router')();
const send = require('koa-send');
const uploadFiles = require('../lib/uploadFiles');
const searchAllFiles = require('../lib/searchAllFiles');
const deleteFile = require('../lib/deleteFile');
const Config = require('../config.js');
const MongoOpr = require('../lib/dbOpr');
const MongoDB = new MongoOpr('File');

//判断是否登录
router.use(async (ctx,next)=>{
	if (!ctx.session.user) {
		ctx.status = 403;
		ctx.body = {
			msg:'未登录'
		}
	}else{
		await next();
	}	
});

//文件下载
router.get('/download/:name', async (ctx,next) => {
	let name = ctx.params.name;
	let path = ctx.query.path;
	let user = ctx.query.user;
	const pathname = Config.StorageRoot + `${path}${name}`;
	let res = await MongoDB.findMsg({key:['path','name'],value:[Config.StorageRoot+path,name]});
	if(res.length > 0){
		MongoDB.updateMsg({
			wherekey:['_id'],
			wherevalue:[res[0]._id],
			updatekey:['downloadcount'],
			updatevalue:[++res[0].downloadcount]
		})
		ctx.attachment(pathname);
		await send(ctx, pathname);
	}
});

//删除文件
router.delete('/delete/:name',async (ctx,next) => {
	let filename = ctx.params.name;
	let filepath = ctx.query.path;
	let user = ctx.query.user;
	let dres = deleteFile(filename,filepath);
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
});

// 上传单个或多个文件
router.post('/upload', async (ctx,next) => {
	let files = ctx.request.files.file;
	let pathname = ctx.request.body.pathname;
	let user = ctx.request.body.user;
	console.log(user)
	let flag = false;
	if (files.length === undefined) {// 上传单个文件，它不是数组，只是单个的对象
		flag = false;
	} else {
		flag = true;
	}

	let p = [];
	if (flag) {
    	// 多个文件上传
    	for (let i = 0; i < files.length; i++) {
    		const f1 = files[i];
    		p.push(uploadFiles(f1,pathname,user));
    	}
    } else {
    	p.push(uploadFiles(files,pathname,user));
    }

    await Promise.all(p).then(res=>{
    	ctx.body = {
    		code: 0,
    		message: '上传成功',
    		res:res
    	};
    });
});

//获取文件夹下所有文件
router.post('/getAll', async (ctx,next)=>{
	const rb = ctx.request.body;
	console.log(rb)
	ctx.response.body = await searchAllFiles(rb);
});

module.exports = router;