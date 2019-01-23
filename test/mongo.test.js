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
            t.equal(res.status, 200, 'response status shoud be 200');
            console.log("res.body: ",res.body);
            t.end();
        });
        //log.info("res.body: ",res.body);
});