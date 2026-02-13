import Job from '../models/Job.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { title, location, jobType, experienceLevel } = req.query;
    let query = {};

    if (title) query.title = { $regex: title, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (experienceLevel) query.experienceLevel = experienceLevel;

    const jobs = await Job.find(query).sort('-createdAt');
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get jobs within a radius
// @route   GET /api/jobs/radius/:lat/:lng/:distance
// @access  Public
export const getJobsInRadius = async (req, res) => {
  try {
    const { lat, lng, distance } = req.params;

    // Radius of earth is 3963 mi / 6378 km
    const radius = distance / 6378;

    const jobs = await Job.find({
      coordinates: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private/Recruiter
export const createJob = async (req, res) => {
  try {
    req.body.recruiter = req.user.id;
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Recruiter
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    // Make sure user is recruiter owner
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Recruiter
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    // Make sure user is recruiter owner
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
