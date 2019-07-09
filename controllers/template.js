const mongoConnection = require('../database/mongo-connection');
var TemplateM = require('../model/template');
var log = require('../log')(module);
var JSZip = require("jszip");
var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
//获取当前系统默认桌面路径
var os=require('os');
var homedir=os.homedir();

var builder = new xml2js.Builder();  // JSON->xml

//add user_project_rel MySQL table
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Connection = require('../database/mysql-connection');
var user_project_rel = require('../models/user_project_rel');
var user_collection = require('../models/user_collection');
var resource = require('../models/resource');
var knowledge = require('../models/knowledge');

const User_project_rel = user_project_rel(Connection,Sequelize);
const User_collection = user_collection(Connection,Sequelize);
const Resource = resource(Connection,Sequelize);
const Knowledge = knowledge(Connection,Sequelize);

//Create template
function createTemplate(req, res){
    var template = new TemplateM({
      /* tempalteName:req.body.templateName,
      grade:req.body.grade,
      subject:req.body.subject,
      descript:req.body.descript,
      knowledges:req.body.knowledges,
      isOpen:req.body.isOpen,
      isEdit:req.body.isEdit, */
      catalog:{ 
        children:req.body.children,
        name:req.body.name
     },
      fileSize:req.body.fileSize,
      scope:req.body.scope,
      addTime:req.body.addTime,
      views:req.body.views,
      thumbnail:{
        url:req.body.url,
        style:{
            width:req.body.width,
            height:req.body.height
        }
      },
      slides:{
        templateId:req.body.templateId,
        slide:req.body.slide
      }
    })
    template.save(function(err){
        if (!err) {
            log.info('New template created with id: %s', template.id);
            console.log("template.catalog=====",JSON.stringify(template.catalog)); 
            console.log("template.id=====",template.id); 
            User_project_rel.create({
                user_id:req.body.user_id,
                project_id:template.id,
                hoster: 1
            }).then(result=>{
                if(result.length!=0){
                    let rs0 = {
                        errorCode:0,
                        templateId:template.id,
                        msg:template
                    }
                    res.send(rs0);
                }
            })
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

//update template by _id
function updateTemplate(req,res){
    var _id = req.body._id;
    if(!_id){
        res.statusCode = 404;
        log.error('Template with id: %s Not Found', _id);
        return res.json({
            error:'Not Found'
        });
    }

    condiction = {_id: req.body._id},
              query = {$set: {
                  templateName:req.body.templateName,
                  grade:req.body.grade,
                  subject:req.body.subject,
                  descript:req.body.descript,
                  knowledges:req.body.knowledges,
                  isOpen:req.body.isOpen,
                  isEdit:req.body.isEdit,
                  catalog:{ 
                    children:req.body.children,
                    name:req.body.name
                 },
                  fileSize:req.body.fileSize,
                  scope:req.body.scope,
                  addTime:req.body.addTime,
                  views:req.body.views,
                  thumbnail:{
                    url:req.body.url,
                    style:{
                        width:req.body.width,
                        height:req.body.height
                    }
                  },
                  slides:{
                    templateId:req.body.templateId,
                    slide:req.body.slide
                  }
              }}
              TemplateM.updateOne(condiction, query, (err, result) => {
                if(!err){
                    log.info('template with id: %s updated', _id);
                    TemplateM.find({_id: req.body._id},(err,result1) => {
                        return res.json({
                            errorCode: 0,
                            msg: result1
                        });
                    })
                }else{
                    if(err.name = 'ValidationError'){
                        res.statusCode = 400;
                        return res.json({
                            error: 'Validation Error'
                        });
                    }else{
                        res.statusCode = 500;
                        return res.json({
                            error: 'Server error'
                        });
                    }
                    log.error('Internal error (%d): %s', res.statusCode, err.message);
                }
          })
}

//research template by _id,即TemplateId
function researchByTemplateId(req,res){
    const _id = req.query._id;
    TemplateM.find({_id:_id},(err,result) => {
        if(!err){
            log.info('Template with templateId: %s researched', req.body._id);
            console.log("research result==",result);
            return res.json({
                errorCode: 0,
                msg: result
            });
        }else{
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.json({
                errorCode: 1,
                error: 'Server error'
            });
        }
    })
}

//research template by user_id
function researchByUserId(req,res){
    const user_id = req.query.user_id;
    User_project_rel.findAll({  
        where:{
            user_id: user_id
        }
    }).then( async result0=>{
        var resultArray = [];
        if(result0.length!=0){
            for(let i=0;i<result0.length;i++){
                console.log('result0.length',result0.length);
                console.log('result0[i].dataValues.project_id:',result0[i].project_id);
                try {
                    await TemplateM.findOne(
                        {_id:result0[i].project_id}
                    ).then(result1 => {
                        console.log("result1===",result1)
                        resultArray.push(result1);
                    })
                }catch (err) {
                        console.log(err);
                }
            }
            return res.json({
                errorCode:0,
                msg:resultArray
            })
            res.send(resultArray);
        }else{
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode);
            return res.json({
                errorCode: 1,
                error: 'Server error'
            });
        }   
    })
}

//research template by templateName
function researchByTemplateName(req,res){
    const templateName = req.query.templateName;
    TemplateM.find({templateName:templateName},(err,result) => {
        if(!err){
            log.info('Template with templateName: %s researched', req.body.templateName);
            console.log("research result==",result);
            return res.json({
                errorCode: 0,
                msg: result
            });
        }else{
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.json({
                errorCode: 1,
                error: 'Server error'
            });
        }
    })
}

//首次进入课件广场，呈现所有课件信息
function allTemplates(req,res){
    TemplateM.find({},(err,result) => {
        if(!err){
            log.info('All templates have been found!');
            // console.log("result:===",result)
            return res.json({
                errorCode: 0,
                msg: result
            });
        }else{
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.json({
                errorCode: 1,
                error: 'Server error'
            });
        }
    })
}


//delete template by _id
  function deleteTemplate(req,res){
    TemplateM.deleteMany({_id:req.body._id},(err,result)=>{
        if(!err){
            log.info('Template deleted with _id: %s', req.body._id);
            User_collection.destroy({
                where:{template_id:req.body._id}
            }).then(result=>{
                console.log('删除课件同时删除收藏关联')
                return res.json({
                    errorCode: 0,
                    msg:'delete template success'
                });
            })
        }else{
            log.info('delete template failure',err);
            return res.json({
                errorCode: 1,
                msg:'delete template failure'
            });
        }
    })
  }





//获取知识点关联资源
async function resourceRel(req,res){ 
    var value = req.query.knowledges;
    var y = value.replace(/"/g,'').replace(/\[/g,'').replace(/\]/g,'').replace(/\s/g,'').split(',');
    var resultArr=[];
    for(let i=0;i<y.length;i++){
      await  Resource.findAll({
           where:{
               r_name:{[Op.like]: '%'+y[i].toString()+'%'}
           }   
     }).then(result=>{
         console.log('关联资源呈现')
         for(let j=0;j<result.length;j++){
            resultArr.push(result[j]);
         }     
       }
    )}
    let rs={
        errorCode:0,
        msg:resultArr
    }
   res.send(rs);
}

//根据templateName关联呈现知识点
async function knowledgeRel(req,res){ 
    var value = req.query.templateName;
    for(let i=0;i<value.length;i++){
      await Knowledge.findAll({
            where:{
              title:{[Op.like]: '%'+value[i]+'%'}
            } 
   }).then(result=>{
       console.log('关联知识点呈现')
       let rs={
        errorCode:0,
        msg:result
         }
         res.send(rs);  
     }
  )}
}


module.exports={
    createTemplate:createTemplate,
    /* deleteTemplate:deleteTemplate,
    updateTemplate:updateTemplate,
    researchByTemplateId:researchByTemplateId,
    researchByTemplateName:researchByTemplateName,
    researchByUserId:researchByUserId,
    downloadTemplate:downloadTemplate, */
    allTemplates:allTemplates,
   /*  collectTemplate:collectTemplate,
    allCollectTemplates:allCollectTemplates,
    cancelCollect:cancelCollect, */
    resourceRel:resourceRel,
    knowledgeRel:knowledgeRel
}