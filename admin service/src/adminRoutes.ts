import express, { type Response } from 'express';
import { isAuth, type AuthenticatedRequest } from './middleware/auth.js';
import uploadfile from './middleware/multer.js';
import { addAlbum, addSong, addThumbnil, deleteAlbum, deleteSong } from './adminController.js';

const adminRouter = express.Router();

adminRouter.post('/album/new',isAuth,uploadfile,addAlbum);
adminRouter.post('/song/new',isAuth,uploadfile,addSong);
adminRouter.post('/song/:id',isAuth,uploadfile,addThumbnil);
adminRouter.delete('/album/:id',isAuth,deleteAlbum);
adminRouter.delete('/song/:id',isAuth,uploadfile,deleteSong)

export default adminRouter;