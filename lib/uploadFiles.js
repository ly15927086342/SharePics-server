const fs = require('fs');
const path = require('path');
const Config = require('../config.js');
const gm = require('gm');
const MongoOpr = require('../lib/dbOpr');
const MongoDB = new MongoOpr('File');

const uploadFiles = function(file,pathname,user) {
  const filePath = Config.StorageRoot;
  const thumbnailPath = Config.ThumbnailRoot;
  let fileReader, fileResource, writeStream;
  return new Promise((resolve,reject)=>{
    // 组装成绝对路径
    fileResource = filePath + pathname +`${file.name}`;
    let extname = path.extname(fileResource);
    let changename = path.join(thumbnailPath,pathname +`${file.name}`);
    changename = changename.replace(/\\/g,'\/');
    fs.exists(fileResource,function(exist){
      if(exist){//存在
        resolve({
          status:'already',
          url:'http://'+Config.ip+':'+Config.port+'/'+changename,
          name:`${file.name}`
        })//已存在
      }else{
        MongoDB.insertMsg({
          path:filePath + pathname,
          name:file.name,
          type:'file',
          size:file.size,
          suffix:extname,
          uploader:user,
          uploadtime:new Date().getTime(),
          downloadcount:0
        })
        // 读取文件流
        fileReader = fs.createReadStream(file.path);
        // 使用 createWriteStream 写入数据，然后使用管道流pipe拼接
        writeStream = fs.createWriteStream(fileResource);
        fileReader.pipe(writeStream);

        writeStream.on('finish',function(){
          if(['.png','.jpg','.jpeg'].includes(extname.toLowerCase())){//是图片，返回缩略图
            gm(fileResource)
            .resize(100, 100)
            .write(thumbnailPath + pathname +`${file.name}`, function (err) {
              resolve({
                url:'http://'+Config.ip+':'+Config.port+'/'+changename,
                name:`${file.name}`
              })
            });
          }else{
            resolve({name:`${file.name}`})
          }        
        })
      }
    })
  })
};


module.exports = uploadFiles;