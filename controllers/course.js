const mongoConnection = require('../database/mongo-connection');
var CourseM = require('../model/course');
var log = require('../log')(module);
var JSZip = require("jszip");
var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
//获取当前系统默认桌面路径
var os=require('os');
var homedir=os.homedir();

var builder = new xml2js.Builder();  // JSON->xml

//add user_project_rel MySQL table
var Sequelize = require('sequelize');
var Connection = require('../database/mysql-connection');
var user_project_rel = require('../models/user_project_rel');

const User_project_rel = user_project_rel(Connection,Sequelize);

//Create course
function createCourse(req, res){
    var course = new CourseM({
      courseName:req.body.courseName,
      grade:req.body.grade,
      subject:req.body.subject,
      descript:req.body.descript,
      knowledges:req.body.knowledges,
      isOpen:req.body.isOpen,
      isEdit:req.body.isEdit,
      catalog:{ 
        children:req.body.children,
        name:req.body.name
     },
      fileSize:req.body.fileSize,
      scope:req.body.scope,
      addTime:req.body.addTime,
      views:req.body.views,
      thumbnail:{
        url:req.body.url,
        style:{
            width:req.body.width,
            height:req.body.height
        }
      },
      slides:{
        templateId:req.body.templateId,
        slide:req.body.slide
      }
    })
    course.save(function(err){
        if (!err) {
            log.info('New course created with id: %s', course.id);
            console.log("course.catalog=====",JSON.stringify(course.catalog)); 
            console.log("course.id=====",course.id); 
            User_project_rel.create({
                user_id:req.body.user_id,
                project_id:course.id,
                hoster: 1
            }).then(result=>{
                if(result.length!=0){
                    let rs0 = {
                        errorCode:0,
                        courseId:course.id,
                        msg:course
                    }
                    res.send(rs0);
                }
            })
        } else {
            if (err.name === 'ValidationError') {
                res.statusCode = 400;
                res.json({
                    errorCode:1,
                    msg: 'Validation error'
                });
            } else {
                res.statusCode = 500;

                log.error('Internal error(%d): %s', res.statusCode, err.message);

                res.json({
                    errorCode:2,
                    msg: 'Server error'
                });
            }
        }
    });
}

//update course by _id
function updateCourse(req,res){
    var body = null
    for(let key in req.body){
        body = key
        break;
    }
    console.log(JSON.parse(body))
    req.body = JSON.parse(body)
    var _id = req.body._id;
    console.log(req.body.thumbnail.width)
   // console.log("url----",req.body.thumbnail.url)
    if(!_id){
        res.statusCode = 404;
        log.error('Course with id: %s Not Found', _id);
        return res.json({
            error:'Not Found'
        });
}
    condiction = {_id: req.body._id},
              query = {$set: {
                  courseName:req.body.courseName,
                  grade:req.body.grade,
                  subject:req.body.subject,
                  descript:req.body.descript,
                  knowledges:req.body.knowledges,
                  isOpen:req.body.isOpen,
                  isEdit:req.body.isEdit,
                  catalog:{ 
                    children:req.body.catalog.children,
                    name:req.body.catalog.name
                 },
                  fileSize:req.body.fileSize,
                  scope:req.body.scope,
                  addTime:req.body.addTime,
                  views:req.body.views,
                  thumbnail:{
                  //  url:req.body.url,
                     url:req.body.thumbnail.url,
                    style:{
                        width:req.body.thumbnail.style.width,
                        height:req.body.thumbnail.style.height
                    }
                  },
                  slides:{
                    templateId:req.body.templateId,
                    slide:JSON.parse(req.body.slide)
                  }
              }}
              console.log(query.$set)
              CourseM.updateOne(condiction, query, (err, result) => {
                if(!err){
                    log.info('Course with id: %s updated', _id);
                    return res.json({
                        errorCode: 0,
                        status: 'OK'
                    });
                }else{
                    if(err.name = 'ValidationError'){
                        res.statusCode = 400;
                        return res.json({
                            error: 'Validation Error'
                        });
                    }else{
                        res.statusCode = 500;
                        return res.json({
                            error: 'Server error'
                        });
                    }
                    log.error('Internal error (%d): %s', res.statusCode, err.message);
                }
          })
}

//research course by _id,即CourseId
function researchByCourseId(req,res){
    const _id = req.query._id;
    CourseM.find({_id:_id},(err,result) => {
        if(!err){
            log.info('Course with courseId: %s researched', req.query._id);
            // console.log("research result==",result);
            return res.json({
                errorCode: 0,
                msg: result
            });
        }else{
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.json({
                errorCode: 1,
                error: 'Server error'
            });
        }
    })
}

//research course by user_id
function researchByUserId(req,res){
    const user_id = req.query.user_id;
    User_project_rel.find({  
        where:{
            user_id: user_id
        }
    }).then(result =>{
         CourseM.find({_id:result.project_id},(err,result) => {
            if(!err){
                log.info('All courses of userid = %s has researched', req.body.user_id);
                return res.json({
                    errorCode: 0,
                    msg: result
                });
            }else{
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.json({
                    errorCode: 1,
                    error: 'Server error'
                });
            }
        })
    })
}

//research course by courseName
function researchByCourseName(req,res){
    const courseName = req.query.courseName;
    CourseM.find({courseName:courseName},(err,result) => {
        if(!err){
            log.info('Course with courseName: %s researched', req.body.courseName);
            console.log("research result==",result);
            return res.json({
                errorCode: 0,
                msg: result
            });
        }else{
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.json({
                errorCode: 1,
                error: 'Server error'
            });
        }
    })
}

//首次进入课件广场，呈现所有课件信息
function allCourses(req,res){
    CourseM.find({},(err,result) => {
        if(!err){
            log.info('All courses have been found!');
            // console.log("result:===",result)
            return res.json({
                errorCode: 0,
                msg: result
            });
        }else{
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.json({
                errorCode: 1,
                error: 'Server error'
            });
        }
    })
}


//delete course by _id
  function deleteCourse(req,res){
    CourseM.deleteMany({_id:req.body._id},(err,result)=>{
        if(!err){
            log.info('Course deleted with _id: %s', req.body._id);
            return res.json({
                errorCode: 0
            });
        }else{
            log.info('delete course failure',err);
            return res.json({
                errorCode: 1
            });
        }
    })
  }

//download course
function downloadCourse(req, res){
    const _id = req.query._id;
    CourseM.find({_id:_id},(err,result) => {
        if(!err){
            log.info('Course with courseId: %s download', req.body._id);
            var zip = new JSZip();
            for (var i = 0; i < result[0].slides.slide.length; i++) {
                for(var j=0;j<result[0].slides.slide[i].media.length;j++){
                    for(var k=0;k<result[0].catalog.children.length;k++){
                        var obj = {
                            courseName:JSON.stringify(result[0].courseName),
                            grade:JSON.stringify(result[0].grade),
                            subject:JSON.stringify(result[0].subject),
                            descript:JSON.stringify(result[0].descript),
                            knowledges:JSON.stringify(result[0].knowledges),
                            isOpen:JSON.stringify(result[0].isOpen),
                            isEdit:JSON.stringify(result[0].isEdit),
                            catalog:{ 
                                children:{
                                    // children:JSON.stringify(result[0].catalog.children[k].children),
                                    name:JSON.stringify(result[0].catalog.children[0].name)
                                },
                                name:JSON.stringify(result[0].catalog.name)
                            },
                            fileSize:JSON.stringify(result[0].fileSize),
                            scope:JSON.stringify(result[0].scope),
                            addTime:JSON.stringify(result[0].addTime),
                            views:JSON.stringify(result[0].views),
                            thumbnail:{
                                url:JSON.stringify(result[0].thumbnail.url),
                                style:{
                                    width:JSON.stringify(result[0].thumbnail.style.width),
                                    height:JSON.stringify(result[0].thumbnail.style.height)
                                }
                            },
                            slides:{
                                templateId:JSON.stringify(result[0].slides.templateId),
                                slide:[{
                                    pageId:JSON.stringify(result[0].slides.slide[i].pageId),
                                    pageurl:JSON.stringify(result[0].slides.slide[i].pageThumbnail.pageurl),
                                    pagewidth:JSON.stringify(result[0].slides.slide[i].pageThumbnail.style.pagewidth),
                                    pageheight:JSON.stringify(result[0].slides.slide[i].pageThumbnail.style.pageheight),
                                    media:{
                                        id:JSON.stringify(result[0].slides.slide[i].media[j].id),
                                        position:JSON.stringify(result[0].slides.slide[i].media[j].position),
                                        rotation:JSON.stringify(result[0].slides.slide[i].media[j].rotation),
                                        scale:JSON.stringify(result[0].slides.slide[i].media[j].scale),
                                        shape:JSON.stringify(result[0].slides.slide[i].media[j].shape),
                                        style:JSON.stringify(result[0].slides.slide[i].media[j].style),
                                        type:JSON.stringify(result[0].slides.slide[i].media[j].type)
                                    }
                                }]
                            }
                        }
                    }
                 }
            }
            xml =  builder.buildObject(obj);
            zip.file("index.xml", xml);
            zip.folder("media").folder("audio");
            zip.folder("media").folder("video");
            zip.folder("media").folder("images");
            zip.folder("slides");
            // 压缩
            zip.generateAsync({
                // 压缩类型选择nodebuffer，在回调函数中会返回zip压缩包的Buffer的值，再利用fs保存至本地
                type: "nodebuffer",
                // 压缩算法
                compression: "DEFLATE",
                compressionOptions: {
                    level: 9
                }
            }).then(function (content) {
                let zip = result[0].courseName+'.zip';
                // 默认下载到系统桌面
                let home = homedir.replace(/\\/g,"/");
                fs.writeFile(home + '/Desktop/' + zip , content, function (err) {
                    if (!err) {
                        console.log(zip + '压缩成功');
                    } else {
                        console.log(zip + '压缩失败');
                    }
                });
            });
            return res.json({
                errorCode: 0,
                msg: '下载成功'
            });
        }else{
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.json({
                errorCode: 1,
                error: 'Server error'
            });
        }
    })
}

module.exports={
    createCourse:createCourse,
    deleteCourse:deleteCourse,
    updateCourse:updateCourse,
    researchByCourseId:researchByCourseId,
    researchByCourseName:researchByCourseName,
    researchByUserId:researchByUserId,
    downloadCourse:downloadCourse,
    allCourses:allCourses
}