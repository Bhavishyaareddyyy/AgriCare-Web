import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { databaseAvailable } from '../db.js';
export async function requireDatabase(req,res,next){if(!databaseAvailable())return res.status(503).json({success:false,error:{code:'DATABASE_UNAVAILABLE',message:'Database service is temporarily unavailable.'}});next()}
const authReady=()=>typeof process.env.JWT_SECRET==='string'&&process.env.JWT_SECRET.length>=32&&!process.env.JWT_SECRET.includes('USE_A_LONG_RANDOM_SECRET');
export function requireAuthConfig(req,res,next){if(!authReady())return res.status(503).json({success:false,error:{code:'AUTH_NOT_CONFIGURED'}});next()}
export async function authenticate(req,res,next){try{if(!authReady())return res.status(503).json({success:false,error:{code:'AUTH_NOT_CONFIGURED'}});if(!databaseAvailable())return res.status(503).json({success:false,error:{code:'DATABASE_UNAVAILABLE'}});const token=(req.headers.authorization||'').match(/^Bearer\s+(.+)$/i)?.[1];if(!token)return res.status(401).json({success:false,error:{code:'AUTH_REQUIRED'}});const payload=jwt.verify(token,process.env.JWT_SECRET);const user=await User.findById(payload.sub);if(!user)return res.status(401).json({success:false,error:{code:'INVALID_TOKEN'}});req.user=user;next()}catch{return res.status(401).json({success:false,error:{code:'INVALID_TOKEN'}})}}
export async function optionalAuth(req,res,next){try{const token=(req.headers.authorization||'').match(/^Bearer\s+(.+)$/i)?.[1];if(token){const payload=jwt.verify(token,process.env.JWT_SECRET);req.user=await User.findById(payload.sub)||undefined}next()}catch{return res.status(401).json({success:false,error:{code:'INVALID_TOKEN'}})}}
export const asyncHandler=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
