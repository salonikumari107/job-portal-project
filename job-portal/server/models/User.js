import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  mobile: {
    type: String,
    match: [/^\d{10}$/, 'Please add a valid 10-digit mobile number']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['seeker', 'recruiter'],
    default: 'seeker'
  },
  // Seeker Specific
  education: [
    {
      institution: String,
      degree: String,
      year: String
    }
  ],
  skills: [String],
  experience: [
    {
      company: String,
      position: String,
      duration: String
    }
  ],
  resumes: [
    {
      url: String,
      name: String,
      isDefault: {
        type: Boolean,
        default: false
      }
    }
  ],
  // Recruiter Specific
  companyDetails: {
    name: String,
    website: String,
    description: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  profileProgress: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
