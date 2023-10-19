import express from 'express';
import multer from 'multer';
import { Request, Response } from 'express';
import cors from 'cors'

const upload = multer(); 
const app = express();
const port = 3001;

app.use(cors())
app.use(express.json());

// In-memory data storage, no db
const MODELS = {
  'Ford': {
    'Ranger': ['Raptor', 'Raptor x', 'Wildtrak'],
    'Falcon': ['XR6', 'XR6 Turbo', 'XR8'],
    'Falcon Ute': ['XR6', 'XR6 Turbo']
  },
  'BMW': {
    '130d': ['xDrive 26d', 'xDrive 30d'],
    '240i': ['xDrive 30d', 'xDrive 50d'],
    '320e': ['xDrive 75d', 'xDrive 80d', 'xDrive 85d']
  },
  'Tesla': {
    'Model 3': ['Performance', 'Long Range', 'Dual Motor']
  }
};


// API to receive form data
app.post('/submit', upload.single('logbook'), (req: Request, res: Response) => {
  console.log(req.file)
  console.log(req.body)
  const { make, model, badge } = req.body;
  const logbookContents = req.file ? req.file.buffer.toString() : '';
  
  const template = `
    Make: ${make}
    Model: ${model}
    Badge: ${badge}

    Logs:
    ${logbookContents}
  `
  res.status(201).json({ message: template });
});

// API to get available vehicles
app.get('/vehicles', (req: Request, res: Response) => {
  res.json(MODELS);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
