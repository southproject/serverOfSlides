var test = require('tape');
var request = require('superagent');
var baseUrl = 'http://localhost:3000/api';

var courseData = {
    courseId:6,
    courseName:"一年级数学",
    grade:"一年级",
    subject:"数学",
    descript:"除法",
    knowledges:["数，除法"],
    isOpen:1,
    isEdit:1,
    catalog:["数，除法"],
    pageId:1,
    templateId:1,
    media:["除法"],
    text:["除法"],
    picture:["除法"],
    pageurl:"./1.png",
    pagewidth:"100px",
    pageheight:"100px",
    fileSize:"100M",
    scope:"k12教育",
    addTime:20190124,
    views:300,
    url:"./5.png",
    width:"30px",
    height:"40px"
}

test('Create new course', function (t) {
    request
        .post(baseUrl + '/createCourse')
        .send(courseData)
        .end(function (err, res) {
            console.log("create course success!!!");
            t.end();
        });
});

test('Delete course', function (t) {
    request
        .delete(baseUrl + '/deleteCourse')
        .send({courseName:'除法'})
        .end(function (err, res) {
            console.log("delete course success!!!");
            t.end();
        });
});

test('Research course', function (t) {
    request
        .get(baseUrl + '/researchCourse')
        .send({courseId:1})
        .end(function (err, res) {
            console.log("research course success!!!");
            t.end();
        });
});

test('Update course', function (t) {
    request
        .put(baseUrl + '/updateCourse')
        .send(courseData)
        .end(function (err, res) {
            console.log("update course success~~~");
            t.end();
        });
});