var express = require('express');
var router = express.Router();
const mysqlConnection = require('../database/mysql-connection');

//Model模型
var user = require('../controller/user');

var user_table = require('../controller/user_table');

//js逻辑引用
var oauth2 = require('../auth/oauth2');


//添加验证
mysqlConnection
.authenticate()
.then(()=>{
    console.log('mysqlConnection Connected Successfully.');
})
.catch(err=>{
    console.error('Unable to connect to the mysqlConnection',err);
});

/**
 * @swagger
 * /api/queryUsers:
 *   get:
 *     tags:
 *       - user
 *     description: 用户查询id-by bing
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/queryUsers',user_table.queryUsers);

/**
* @swagger
* definitions:
*   userinfo:
*     properties:
*       user_name:
*         type: bing
*       passwd:
*         type: 123456
*       email:
*         type: 1542721301@qq.com
*       phone_num:
*         type: 13297920692
*/
/**
 * @swagger
 * /api/addUsers:
 *   post:
 *     tags:
 *       - user
 *     description: 用户注册-by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: userinfo
 *        description: 用户信息
 *        in: body
 *        required: true
 *        schema: 
 *          $ref: '#/definitions/userinfo'
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.post('/addUsers',user_table.addUsers);

/**
 * @swagger
 * /api/queryResultTest:
 *   get:
 *     tags:
 *       - user
 *     description: test resultinfo -by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: user_name
 *        description: user_name
 *        in: query
 *        required: true
 *        type: string
 *      - name: passwd
 *        description: passwd
 *        in: query
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/queryResultTest',user_table.queryResultTest);

/**
 * @swagger
 * /api/destoryFormatTest:
 *   delete:
 *     tags:
 *       - user
 *     description: 删除返回值测试
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user_id
 *         description: user_id
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.delete('/destoryFormatTest',user_table.destoryFormatTest);


/**
 * @swagger
 * /api/saveUserModel:
 *   get:
 *     tags:
 *       - user
 *     description: test save() function -by bing
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: user_name
 *        description: user_name
 *        in: query
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Successfully
 *
 */
router.get('/saveUserModel',user_table.saveUserModel);

console.log("come in router");
//router.post('/token',oauth2.token);

module.exports = router;