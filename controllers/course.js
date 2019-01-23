const mongoConnection = require('../database/mongo-connection');
var CourseM = require('../model/course');
var log = require('../log')(module);

//Create course
function createCourse(req, res){
    var course = new CourseM({
      courseId:req.body.courseId,
      courseName:req.body.courseName,
      grade:req.body.grade,
      subject:req.body.subject,
      descript:req.body.descript,
      knowledges:req.body.knowledges,
      isOpen:req.body.isOpen,
      isEdit:req.body.isEdit,
      catalog:req.body.catalog,
      slides:{
        pageId:req.body.pageId,
        templateId:req.body.templateId,
        media:req.body.media,
        text:req.body.text,
        picture:req.body.picture
      }
    })
    course.save(function(err){
        if (!err) {
            log.info('New course created with id: %s', course.id);
            return res.json({
                errorCode: 0,
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

module.exports={
    createCourse:createCourse,
}