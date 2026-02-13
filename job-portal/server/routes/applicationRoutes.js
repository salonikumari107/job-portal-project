import express from 'express';
import { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus, getRecruiterApplications } from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, authorize('seeker'), upload.single('resume'), applyForJob);
router.get('/my-applications', protect, authorize('seeker'), getMyApplications);
router.get('/recruiter/all', protect, authorize('recruiter'), getRecruiterApplications);
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplications);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

export default router;
