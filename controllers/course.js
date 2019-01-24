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

 //update course
// function updateCourse(req,res){
//     console.log(res.body);
//     let num = req.body.num,
//     condiction = {courseId: 1},
//               query = {$set: {
//                 courseId: req.body.courseId[num], 
//                 courseName: req.body.courseName[num],
//                 grade: req.body.grade[num],
//                 subject: req.body.subject[num],
//                 descript: req.body.descript[num],
//                 knowledges:req.body.knowledges[num],
//                 isOpen:req.body.isOpen[num],
//                 isEdit:req.body.isEdit[num],
//                 catalog:req.body.catalog[num],
//                 slides:req.body.slides[num]
//               }}
//               courseModel.update(condiction, query, (err, result) => {
//               if(err) {
//                   console.log(err)
//                   res.send('<script>alert("请勾选待修改的课件")</script>')
//               }else{
//                   console.log("修改成功");
//               }
//           })
// }

//update course
// function updateCourse(req,res){
//     console.log('修改课件req.body.courseId：',req.body.courseId);
//     var courseId = req.body.courseId;
//     CourseM.find({courseId:req.body.courseId},function(err,course){
//         console.log('修改课件course：',course)
//         if(!course){
//             res.statusCode = 404;
//             log.error('Course with id: %s Not Found', courseId);
//             return res.json({
//                 error:'Not Found'
//             });
//         }
//         course.courseId = req.body.courseId;
//         course.courseName = req.body.courseName;
//         course.grade = req.body.grade;
//         course.subject = req.body.subject;
//         course.descript = req.body.descript;
//         course.knowledges = req.body.knowledges;
//         course.isOpen = req.body.isOpen;
//         course.isEdit = req.body.isEdit;
//         course.catalog = req.body.catalog;
//         course.slides = req.body.slides;

//         course.update(function(err){
//             if(!err){
//                 log.info('Course with id: %s updated', course.courseId);
//                 return res.json({
//                     status: 'OK',
//                     course: course
//                 });
//             }else{
//                 if(err.name = 'ValidationError'){
//                     res.statusCode = 400;
//                     return res.json({
//                         error: 'Validation Error'
//                     });
//                 }else{
//                     res.statusCode = 500;
//                     return res.json({
//                         error: 'Server error'
//                     });
//                 }
//                 log.error('Internal error (%d): %s', res.statusCode, err.message);
//             }
//         })
//     })
// }

//research course
function researchCourse(req,res){
    console.log('req.body.courseId:',req.body.courseId);
    CourseM.find({courseId:req.body.courseId},(err,result) => {
        if(err) return console.log(err);
        // console.log("-------result------",result);
        console.log("-------result.pageId------",result.slides.pageId);
        return res.json({
            errorCode: 0,
            msg: result
        })
    })
}

//delete course
  function deleteCourse(req,res){
    console.log("=====req.body=====",req.body)
    CourseM.deleteOne({courseName:req.body.courseName},(err,result)=>{
        if(!err){
            log.info('Course deleted with courseName: %s', req.body.courseName);
            return res.json({
                errorCode: 0
            });
        }else{
            log.info('删除课件失败',err);
        }
    })
  }

module.exports={
    createCourse:createCourse,
    deleteCourse:deleteCourse,
    // updateCourse:updateCourse,
    researchCourse:researchCourse,
}