### 利用Nodejs+Express+Sequelize+SwaggerUI构建nodeRESTful_API

1.初始化项目

```shell
git clone https://github.com/bing7788/nodeforMySQL_RESTfulAPI.git
cd nodeforMySQL_RESTfulAPI.git
npm install
npm start
```

2.添加Sequelize ORM(对象关系映射模型)连接关系性数据库(以MySQL为例)

```shell
//使用npm包管理添加Sequelize
npm install --save sequelize
//添加连接数据库驱动
npm install --save mysql2

//使用yarn包管理
yarn add sequelize
yarn add mysql2
```

2.1.添加整个项目的配置文件config.js

```javascript
var mysql_conf = {
    "username":"root",
    "password":"root",
    "database":"sync",
    "host":"127.0.0.1",
    "dialect":"mysql"
}

module.exports = {mysql_conf};
```

2.2.添加数据库连接（建立database文件夹，添加mysql-connection.js）

```javascript
const Sequelize = require('sequelize');
var config = require('../config')
//创建Sequelize实例时候最好利用const类型变量，尤其在建立authentication时候，只有const才能够建立数据库连接，使用var的话无法成功，可以仔细了解一下JS中const和var的区别
const mysqlConnection = new Sequelize(
    config.mysql_conf.database,
    config.mysql_conf.username,
    config.mysql_conf.password,{
    host:config.mysql_conf.host,
    dialect:config.mysql_conf.dialect,
    pool:{max:5,min:0,idle:1000},
});

module.exports = {mysqlConnection};
```

2.3.基础的属性文件都写好后，下面将建立连接，为此单独开一个路由-在route文件夹下面创建api.js文件

```javascript
var express = require('express');
var router = express.Router();
//必须使用const类型变量建立连接，这样authentication函数方法才有效
const mysqlConnection = require('../database/mysql-connection');

mysqlConnection
.authenticate()
.then(()=>{
    console.log('mysqlConnection Connected Successfully.');
})
.catch(err=>{
    console.error('Unable to connect to the mysqlConnection',err);
});

module.exports = router;
```

2.4.在项目启动文件app.js中注册你的路由

```javascript
var api = require('./routes/api');
```

这样整个数据库连接的工作就做完了，使用npm start一下，看一下Terminal上面是否有mysqlConnection Connected Successfully。

3.数据库的增删改查（以user表为例）

3.1.安装自动生成model的npm包，然后根据指令生成相应的数据库表对应的关系模型

```shell
//这里因为需要使用sequelize-auto的命令行需要进行全局安装才有效,sequelize-auto-migrations作用是自动将数据库中的内容进行转化为可编程的实体数据关系模型
npm install -g sequelize-auto-migrations
npm install -g mysql
//这个是以中小内网201数据库为例的参数，自行体会
sequelize-auto -o "./models" -d test -h 192.168.71.201  -u root  -p 3306 -x Mstarc@2017 -e mysql -t user
```

```javascript
//sequelize-auto-migrations自行生成的model代码
/* jshint indent: 2 */
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'user',
    //这些还有它自动生成的固定时间戳、版本号这些字段如果不需要，需要自行给它添加属性
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
```

3.2.创建处理层逻辑--新建controller文件夹，如对应创建user.js

```javascript
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Connection = require('../database/mysql-connection');
var user = require('../models/user');

const User = user(Connection, Sequelize);

function UserQuery(req, res){
    
    User.findAll().then(result=>{
        console.log(result);
        res.json(result);
    })
}

module.exports = {
    UserQuery : UserQuery
}

```

3.3.将处理接口绑定到路由上，在routes/api.js中添加路径

```javascript
//Model模型
var user = require('../controller/user');
router.get('/userQuery',user.UserQuery);
```

4.添加Swagger-UI

```shell
npm i swagger-jsdoc
```

添加主要是为了前后沟通方便测试接口的有效性，主要是通过YAML编写的脚本来帮助接口信息呈现到html中。

需要在app.js中添加相应的变量的配置，以便生成swagger.json填充到api-docs（在public下）文件夹中

```javascript
const swaggerJSDoc = require('swagger-jsdoc');
const options = {
  definition:{
    info:{
      title:'NodejsRESTful API',
      version:'1.0.0'
    },
  },
  host:'localhost:3000',
  basePath:'/',
  apis:['./routes/*.js']
};
const swaggerSpec = swaggerJSDoc(options);
app.get('/swagger.json',function(req,res){
  res.setHeader('Context-Type','application/json');
  res.send(swaggerSpec);
});
```

以上是记录服务端构建流程，如果第一次使用只需要执行1.初始化项目就可以跑起来了。

更多参考链接：

https://www.npmjs.com/package/swagger-jsdoc

http://docs.sequelizejs.com/

http://www.expressjs.com.cn/

https://swagger.io/tools/swagger-ui/