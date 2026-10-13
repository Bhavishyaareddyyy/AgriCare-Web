import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({ name:{type:String,required:true,trim:true,maxlength:100}, email:{type:String,required:true,unique:true,lowercase:true,trim:true,maxlength:254}, passwordHash:{type:String,required:true,select:false}, location:{type:String,trim:true,maxlength:120,default:''} }, {timestamps:true});
export default mongoose.models.User || mongoose.model('User',userSchema);
