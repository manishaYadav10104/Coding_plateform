const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware');


const problemRouter =  express.Router();
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedProblemByUser} = require('../controllers/userProblem');


problemRouter.post('/create',adminMiddleware, createProblem);
problemRouter.put("/update/:id",adminMiddleware,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);


problemRouter.get("/problemById/:id",userMiddleware,getProblremById);
problemRouter.get("/getAllProblem",userMiddleware,getAllProblems);
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblemsByUser);


module.exports=problemRouter;