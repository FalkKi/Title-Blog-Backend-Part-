import { body } from "express-validator";

export const registerValidation = [
   body('email', 'incorrect email').isEmail(),
   body('password', 'incorrect password').isLength({ min: 5 }),
   body('fullName', 'incorrect name').isLength({ min: 5 }),
   body('avatarUrl', 'incorrect url').optional().isURL(),
];

export const loginValidation = [
   body('email', 'incorrect email').isEmail(),
   body('password', 'incorrect password').isLength({ min: 5 }),
];

export const postCreateValidation = [
   body('title', 'Enter title of the post').isLength({ min: 3 }).isString(),
   body('text', 'Enter text of the post').isLength({ min: 10 }).isString(),
   body('tags', 'incorrect tag format (use array)').optional().isString(),
   body('imageUrl', 'incorrect url').optional().isString(),
];