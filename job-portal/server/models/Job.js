import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  company: {
    type: String,
    required: [true, 'Please add a company name']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  salaryRange: {
    type: String
  },
  experienceLevel: {
    type: String,
    enum: ['Fresher', '1-3 years', '3-5 years', '5+ years'],
    default: 'Fresher'
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Freelance'],
    default: 'Full-time'
  },
  skillsRequired: [String],
  perks: [String],
  recruiter: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  }
}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
