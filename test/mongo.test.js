var test = require('tape');
var request = require('superagent');
var baseUrl = 'http://localhost:3000/api';

var courseData = {
    courseName:"一年级数学",
    grade:"一年级",
    subject:"数学",
    descript:"除法",
    //知识点
    knowledges:["除法","加法","乘法"],
    isOpen:1,
    isEdit:1,
    name:"课件目录", //课件总目录
    //课件子目录
    children:[
        {
            children:[],
            name:"子目录1"
        },
        {
            children:[],
            name:"子目录2"
        },
        {
            children:[],
            name:"子目录3"
        }
    ],
    templateId:1, //模板ID
    //课件页面，整体为数组，数组中每一项代表一页内容
    slide:[
        {
            pageId:1,
            //单页课件缩略图
            pageThumbnail:{
                pageurl:'./1.png',
                style:{
                    pagewidth:"100px",
                    pageheight:"100px"
                }
            },
            images:[
                {
                    "imgId": 1,
                    "imgUrl": "images/1.png",
                    "position": 100,
                    "rotation": 60,
                    "style": [
                        {
                            "width": "100px",
                            "height": "100px",
                            "border": "1 solid black"
                        }
                    ]
                }
            ],
            audio:[
                {
                    "audioId": 1,
                    "audioUrl": "audio/1.mp3",
                    "position": 100
                }

            ],
            video:[
                {
                    "videoId": 1,
                    "videoUrl": "video/1.mp4",
                    "position": 100,
                    "style": [
                        {
                            "width": "100px",
                            "height": "100px",
                            "border": "1 solid black"
                        }
                    ]
                }
            ],
            text:[
                {
                    "textId": 1,
                    "position": 100,
                    "content": "xxxxyyyy",
                    "style": [
                        {
                            "color": "red",
                            "font-weight": "bold",
                            "background": "blue"
                        }
                    ]
                }
            ],
            picture:[
                {
                    "picId": 1,
                    "position": 100,
                    "rotation": 60,
                    "scale": 1,
                    "shape": "circle",
                    "style": [
                        {
                            "width": "100px",
                            "height": "100px",
                            "border": "1 solid black"
                        }
                    ]
                }

            ]
        }
    ],
    fileSize:"100M",
    scope:"k12教育",
    addTime:20190124,
    views:300, //浏览量
    // 整个课件的缩略图：url、宽、高
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

// test('Delete course', function (t) {
//     request
//         .delete(baseUrl + '/deleteCourse')
//         .send({courseName:'除法'})
//         .end(function (err, res) {
//             console.log("delete course success!!!");
//             t.end();
//         });
// });

// test('Research course', function (t) {
//     request
//         .get(baseUrl + '/researchCourse')
//         .send({courseId:1})
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