import mongoose from 'mongoose';
const schema = new mongoose.Schema({ user:{type:mongoose.Schema.Types.ObjectId,ref:'User',index:true}, plant:{type:String,default:null}, diseaseName:{type:String,required:true,maxlength:160}, classScore:{type:Number,min:0,max:1}, confidence:{type:Number,min:0,max:1}, symptoms:{type:[String],default:[]}, possibleCause:{type:String,default:''}, recommendedAction:{type:String,default:''}, prevention:{type:String,default:''}, modelStatus:{type:String,enum:['available'],required:true}, sourceMetadata:{type:String,required:true} },{timestamps:{createdAt:true,updatedAt:false}});
schema.index({user:1,createdAt:-1});
export default mongoose.models.DiseaseCheck || mongoose.model('DiseaseCheck',schema);
