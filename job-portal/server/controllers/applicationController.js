import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private/Seeker
export const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    let resume = req.body.resume;

    if (req.file) {
      resume = `uploads/${req.file.filename}`;
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    // Check if already applied
    const existingApp = await Application.findOne({ job: jobId, seeker: req.user.id });
    if (existingApp) return res.status(400).json({ success: false, message: 'Already applied for this job' });

    const application = await Application.create({
      job: jobId,
      seeker: req.user.id,
      resume,
      coverLetter
    });

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get applications for a seeker
// @route   GET /api/applications/my-applications
// @access  Private/Seeker
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ seeker: req.user.id }).populate('job');
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get applications for a recruiter (by job)
// @route   GET /api/applications/job/:jobId
// @access  Private/Recruiter
export const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.recruiter.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to view applicants for this job' });
    }

    const applications = await Application.find({ job: req.params.jobId }).populate('seeker', 'name email mobile education skills experience');
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all applications for a recruiter
// @route   GET /api/applications/recruiter/all
// @access  Private/Recruiter
export const getRecruiterApplications = async (req, res) => {
  try {
    // Find all jobs posted by this recruiter
    const jobs = await Job.find({ recruiter: req.user.id });
    const jobIds = jobs.map(job => job._id);

    // Find applications for those jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job')
      .populate('seeker', 'name email mobile education skills experience');

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Recruiter
export const updateApplicationStatus = async (req, res) => {
  try {
    let application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    if (application.job.recruiter.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    application.status = req.body.status;
    await application.save();

    res.status(200).json({ success: true, data: application });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
