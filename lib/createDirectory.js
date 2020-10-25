const fs = require('fs');
const Config = require('../config.js');
const MongoOpr = require('../lib/dbOpr');
const MongoDB = new MongoOpr('File');

/*
创建文件夹
*/
const createDirectory = function(path,name,user){
  let file = Config.StorageRoot + path + name;
  let thumbfile = Config.ThumbnailRoot + path + name;
  try{
    fs.accessSync(file,fs.constants.R_OK);//已存在
    return false;
  }catch(e){//不存在
    MongoDB.insertMsg({
      path:Config.StorageRoot + path,
      type:'directory',
      name:name,
      uploader:user,
      uploadtime:new Date().getTime()
    });
    fs.mkdirSync(file);
    fs.mkdirSync(thumbfile);
    return true;
  }
}

module.exports = createDirectory