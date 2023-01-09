import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations/validation.js';
import checkAuth from './utils/checkAuth.js';
import { UserController, PostController } from './controllers/index.js';
import cors from 'cors';
import multer from 'multer';   // библиотека для загрузки изображений
import handleValidationErrors from './utils/handleValidationErrors.js';

mongoose.connect('mongodb+srv://Kirill:Metallica73@cluster0.sytgfqz.mongodb.net/blog?retryWrites=true&w=majority').
   then(() => {
      console.log('DB OK')
   }).
   catch((err) => console.log('DB ERROR', err));
const app = express();

const storage = multer.diskStorage({     // допутсимо имя только storage
   destination: (_, __, callback) => {
      callback(null, 'uploads')
   },
   filename: (_, file, callback) => {
      callback(null, file.originalname)
   },
});

const upload = multer({ storage });   // допутсимо имя только storage

app.use(express.json());
app.use(cors());   // установи библиотеку корс, чтобы корс не лочил запросы на другой локалхост
app.use('/uploads', express.static('uploads'));   //static объясняет, что ты делаешь гет запрос на получени статичного файла в папке

app.get('/', (req, res) => {
   res.send('Hello, Kirill');
});

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.get('/posts', PostController.getAll); // для получения всех статей
app.get('/posts/:id', PostController.getCurrentTitle); // для получения одной статьи
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.createTitle);
app.delete('/posts/:id', checkAuth, PostController.removeTitle);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.updateTitle);
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
   res.json({
      url: `/uploads/${req.file.originalname}`
   });
});
app.get('/tags', PostController.getLastTags);


app.listen(4444, (err) => {
   if (err) {
      console.log(err);
   };
   console.log('Server OK');
});
