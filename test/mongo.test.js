var test = require('tape');
var request = require('superagent');
var baseUrl = 'http://localhost:3000/api';

var courseData = {
    courseId:1,
    courseName:"除法",
    grade:"一年级",
    subject:"数学",
    descript:"除法",
    knowledges:["除法"],
    isOpen:1,
    isEdit:1,
    catalog:["除法"],
    pageId:1,
    templateId:1,
    media:["除法"],
    text:["除法"],
    picture:["除法"]
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