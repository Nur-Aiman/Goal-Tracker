const express = require('express');
const { pool } = require('../config/database'); 

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

module.exports = {
  addYear: async function(req, res) {
    const { year } = req.body;


    if (!year || isNaN(parseInt(year))) {
      return res.status(400).json({ error: 'A valid year is required' });
    }

    try {

      const existingYearCheck = 'SELECT * FROM years WHERE year_id = $1';
      const { rows } = await pool.query(existingYearCheck, [year]);

  
      if (rows.length > 0) {
        return res.status(409).json({ message: 'Year already exists' });
      }


      const insertQuery = 'INSERT INTO years (year_id) VALUES ($1)';
      await pool.query(insertQuery, [year]);
      return res.status(201).json({ message: 'Year added successfully' });

    } catch (error) {
 
      console.error('Error executing query:', error.message);
      return res.status(500).json({ error: 'Error processing your request' });
    }
  },

  getYear: async function(req, res) {
    try {
      const getYearsQuery = 'SELECT * FROM years ORDER BY year_id ASC';
      const result = await pool.query(getYearsQuery);
      if (result.rows.length > 0) {
        res.status(200).json(result.rows);
      } else {
        res.status(404).json({ message: 'No years found' });
      }
    } catch (error) {
      console.error('Error fetching years:', error.message);
      res.status(500).json({ error: 'Error fetching years' });
    }
  },
  

  addGoal: async function(req, res) {

    const {
      goal,
      category,
      planStartMonth,
      planStartYear,
      planCompleteMonth,
      planCompleteYear,
      intention,
      why,
      how,
      year,
      specific,
      measurable,
      attainable,
      relevant,
      timeBound
    } = req.body;
  

    const allFields = [goal, category, planStartMonth, planStartYear, planCompleteMonth, planCompleteYear, intention, why, how, year, specific, measurable, attainable, relevant, timeBound];
    if (allFields.includes(undefined) || allFields.includes('')) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
 
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
  
     
      const smartInsertQuery = `
        INSERT INTO smart (specific, measurable, attainable, realistic, time_bound)
        VALUES ($1, $2, $3, $4, $5) RETURNING id;
      `;
      const smartRes = await client.query(smartInsertQuery, [specific, measurable, attainable, relevant, timeBound]);
      const smartId = smartRes.rows[0].id;
  

      const goalsInsertQuery = `
    INSERT INTO goals (goal, category, plan_start, plan_end, intention, why, how, year, status, smart_id, activities)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, $10);
  `;
  const planStart = `${planStartYear}-${planStartMonth}-01`; 
  const planEnd = `${planCompleteYear}-${planCompleteMonth}-01`; 
  const defaultActivities = []; 

  await client.query(goalsInsertQuery, [
    goal,
    category,
    planStart,
    planEnd,
    intention,
    why,
    how,
    year,
    smartId,
    defaultActivities
  ]);
  
      await client.query('COMMIT');
      res.status(201).json({ message: 'Goal and SMART criteria added successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error executing query:', error.message);
      res.status(500).json({ error: 'Error adding goal and SMART criteria: ' + error.message });
    } finally {
      client.release();
    }
  },

  viewGoals: async function(req, res) {
    try {
      const viewGoalsQuery = `
        SELECT g.*, s.specific, s.measurable, s.attainable, s.realistic, s.time_bound 
        FROM goals g 
        JOIN smart s ON g.smart_id = s.id
        ORDER BY g.id ASC;
      `;
      const result = await pool.query(viewGoalsQuery);
      if (result.rows.length > 0) {
        res.status(200).json(result.rows);
      } else {
        res.status(404).json({ message: 'No goals found' });
      }
    } catch (error) {
      console.error('Error fetching goals:', error.message);
      res.status(500).json({ error: 'Error fetching goals' });
    }
  },

  viewGoalsByYear: async function(req, res) {
    const { year } = req.params;
    try {
      const viewGoalsByYearQuery = `
        SELECT g.*, s.specific, s.measurable, s.attainable, s.realistic, s.time_bound 
        FROM goals g 
        JOIN smart s ON g.smart_id = s.id
        JOIN years y ON g.year = y.year_id
        WHERE y.year_id = $1 AND g.status = 'pending'
        ORDER BY g.id ASC;
      `;
      const result = await pool.query(viewGoalsByYearQuery, [year]);
      if (result.rows.length > 0) {
        res.status(200).json(result.rows);
      } else {
        res.status(404).json({ message: 'No goals found for the specified year' });
      }
    } catch (error) {
      console.error('Error fetching goals for the specified year:', error.message);
      res.status(500).json({ error: 'Error fetching goals for the specified year' });
    }
  },
  
  
  

  viewGoal: async function(req, res) {
    const goalId = req.params.id;
    try {
      const viewGoalQuery = `
        SELECT g.*, s.specific, s.measurable, s.attainable, s.realistic, s.time_bound 
        FROM goals g 
        JOIN smart s ON g.smart_id = s.id
        WHERE g.id = $1;
      `;
      const result = await pool.query(viewGoalQuery, [goalId]);
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Goal not found' });
      }
    } catch (error) {
      console.error('Error fetching goal:', error.message);
      res.status(500).json({ error: 'Error fetching goal' });
    }
  },

  currentGoals: async function(req, res) {
    const currentYear = new Date().getFullYear();
    try {
      const currentGoalsQuery = `
        SELECT g.*, s.specific, s.measurable, s.attainable, s.realistic, s.time_bound,
          json_agg(json_build_object('id', a.id, 'activity', a.activity)) as activities
        FROM goals g
        JOIN smart s ON g.smart_id = s.id
        LEFT JOIN activities a ON a.associated_goal = g.id AND a.status = 'pending'
        JOIN years y ON g.year = y.year_id
        WHERE y.year_id = $1 AND g.status = 'started'
        GROUP BY g.id, s.id
        ORDER BY g.id ASC;
      `;
      const result = await pool.query(currentGoalsQuery, [currentYear]);
      if (result.rows.length > 0) {
        res.status(200).json(result.rows);
      } else {
        res.status(404).json({ message: 'No current year goals found with status started' });
      }
    } catch (error) {
      console.error('Error fetching current year goals:', error.message);
      res.status(500).json({ error: 'Error fetching current year goals' });
    }
  },
  
  
  

  startGoal: async function(req, res) {
    const goalId = req.params.id; 
    const currentYear = new Date().getFullYear();
  
    try {

      const startGoalQuery = `
        UPDATE goals
        SET status = 'started'
        FROM years
        WHERE goals.id = $1 AND goals.year = years.year_id AND years.year_id = $2;
      `;
      await pool.query(startGoalQuery, [goalId, currentYear]);
  
      const checkUpdateQuery = `SELECT * FROM goals WHERE id = $1;`;
      const { rows } = await pool.query(checkUpdateQuery, [goalId]);
  
      if (rows[0].status === 'started') {
        res.status(200).json({ message: 'Goal status updated to started' });
      } else {
        res.status(404).json({ message: 'Goal not found or not updated' });
      }
    } catch (error) {
      console.error('Error updating goal status:', error.message);
      res.status(500).json({ error: 'Error updating goal status' });
    }
  },

  postponeGoal: async function(req, res) {
    const goalId = req.params.id; 
    const currentYear = new Date().getFullYear();
    console.log(currentYear);
    try {

      const startGoalQuery = `
        UPDATE goals
        SET status = 'pending'
        FROM years
        WHERE goals.id = $1 AND goals.year = years.year_id AND years.year_id = $2;
      `;
      await pool.query(startGoalQuery, [goalId, currentYear]);
  
     
      const checkUpdateQuery = `SELECT * FROM goals WHERE id = $1;`;
      const { rows } = await pool.query(checkUpdateQuery, [goalId]);
  
      if (rows[0].status === 'pending') {
        res.status(200).json({ message: 'Goal status updated to pending' });
      } else {
        res.status(404).json({ message: 'Goal not found or not updated' });
      }
    } catch (error) {
    
      console.error('Error updating goal status:', error.message);
      res.status(500).json({ error: 'Error updating goal status' });
    }
  },

  addActivity: async function(req, res) {
    const { activity, category, goalId } = req.body;

    if (!activity || !category || !goalId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertActivityQuery = `
        INSERT INTO activities (activity, category, associated_goal, status)
        VALUES ($1, $2, $3, 'pending') RETURNING id;
      `;
      const activityRes = await client.query(insertActivityQuery, [activity, category, goalId]);
      const activityId = activityRes.rows[0].id;

      const updateGoalsQuery = `
        UPDATE goals
        SET activities = array_append(activities, $1)
        WHERE id = $2;
      `;
      await client.query(updateGoalsQuery, [activityId, goalId]);

      await client.query('COMMIT');
      res.status(201).json({ message: 'Activity added successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error executing query:', error.message);
      res.status(500).json({ error: 'Error processing your request' });
    } finally {
      client.release();
    }
  },

  startActivity: async function(req, res) {
    const activityId = req.params.id; 
  
    try {
 
      const startActivityQuery = `
        UPDATE activities
        SET status = 'started'
        WHERE id = $1 AND status = 'pending';
      `;
      const result = await pool.query(startActivityQuery, [activityId]);
  
   
      if (result.rowCount > 0) {
        res.status(200).json({ message: 'Activity status updated to started' });
      } else {
        res.status(404).json({ message: 'Activity not found or already started' });
      }
    } catch (error) {
 
      console.error('Error updating activity status:', error.message);
      res.status(500).json({ error: 'Error updating activity status' });
    }
  },

  currentActivities: async function(req, res) {
    try {
      const currentActivitiesQuery = `
        SELECT a.id, a.activity, a.category, g.goal
        FROM activities a
        JOIN goals g ON a.associated_goal = g.id
        WHERE a.status = 'started'
        ORDER BY a.category, a.id ASC;
      `;
      const result = await pool.query(currentActivitiesQuery);
      if (result.rows.length > 0) {
        res.status(200).json(result.rows);
      } else {
        res.status(404).json({ message: 'No started activities found' });
      }
    } catch (error) {
      console.error('Error fetching activities:', error.message);
      res.status(500).json({ error: 'Error fetching activities' });
    }
  },

  postponeActivity: async function(req, res) {
    const activityId = req.params.id; 
  
    try {
    
      const postponeActivityQuery = `
        UPDATE activities
        SET status = 'pending'
        WHERE id = $1 AND status = 'started';
      `;
      const result = await pool.query(postponeActivityQuery, [activityId]);
  
     
      if (result.rowCount > 0) {
        res.status(200).json({ message: 'Activity status updated to pending' });
      } else {
        res.status(404).json({ message: 'Activity not found or not in started status' });
      }
    } catch (error) {

      console.error('Error updating activity status:', error.message);
      res.status(500).json({ error: 'Error updating activity status' });
    }
  },

  editGoal: async function(req, res) {
    const goalId = req.params.id; 
    const {
      goal,
      category,
      planStartMonth,
      planStartYear,
      planCompleteMonth,
      planCompleteYear,
      intention,
      why,
      how,
      year,
      specific,
      measurable,
      attainable,
      relevant,
      timeBound
    } = req.body;
  
  
    if (!goalId || !goal || !category || !planStartMonth || !planStartYear || !planCompleteMonth || !planCompleteYear) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
   
      const client = await pool.connect();
      await client.query('BEGIN');
  
    
      const smartUpdateQuery = `
        UPDATE smart
        SET specific = $1, measurable = $2, attainable = $3, realistic = $4, time_bound = $5
        FROM goals
        WHERE goals.smart_id = smart.id AND goals.id = $6;
      `;
      await client.query(smartUpdateQuery, [specific, measurable, attainable, relevant, timeBound, goalId]);
  
    
      const goalUpdateQuery = `
        UPDATE goals
        SET goal = $1, category = $2, plan_start = $3, plan_end = $4, intention = $5, why = $6, how = $7, year = $8
        WHERE id = $9;
      `;
      const planStart = `${planStartYear}-${months.indexOf(planStartMonth) + 1}-01`; // Assuming a format of YYYY-MM-DD
      const planEnd = `${planCompleteYear}-${months.indexOf(planCompleteMonth) + 1}-01`;
      await client.query(goalUpdateQuery, [goal, category, planStart, planEnd, intention, why, how, year, goalId]);
  
  
      await client.query('COMMIT');
  
      res.status(200).json({ message: 'Goal updated successfully' });
    } catch (error) {
 
      await client.query('ROLLBACK');
      console.error('Error updating goal:', error.message);
      res.status(500).json({ error: 'Error updating goal' });
    }
  },


  deleteGoal: async function(req, res) {
    const goalId = req.params.id; 
  
    if (!goalId) {
      return res.status(400).json({ error: 'Goal ID is required' });
    }
  
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
    
      const deleteActivitiesQuery = 'DELETE FROM activities WHERE associated_goal = $1';
      await client.query(deleteActivitiesQuery, [goalId]);
  
  
      const selectSmartIdQuery = 'SELECT smart_id FROM goals WHERE id = $1';
      const smartResult = await client.query(selectSmartIdQuery, [goalId]);
      const smartId = smartResult.rows[0]?.smart_id;
  
  
      const deleteGoalQuery = 'DELETE FROM goals WHERE id = $1';
      await client.query(deleteGoalQuery, [goalId]);
  
    
      if (smartId) {
        const deleteSmartQuery = 'DELETE FROM smart WHERE id = $1';
        await client.query(deleteSmartQuery, [smartId]);
      }
  
      await client.query('COMMIT');
      res.status(200).json({ message: 'Goal and related data deleted successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error deleting goal:', error.message);
      res.status(500).json({ error: 'Error deleting goal' });
    } finally {
      client.release();
    }
  },

  deleteActivity: async function(req, res) {
    const activityId = req.params.id;
  
    if (!activityId) {
      return res.status(400).json({ error: 'Activity ID is required' });
    }
  
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
   
      const getGoalQuery = 'SELECT associated_goal FROM activities WHERE id = $1';
      const goalResult = await client.query(getGoalQuery, [activityId]);
      const goalId = goalResult.rows[0]?.associated_goal;
  

      const deleteActivityQuery = 'DELETE FROM activities WHERE id = $1';
      await client.query(deleteActivityQuery, [activityId]);
  
   
      if (goalId) {
        const updateGoalQuery = `
          UPDATE goals
          SET activities = array_remove(activities, $1)
          WHERE id = $2;
        `;
        await client.query(updateGoalQuery, [parseInt(activityId), goalId]);
      }
  
      await client.query('COMMIT');
      res.status(200).json({ message: 'Activity deleted successfully and goal updated' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error deleting activity:', error.message);
      res.status(500).json({ error: 'Error deleting activity' });
    } finally {
      client.release();
    }
  },

  viewGoalsWithStartedActivitiesCount: async function(req, res) {
    try {
      const viewGoalsWithActivitiesQuery = `
        SELECT g.id, g.goal, COUNT(a.id) FILTER (WHERE a.status = 'started') AS started_activities_count
        FROM goals g
        LEFT JOIN activities a ON g.id = a.associated_goal
        GROUP BY g.id
        ORDER BY g.id ASC;
      `;
  
      const { rows } = await pool.query(viewGoalsWithActivitiesQuery);
  
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(404).json({ message: 'No goals found' });
      }
    } catch (error) {
      console.error('Error fetching goals with started activities count:', error.message);
      res.status(500).json({ error: 'Error fetching goals with started activities count' });
    }
  },
  
  
};
