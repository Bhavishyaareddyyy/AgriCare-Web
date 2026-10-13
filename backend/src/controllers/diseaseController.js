import sharp from 'sharp';
import DiseaseCheck from '../models/DiseaseCheck.js';
import { databaseAvailable } from '../db.js';
import { parseDiseaseLabel } from '../data/diseaseLabels.js';

const inferenceBase = () => process.env.INFERENCE_URL || 'http://127.0.0.1:8001';
export async function health(req,res){try{const r=await fetch(`${inferenceBase()}/health`,{signal:AbortSignal.timeout(1500)});const model=await r.json();res.json({success:true,data:{available:r.ok,model:r.ok?model:null}})}catch{res.json({success:true,data:{available:false,model:null}})}}

const modelName = 'rodynaemad/plant-disease-dinov2-small';
const references = [
	{ name: 'Model card, labels, evaluation and limitations', url: 'https://huggingface.co/rodynaemad/plant-disease-dinov2-small' },
	{ name: 'PlantVillage dataset card', url: 'https://huggingface.co/datasets/mohanty/PlantVillage' }
];

export async function check(req,res){
 if(!req.file)return res.status(400).json({success:false,error:{code:'INVALID_IMAGE',message:'Upload one JPEG, PNG or WEBP image smaller than 5 MB.'}});
 let imageBuffer;
 try{const image=sharp(req.file.buffer,{limitInputPixels:25000000});const meta=await image.metadata();if(!['jpeg','png','webp'].includes(meta.format)||!meta.width||!meta.height||meta.width>8000||meta.height>8000)throw Error('Unsupported image');imageBuffer=req.file.buffer}
 catch{return res.status(400).json({success:false,error:{code:'INVALID_IMAGE',message:'The image is invalid or unsupported. Use JPEG, PNG or WEBP.'}})}
 let response;try{response=await fetch(`${inferenceBase()}/predict`,{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:imageBuffer,signal:AbortSignal.timeout(25000)})}catch{return res.status(503).json({success:false,error:{code:'MODEL_UNAVAILABLE'}})}
 if(!response.ok)return res.status(503).json({success:false,error:{code:'MODEL_UNAVAILABLE'}});
 let prediction;try{prediction=await response.json()}catch{return res.status(503).json({success:false,error:{code:'INVALID_MODEL_RESPONSE'}})}
 const hasOodEvidence=Number.isFinite(prediction.oodSimilarity)&&prediction.oodSimilarity>=-1&&prediction.oodSimilarity<=1&&Number.isFinite(prediction.oodThreshold)&&prediction.oodThreshold>=-1&&prediction.oodThreshold<=1;
 if(prediction.status==='unsupported'&&typeof prediction.message==='string'){
  if(!hasOodEvidence||prediction.label!==null||prediction.confidence!==null)return res.status(503).json({success:false,error:{code:'INVALID_MODEL_RESPONSE'}});
  return res.json({success:true,data:{predictionStatus:'unsupported',plant:null,diseaseName:null,classScore:null,imageSimilarity:prediction.oodSimilarity,rejectionThreshold:prediction.oodThreshold,uncertain:true,modelStatus:'available',dataSource:modelName,message:prediction.message,references,disclaimer:'The classifier uses curated PlantVillage leaf images with controlled backgrounds. Its published rejection check can abstain on field photos; it cannot guarantee rejection of every unsupported image.'}});
 }
 const classification=parseDiseaseLabel(prediction.label);
 if(prediction.status!=='classified'||!classification||!Number.isFinite(prediction.confidence)||prediction.confidence<0||prediction.confidence>1||!hasOodEvidence||prediction.oodSimilarity<prediction.oodThreshold)return res.status(503).json({success:false,error:{code:'INVALID_MODEL_RESPONSE'}});
 const {plant,diseaseName}=classification;
 const data={predictionStatus:'classified',plant,diseaseName,classScore:prediction.confidence,scoreDescription:'Raw softmax class score; uncalibrated and not the probability of a correct diagnosis.',imageSimilarity:prediction.oodSimilarity,rejectionThreshold:prediction.oodThreshold,uncertain:true,modelStatus:'available',dataSource:modelName,symptoms:'The classifier returns a class label only; it does not identify visible symptoms in the uploaded photo.',prevention:'No class-specific prevention or treatment advice is attached because this model does not establish a diagnosis. Confirm symptoms with a local agricultural expert before acting.',references,disclaimer:'Preliminary photo-based screening only. PlantVillage images use controlled backgrounds; field photos may be rejected or misclassified. Confirm important treatment decisions with a local agricultural expert.'};
 if(databaseAvailable()&&req.user?._id){try{await DiseaseCheck.create({user:req.user._id,plant,diseaseName:data.diseaseName,modelStatus:'available',sourceMetadata:data.dataSource})}catch{data.historySaved=false}}
 else data.historySaved=false;
 res.json({success:true,data});
}
export async function history(req,res){const limit=Math.min(Math.max(Number.parseInt(req.query.limit,10)||20,1),50);const items=await DiseaseCheck.find({user:req.user._id}).sort({createdAt:-1}).limit(limit).lean();res.json({success:true,data:{items}})}
