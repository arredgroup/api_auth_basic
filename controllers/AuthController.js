import express from 'express';
import { User } from '../models'; // Asegúrate de que el modelo User esté correctamente definido y exportado

const router = express.Router();

// GET api/v1/users/getAllUsers
router.get('/getAllUsers', async (req, res) => {
  try {
    const users = await User.findAll({ where: { isActive: true } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
});

// GET api/v1/users/findUsers
router.get('/findUsers', async (req, res) => {
  const { deleted, name, loginBefore, loginAfter } = req.query;
  const where = {};

  if (deleted !== undefined) {
    where.deleted = deleted === 'true';
  }
  if (name) {
    where.name = { [Op.like]: `%${name}%` }; // Requires Sequelize's Op module
  }
  if (loginBefore) {
    where.lastLogin = { ...where.lastLogin, [Op.lt]: new Date(loginBefore) };
  }
  if (loginAfter) {
    where.lastLogin = { ...where.lastLogin, [Op.gt]: new Date(loginAfter) };
  }

  try {
    const users = await User.findAll({ where });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error finding users', error });
  }
});

// POST api/v1/users/bulkCreate
router.post('/bulkCreate', async (req, res) => {
  const users = req.body;
  let successCount = 0;
  let failureCount = 0;

  for (const user of users) {
    try {
      await User.create(user);
      successCount++;
    } catch (error) {
      failureCount++;
    }
  }

  res.status(200).json({
    message: 'Bulk create operation completed',
    successCount,
    failureCount,
  });
});

export default router;
