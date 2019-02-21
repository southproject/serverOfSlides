const mongoConnection = require('../database/mongo-connection');
var CourseM = require('../model/course');
var log = require('../log')(module);

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
    var _id = req.body._id;
    console.log("_id-----",_id)
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
              }}
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

//research course by _id
function researchCourse(req,res){
    CourseM.find({_id:req.body._id},(err,result) => {
        if(!err){
            log.info('Course with courseId: %s researched', req.body._id);
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

module.exports={
    createCourse:createCourse,
    deleteCourse:deleteCourse,
    updateCourse:updateCourse,
    researchCourse:researchCourse,
}