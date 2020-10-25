const router = require('koa-router')();
const directory = require('./directory');
const file = require('./file');
const user = require('./user');
const book = require('./book');
const storage = require('./storage');

router.use('/directory',directory.routes(),directory.allowedMethods());
router.use('/file',file.routes(),file.allowedMethods());
router.use('/user',user.routes(),user.allowedMethods());
router.use('/book',book.routes(),book.allowedMethods());
router.use('/storage',storage.routes(),storage.allowedMethods());

module.exports = router;