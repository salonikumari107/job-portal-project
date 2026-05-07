import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; 
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// --- HELPER: Send Token Response ---
const sendTokenResponse = (user, statusCode, res, req) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { 
    expiresIn: '30d' 
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    secure: process.env.NODE_ENV === 'production'
  };

  const userData = user.toObject();
  delete userData.password;

  if (userData.resume) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    userData.resumeUrl = `${baseUrl}/uploads/resumes/${userData.resume}`;
  }

  return res.status(statusCode).cookie('token', token, options).json({ 
    success: true, 
    token, 
    user: userData,
    data: userData 
  });
};

// --- 1. REGISTER ---
export const register = async (req, res) => {
  try {
    const { name, email, password, role, mobile, skills } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const finalRole = role ? role.toLowerCase() : 'seeker';
    
    let formattedSkills = [];
    if (Array.isArray(skills)) {
      formattedSkills = skills.map(s => s.toLowerCase().trim());
    } else if (typeof skills === 'string' && skills.trim() !== "") {
      formattedSkills = skills.split(',').map(s => s.trim().toLowerCase()).filter(s => s !== "");
    }

    const user = await User.create({
      name, 
      email, 
      password, 
      role: finalRole,
      mobile: mobile || "",
      skills: formattedSkills,
      experience: [], 
      companyDetails: finalRole === 'recruiter' ? {
        name: "", website: "", description: "", industry: "", location: ""
      } : undefined
    });

    return sendTokenResponse(user, 201, res, req);
  } catch (error) {
    console.error("🔥 REGISTER ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. LOGIN ---
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (role && user.role !== role.toLowerCase()) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Registered as ${user.role}.` 
      });
    }

    return sendTokenResponse(user, 200, res, req);
  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- 3. GET PROFILE ---
export const getMe = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const user = await User.findById(userId).select('-password').populate('savedJobs');
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userData = user.toObject();
    
    if (userData.resume) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        userData.resumeUrl = `${baseUrl}/uploads/resumes/${userData.resume}`;
    }

    res.status(200).json({ success: true, user: userData, data: userData });
  } catch (error) {
    console.error("🔥 GET_ME ERROR:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- 4. UPDATE PROFILE (🚀 FINAL FIX WITH NEW: TRUE) ---
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id; 
        if (!userId) return res.status(401).json({ success: false, message: "Not authorized" });

        const { name, email, mobile, phoneNumber, skills, summary, bio, location } = req.body;
        
        // Data mapping for update
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (location) updateData.location = location;
        if (summary || bio) updateData.summary = summary || bio;
        
        // Mobile mapping fix
        if (mobile || phoneNumber) {
            updateData.mobile = mobile || phoneNumber;
        }

        if (skills) {
            updateData.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
        }

        // 🚨 CRITICAL: Using findByIdAndUpdate with { new: true } to get fresh data
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { $set: updateData }, 
            { new: true, runValidators: false }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully",
            user: updatedUser // Frontend will receive this and update state
        });
    } catch (error) {
        console.error("🔥 UPDATE ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 5. FORGOT/RESET/LOGOUT/DELETE ---
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; 

    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    const message = `Password reset link: ${resetUrl}`;

    try {
      await sendEmail({ email: user.email, subject: 'Password Reset', message });
      res.status(200).json({ success: true, message: "Link sent." });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: "Email failed." });
    }
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: "Invalid token." });
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(200).json({ success: true, message: "Updated!" });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const logout = async (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 5 * 1000), httpOnly: true });
  res.status(200).json({ success: true, message: 'Logged out' });
};

export const deleteResume = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        await User.findByIdAndUpdate(userId, { $set: { resumes: [], resume: null } });
        res.status(200).json({ success: true, message: "Removed" });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};