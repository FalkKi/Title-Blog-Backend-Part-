import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
   try {
      const posts = await PostModel.find().populate('user').exec();   //populate связывает наш запрос на пост еще и с юзерами
      res.json(posts);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'enable to get titles'
      });
   };
};

export const getCurrentTitle = async (req, res) => {
   try {
      const postid = req.params.id;
      PostModel.findOneAndUpdate({   // метод позволяет выцепить что-то одно и применить к нему изменение, которое передается вторым параметром
         _id: postid,
      },
         {
            $inc: { viewsCount: 1 }  // спец метод инкрементации
         },
         {
            returnDocument: 'after'  // сообщаем, что хотим вернуть уже обновленный документ
         },
         (err, doc) => {
            if (err) {
               console.log(err);
               return res.status(500).json({
                  message: 'enable to get title'
               });
            };
            if (!doc) {
               return res.status(404).json({
                  message: 'Title was not found'
               });
            };
            res.json(doc);
         }
      );

   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'enable to get titles'
      });
   };
};

export const removeTitle = async (req, res) => {
   try {
      const postId = req.params.id;
      PostModel.findOneAndRemove({
         _id: postId
      }, (err, doc) => {
         if (err) {
            console.log(err);
            res.status(500).json({
               message: 'enable to delete title'
            });
         }
         if (!doc) {
            return res.status(404).json({
               message: 'Title was not found'
            });
         };
         res.json({
            succsess: true
         });
      });

   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'enable to get titles'
      });
   };
}

export const createTitle = async (req, res) => {
   try {
      const doc = new PostModel({
         title: req.body.title,                //body - это то, что мы передаем на сервер
         text: req.body.text,
         tags: req.body.tags,
         imageUrl: req.body.imageUrl,
         user: req.userId    // userId вытаскиваем из мидлвары checkAuth
      });

      const post = await doc.save();
      res.json(post);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'enable to create title'
      });
   };
};

export const updateTitle = async (req, res) => {
   try {
      const postId = req.params.id;
      await PostModel.updateOne(
         {
            _id: postId
         },
         {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId
         });
      res.json({
         succsess: true
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'enable to update title'
      });
   };
};

export const getLastTags = async (req, res) => {
   try {
      const posts = await PostModel.find().limit(5).exec();
      const tags = posts.map(el => el.tags).flat().slice(0, 5);
      res.json(tags);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'enable to get titles'
      });
   };
}