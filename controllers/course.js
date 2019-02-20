const mongoConnection = require('../database/mongo-connection');
var CourseM = require('../model/course');
var log = require('../log')(module);

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
            return res.json({
                errorCode: 0,
                courseId: course.id,
                msg: course
            });
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

//update course
function updateCourse(req,res){
    var courseId = req.body.courseId;
    if(!courseId){
        res.statusCode = 404;
        log.error('Course with id: %s Not Found', courseId);
        return res.json({
            error:'Not Found'
        });
}
    condiction = {courseId: req.body.courseId},
              query = {$set: {
                courseId: req.body.courseId, 
                courseName: req.body.courseName,
                grade: req.body.grade,
                subject: req.body.subject,
                descript: req.body.descript,
                knowledges:req.body.knowledges,
                isOpen:req.body.isOpen,
                isEdit:req.body.isEdit,
                catalog:req.body.catalog,
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
                    pageId:req.body.pageId,
                    templateId:req.body.templateId,
                    media:req.body.media,
                    text:req.body.text,
                    picture:req.body.picture,
                    pageThumbnail:{
                        pageurl:req.body.pageurl,
                        style:{
                            pagewidth:req.body.pagewidth,
                            pageheight:req.body.pageheight
                        }
                    }
                  }
              }}
              CourseM.updateOne(condiction, query, (err, result) => {
                if(!err){
                    log.info('Course with id: %s updated', courseId);
                    return res.json({
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

//research course
function researchCourse(req,res){
    CourseM.find({courseId:req.body.courseId},(err,result) => {
        // 为什么slides是undefined呢
        // console.log('result.slides.pageId---',result.slides.pageId)
        if(!err){
            log.info('Course with id: %s researched', req.body.courseId);
            return res.json({
                errorCode: 0,
                msg: result
            });
        }else{
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.json({
                error: 'Server error'
            });
        }
    })
}

//delete course
  function deleteCourse(req,res){
    CourseM.deleteOne({courseName:req.body.courseName},(err,result)=>{
        if(!err){
            log.info('Course deleted with courseName: %s', req.body.courseName);
            return res.json({
                errorCode: 0
            });
        }else{
            log.info('delete course failure',err);
        }
    })
  }

module.exports={
    createCourse:createCourse,
    deleteCourse:deleteCourse,
    updateCourse:updateCourse,
    researchCourse:researchCourse,
}