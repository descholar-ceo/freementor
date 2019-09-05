import express from 'express';
import permissionMw from '../../middleware/permission';
import AdminController from '../../controllers/AdminController';
import AuthMw from '../../middleware/auth';

const router = express.Router();
const {authorization,tokenVerify}=AuthMw;
const {isAdmin}=permissionMw;



/* User to admin*/
router.patch('/admin/:userId',
  authorization,
  tokenVerify,
  AdminController.userToAdmin);

/* admin to normal user*/
router.patch('/admin-to/:userId/',
  authorization,
  tokenVerify,
  isAdmin,
  AdminController.adminToUser);

/* User to mentor*/
router.patch('/user/:userId',
  authorization,
  tokenVerify,
  isAdmin,
  AdminController.userToMentor);

/* Mentor to user*/
router.patch('/mentor/:mentorId',
  authorization,
  tokenVerify,
  isAdmin,
  AdminController.mentorToUser);

export default router;