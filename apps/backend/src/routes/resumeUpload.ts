import express from 'express';
import multer from 'multer';
import { parseResume } from '../resume/parser';
import { saveResumeToDb } from '../resume/service';

const router = express.Router();
const upload = multer();

router.post('/upload_resume', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    try {
        const fileBuffer = req.file.buffer;
        const mimeType = req.file.mimetype;

        const parsed = await parseResume(fileBuffer, mimeType);
        const resumeId = await saveResumeToDb(parsed);

        res.json({ status: 'success', resume_id: resumeId });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to process resume.' });
    }
});

export default router;
