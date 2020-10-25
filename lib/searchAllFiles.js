const fs = require('fs');
const path = require('path');
const Config = require('../config.js');
const MongoOpr = require('../lib/dbOpr');
const MongoDB = new MongoOpr('File');

/*
获取所有文件及文件夹，以及创建信息
*/
const searchAllFiles = async function(req){
  let pathname = req.path,
  index = req.index,
  num = req.num,
  suffix = req.suffix,
  type = req.type,
  name = req.name,
  uploader = req.uploader;
  let filepath = Config.StorageRoot+pathname;
  let thumbpath = Config.ThumbnailRoot+pathname;
  let key = ['path'],value = [filepath];

  if(suffix != ''){
    key.push('suffix');
    value.push(suffix[0]);
  }
  if(type != ''){
    key.push('type');
    value.push(type[0]);
  }
  if(uploader != ''){
    key.push('uploader');
    value.push({$regex:`${uploader}`,$options:"i"});
  }
  if(name != ''){
    key.push('name');
    value.push({$regex:`${name}`,$options:"i"});
  }

  let len = await MongoDB.findMsg({key:key,value:value,limit:2000000});
  let res = await MongoDB.findMsg({key:key,value:value,limit:num,skip:index*num});

  return {
    len:len.length,
    res:res.map(item=>{
      if(item.type == 'file' && ['.png','.jpg','.jpeg'].includes(item.suffix.toLowerCase())){//图片
        let thumbname = path.join(thumbpath,item.name);
        let changename = thumbname.replace(/\\/g,'\/');
        item.url = 'http://'+Config.ip+':'+Config.port+'/'+changename;
        return item;
      }else{
        return item;
      }
    })
  } 
  // 静态文件系统操作
  // let files = fs.readdirSync(filepath);
  // return files.map(item=>{
  //   let name = path.join(filepath,item);
  //   let thumbname = path.join(thumbpath,item);
  //   let stats = fs.statSync(name);
  //   let isFile = stats.isFile();//是文件
  //   let isDir = stats.isDirectory();//是文件夹
  //   if(isFile){
  //     let extname = path.extname(name);
  //     if(['.png','.jpg','.jpeg'].includes(extname.toLowerCase())){//是图片，返回缩略图
  //       let changename = thumbname.replace(/\\/g,'\/');
  //       return {
  //         type:'pic',
  //         name:item,
  //         size:stats.size,
  //         birthtime:parseInt(stats.birthtimeMs),
  //         url:'http://'+Config.ip+':'+Config.port+'/'+changename
  //       }
  //     }
  //     return {
  //       type:extname.toUpperCase().replace('.',''),
  //       name:item,
  //       size:stats.size,
  //       birthtime:parseInt(stats.birthtimeMs)
  //     }
  //   }
  //   if(isDir){
  //     return {
  //       type:'directory',
  //       name:item,
  //       size:stats.size,
  //       birthtime:parseInt(stats.birthtimeMs)
  //     }
  //   }
  // })
}

module.exports = searchAllFiles;