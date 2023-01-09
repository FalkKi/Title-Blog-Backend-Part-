import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';
import bcrypt, { genSalt } from 'bcrypt';

export const register = async (req, res) => {
   try {
      const password = req.body.password; //вытаскиваем пароль из реквеста
      const salt = await bcrypt.genSalt(10); //спец алгоритм для шифрования
      const hash = await bcrypt.hash(password, salt)
      const doc = new UserModel({
         email: req.body.email,
         passwordHash: hash,
         fullName: req.body.fullName,
         avatarUrl: req.body.avatarUrl,
      });

      const user = await doc.save();
      const token = jwt.sign(
         {
            _id: user._id,
         },
         'secretKey',
         {
            expiresIn: '30d'
         });

      const { passwordHash, ...userData } = user._doc; // вытаскивает хэш с паролем из объекта юзер, нам его не нужно передавать
      res.json({ ...userData, token });

   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'registration failed'
      });
   };
};

export const login = async (req, res) => {
   try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
         return res.status(404).json({
            message: 'User was not found'
         });
      };
      const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);

      if (!isValidPassword) {
         return res.status(400).json({
            message: 'Incorrect Login or Password'
         });
      };

      const token = jwt.sign(
         {
            _id: user._id,
         },
         'secretKey',
         {
            expiresIn: '30d'
         });

      const { passwordHash, ...userData } = user._doc; // вытаскивает хэш с паролем из объекта юзер, нам его не нужно передавать
      res.json({
         ...userData,
         token,
      });

   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Authorization Failed'
      });
   };
};

export const getMe = async (req, res) => {
   try {
      const user = await UserModel.findById(req.userId);
      if(!user){
         res.status(404).json({
            message: 'user not found'
         });
      };
      const { passwordHash, ...userData } = user._doc; // вытаскивает хэш с паролем из объекта юзер, нам его не нужно передавать
      res.json(userData);

   } catch (err) {
      console.log(err);
      res.status(403).json({
         message: 'access denied'
      });
   }
};



