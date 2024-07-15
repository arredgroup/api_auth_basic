import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Ruta para crear usuarios
//router.post('/api/v1/users/create', async (req, res) => {
  //try {
    //console.log("Datos recibidos:", req.body); // Verifica los datos recibidos
      //const newUser = new User(req.body); // Crea un nuevo usuario usando los datos del cuerpo de la solicitud
      //await newUser.save(); // Guarda el usuario en la base de datos
      //console.log("Usuario creado:", newUser); // Verifica el usuario creado
      //res.status(201).send(newUser); // Devuelve el usuario creado en la respuesta
  //} catch (err) {
   // console.error("Error al crear usuario:", err);
    //  res.status(400).send(err); // Maneja errores de validación u otros errores
  //}
//});

// GET api/v1/users/getAllUsers
router.get('/getAllUsers', async (req, res) => {
  try {
    const users = await User.find({ active: true });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// GET api/v1/users/findUsers
router.get('/findUsers', async (req, res) => {
  console.log("Received request for /findUsers");
  const { deleted, name, loginBefore, loginAfter } = req.query;
  let filter = {};

  if (deleted !== undefined) filter.deleted = deleted === 'true';
  if (name) filter.name = new RegExp(name, 'i');
  if (loginBefore) filter.lastLogin = { $lte: new Date(loginBefore) };
  if (loginAfter) filter.lastLogin = { $gte: new Date(loginAfter) };

  try {
    console.log("Filter:", filter); // Log del filtro para depuración
    const users = await User.find(filter);
    console.log("Users found:", users); // Log de los usuarios encontrados
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// POST api/v1/users/bulkCreate
router.post('/bulkCreate', async (req, res) => {
  const users = req.body.users;
  let successCount = 0;
  let failureCount = 0;

  for (const userData of users) {
    const user = new User(userData);
    try {
      await user.save();
      successCount++;
    } catch (err) {
      console.error("Error al guardar usuario:", err.message); // Log del error para depuración
      failureCount++;
    }
  }

  res.json({ successCount, failureCount });
});

export default router;






//const express = require('express');
//const router = express.Router();
//const User = require('../models/User');

// GET api/v1/users/getAllUsers
//router.get('/getAllUsers', async (req, res) => {
  //try {
    //const users = await User.find({ active: true });
   // res.json(users);
  //} catch (err) {
   // console.error(err.message);
  //  res.status(500).json({ message: err.message });
 // }
//});

// GET api/v1/users/findUsers
//router.get('/findUsers', async (req, res) => {
  //const { deleted, name, loginBefore, loginAfter } = req.query;
  //let filter = {};

  //if (deleted !== undefined) filter.deleted = deleted === 'true';
  //if (name) filter.name = new RegExp(name, 'i');
  //if (loginBefore) filter.lastLogin = { $lte: new Date(loginBefore) };
  //if (loginAfter) filter.lastLogin = { $gte: new Date(loginAfter) };

  //try {
    //console.log("Filter:", filter); // Log del filtro para depuración
    //const users = await User.find(filter);
    //res.json(users);
  //} catch (err) {
   // console.error(err.message);
  //  res.status(500).json({ message: err.message });
 // }
//});

// POST api/v1/users/bulkCreate
//router.post('/bulkCreate', async (req, res) => {
  //const users = req.body.users;
  //let successCount = 0;
  //let failureCount = 0;

  //for (const userData of users) {
    //const user = new User(userData);
    //try {
      //await user.save();
      //successCount++;
    //} catch (err) {
      //console.error("Error al guardar usuario:", err.message); // Log del error para depuración
     // failureCount++;
   // }
  //}


 // res.json({ successCount, failureCount });
//});

//module.exports = router;
