var test = require('tape');
var request = require('superagent');
var baseUrl = 'http://localhost:3000/api';


var courseData = {
	"_id":"5c6e1b1c1806d72b74d250e9",
	"user_id":2,
	"courseName": "一年级数学111",
	"grade": "一年级",
	"subject": "数学",
	"descript": "除法",
	"knowledges": ["除法", "加法", "乘法"],
	"isOpen": 1,
	"isEdit": 1,
	"name": "课件目录",
	"children": [{
		"children": [],
		"name": "子目录1"
	}],
	"templateId": 1,
	"slide": [{
		"pageId": 1,
		"pageThumbnail": {
			"pageurl": "./1.png",
			"style": {
				"pagewidth": "100px",
				"pageheight": "100px"
			}
		},
		"media":[
			{
				"id":2314,
				"position":[0,0],
				"rotation":0,
				"scale":[1,1],
				"shape":{"cx":100,"cy":100,"n":30,"z":40},
				"style":{"fill":"none"},
				"type":"house"
			}
		]
	}],		
	"fileSize": "100M",
	"scope": "k12教育",
	"addTime": 20190124,
	"views": 300,
	"url": "D:/Graduate/11.jpg",
	"width": "30px",
	"height": "40px"
}


// test('Create new course', function (t) {
//     request
//         .post(baseUrl + '/createCourse')
//         .send(courseData1)
//         .end(function (err, res) {
//             console.log("create course success!!!");
//             t.end();
//         });
// });

// test('Delete course', function (t) {
//     request
//         .delete(baseUrl + '/deleteCourse')
//         .send({"_id":"5c6e62fbc1524819b027ec73"})
//         .end(function (err, res) {
//             console.log("delete course success!!!");
//             t.end();
//         });
// });

// test('Research course', function (t) {
//     request
//         .get(baseUrl + '/researchCourse')
//         .send({"_id":"5c6e626f6a184d267479f1eb"})
//         .end(function (err, res) {
//             console.log("research course success!!!");
//             t.end();
//         });
// });

// test('Update course', function (t) {
//     request
//         .put(baseUrl + '/updateCourse')
//         .send(courseData)
//         .end(function (err, res) {
//             console.log("update course success~~~");
//             t.end();
//         });
// });

test('Download course', function (t) {
    request
        .get(baseUrl + '/downloadCourse')
        .send({"_id":"5c6e69c58cf3e21124ba61d6"})
        .end(function (err, res) {
            console.log("download course success!!!");
            t.end();
        });
});