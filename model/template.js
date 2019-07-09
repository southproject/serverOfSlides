var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create Schema
var Template = new Schema({
    /* courseName:{ type:String },
    grade:{ type:String },
    subject:{ type:String },
    descript:{ type:String },
    knowledges:{ type:Array },
    isOpen:{ type:Boolean },
    isEdit:{ type:Boolean }, */
    catalog:{ 
        children:[
            {
            children:Array,
            name:String
          }
        ],
        name:String
     },
    /* fileSize:{type:String},
    scope:{type:String},
    addTime:{type:Date},
    views:{type:Number}, */
    thumbnail:{
        url:{type:String},
        style:{
            width:{type:String},
            height:{type:String}
        }
    },
    slides:{
        templateId:{ type: Number },
        slide:[
            {
                pageId:{ type: Number},
                // media:{ type: Array },
                // images:{type:Array},
                // audio:{type:Array},
                // video:{type:Array},
                // text:{ type: Array },
                // picture:{ type: Array },
               /*  pageThumbnail:{
                    pageurl:String,
                    style:{
                        pagewidth:String,
                        pageheight:String
                    }
                }, */
                pageThumbnail:{type:String}, 
                media:{type:Array}
            }
        ]
    }
  })

  //create Model
  module.exports = mongoose.model('Template', Template);
