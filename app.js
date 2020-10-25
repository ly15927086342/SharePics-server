'use strict'

const Koa = require('koa');
const path = require('path');
const router = require('./router/index');
const koaBody = require('koa-body');
const serve = require('koa-static');
const cors = require('koa2-cors');
const session = require('koa-session');
const Config = require('./config.js');
const app = new Koa();

//强制https
// app.use(enforceHttps());

app.keys = ['never mind, just test'];

//设置session
app.use(session({
  key: 'koa:sess', /** cookie的名称，可以不管 */
  maxAge: 7200000, /** (number) maxAge in ms (default is 1 days)，cookie的过期时间，这里表示2个小时 */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
},app));

//设置跨域参数
app.use(cors({
  origin: function(ctx) { //设置允许来自指定域名请求
    const whiteList = ['http://'+Config.ip+':8080','http://localhost:8080']; //可跨域白名单
    // let url = ctx.header.referer.substr(0,ctx.header.referer.length - 1); 
    let url = ctx.header.origin;
    console.log(ctx)
    if(whiteList.includes(url)){
      return url //注意，这里域名末尾不能带/，否则不成功，所以在之前我把/通过substr干掉了
    }
    return 'http://localhost:8080' //默认允许本地请求3000端口可跨域
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE','PUT'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
})
)

/* 
koa-body 对应的API及使用 看这篇文章 http://www.ptbird.cn/koa-body.html
或者看 github上的官网 https://github.com/dlau/koa-body
*/
app.use(koaBody({
  multipart: true, // 支持文件上传
  formidable: {
    maxFieldsSize: 5 * 1024 * 1024, // 最大文件为5兆
    multipart: true // 是否支持 multipart-formdate 的表单
  }
})
);

app.use(serve(path.join(__dirname)));

// 加载路由中间件
app.use(router.routes(), router.allowedMethods());

// http.createServer(app.callback()).listen(3001);
// https.createServer(options,app.callback()).listen(3002);

app.listen(3001, () => {
  console.log('server is listen in 3001');
});