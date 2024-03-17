var express = require('express');
const { addYear, addGoal, getYear, viewGoals, viewGoal, viewGoalsByYear, startGoal, currentGoals, postponeGoal, addActivity, startActivity, currentActivities, postponeActivity, editGoal, deleteGoal, deleteActivity, viewGoalsWithStartedActivitiesCount, completeActivity, completedActivities, updateScheduledStatus } = require('../controller/goalController');

var router = express.Router();

router.get('/getYear',getYear);
router.post('/addYear', addYear);
router.get('/viewGoals',viewGoals)
router.get('/viewGoalsByYear/:year',viewGoalsByYear)
router.get('/viewCurrentGoals',currentGoals)
router.get('/viewGoal/:id',viewGoal)
router.post('/addGoal', addGoal);
router.put('/startGoal/:id', startGoal);
router.put('/postponeGoal/:id', postponeGoal);
router.post('/addActivity',addActivity)
router.put('/startActivity/:id',startActivity)
router.get('/currentActivities',currentActivities)
router.put('/postponeActivity/:id',postponeActivity)
router.put('/editGoal/:id',editGoal)
router.delete('/deleteGoal/:id',deleteGoal)
router.delete('/deleteActivity/:id', deleteActivity)
router.get('/goalsWithStartedActivitiesCount', viewGoalsWithStartedActivitiesCount)
router.put('/completeActivity/:id',completeActivity)
router.get('/completedActivities',completedActivities)
router.put('/updateScheduledStatus/:activityId', updateScheduledStatus)



router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
