import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { StatusCodes } from '../config/status-codes';

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, 'dist/root/audio');
  },

  filename: (req, file, cd) => {
    const originName = file.originalname;
    const newName = `${originName.split('.')[0]}-${Date.now()}${path.extname(file.originalname)}`;
    cd(null, newName);
  },
});

const upload = multer({ storage });
const cpUpload = upload.fields([
  { name: 'sound', maxCount: 1 },
]);

const router = Router();

router.post('/', cpUpload, async (req, res) => {
  const filedata: any = req.files;

  if (!filedata) { return res.sendStatus(StatusCodes.BadRequest); }

  try {
    const sound = filedata.sound[0];
    res.send({ name: sound.filename });
  } catch (e) {
    return res.sendStatus(StatusCodes.BadRequest);
  }
});

export default router;
