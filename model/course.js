var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create Schema
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
    fileSize:{type:String},
    scope:{type:String},
    addTime:{type:Date},
    views:{type:Number},
    thumbnail:{
        url:{type:String},
        style:{
            width:{type:String},
            height:{type:String}
        }
    },
    slides:{
        pageId:{ type: Number},
        templateId:{ type: Number },
        media:{ type: Array },
        text:{ type: Array },
        picture:{ type: Array },
        pageThumbnail:{
            pageurl:String,
            style:{
                pagewidth:String,
                pageheight:String
            }
        }
    }
  })

  //create Model
  module.exports = mongoose.model('Course', Course);
