var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create Schema
var slideSchema = new Schema({
    pageId:{ type: Number},
    templateId:{ type: Number },
    media:{ type: Array },
    text:{ type: Array },
    picture:{ type: Array }
})

var Course = new Schema({
    courseId:{ type: Number, required: true },
    courseName:{ type:String },
    grade:{ type:String },
    subject:{ type:String },
    descript:{ type:String },
    knowledges:{ type:String },
    isOpen:{ type:Boolean },
    isEdit:{ type:Boolean },
    catalog:{ type:Array },
    slides:[slideSchema]
  })

  //create Model
  module.exports = mongoose.model('Course', Course);
