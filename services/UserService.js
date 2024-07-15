import db from '../dist/db/models/index.js';
import bcrypt from 'bcrypt';

const createUser = async (req) => {
  const {
    name,
    email,
    password,
    password_second,
    cellphone
  } = req.body;
  if (password !== password_second) {
    return {
      code: 400,
      message: 'Passwords do not match'
    };
  }
  const user = await db.User.findOne({
    where: {
      email: email
    }
  });
  if (user) {
    return {
      code: 400,
      message: 'User already exists'
    };
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const newUser = await db.User.create({
    name,
    email,
    password: encryptedPassword,
    cellphone,
    status: true
  });
  return {
    code: 200,
    message: 'User created successfully with ID: ' + newUser.id,
  }
};

const getUserById = async (id) => {
  return {
    code: 200,
    message: await db.User.findOne({
      where: {
        id: id,
        status: true,
      }
    })
  };
}
const getAll = async () => {
  return {
    code: 200,
    message: await db.User.findAll({
      where: {
        status: true,
      }
    })
  };
}

const createMultipleUsers = async (req) => {

  const users = req.body
  let fail = 0
  let ver = 0
  // console.log(users)
  for (let i = 0; i < users.length; i++) {
    const {
      name,
      email,
      password,
      password_second,
      cellphone
    } = users[i]
    if (password !== password_second) {
      ++fail
      // console.log(fail)
      continue
    }
    const user = await db.User.findOne({
      where: {
        email: email
      }
    });
    if (user) {
      ++fail
      continue
    }
    ver++
    // console.log(ver)
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.User.create({
      name,
      email,
      password: encryptedPassword,
      cellphone,
      status: true
    });
  }
  // console.log(fail)
  // console.log(ver)
  return {
    code: 200,
    message: `Usuarios creados:[${ver}] -- Usuarios no creados:[${fail}]`,
  }
}
const find = async (req) => {

  console.log("req:", req)
  const parametrosEncontrados = {}
  const filterUsers = []
  const usersdb = await db.User.findAll({})
  const sessionsdb = await db.Session.findAll({})
  const users = usersdb.map(user => user.dataValues)
  const session = sessionsdb.map(user => user.dataValues)
  const sessionFilter = session.map(item => ({ createdAt: item.createdAt, id_user: item.id_user }))

  if (req.name) {
    parametrosEncontrados.name = req.name
  }
  if (req.status) {
    parametrosEncontrados.status = req.status.toLowerCase()
  }

  // console.log(parametrosEncontrados)

  let fechaB = new Date(Date.UTC())
  let fechaA = new Date(Date.UTC())

  if (req.logBefore) {
    const fechaSplit = req.logBefore.split('-')
    fechaB = new Date(Date.UTC(parseInt(fechaSplit[0], 10), parseInt(fechaSplit[1], 10) - 1, parseInt(fechaSplit[2], 10), 0, 0, 0, 0))
  }
  if (req.logAfter) {
    const fechaSplit = req.logAfter.split('-')
    fechaA = new Date(Date.UTC(parseInt(fechaSplit[0], 10), parseInt(fechaSplit[1], 10) - 1, parseInt(fechaSplit[2], 10), 0, 0, 0, 0))
  }
  let logB = []
  let logA = []
  // console.log("Fecha Antes:", fechaB)
  // console.log("Fecha Despues:", fechaA)
  sessionFilter.forEach(session => {
    if (fechaB.getTime() > session.createdAt.getTime()) {
      logB.push(session.id_user)
    }
    if (fechaA.getTime() < session.createdAt.getTime()) {
      logA.push(session.id_user)
    }
  })
  const logBset = new Set(logB)
  logB = Array.from(logBset);
  // console.log("logB: ", logB)
  const logAset = new Set(logA)
  logA = Array.from(logAset);
  // console.log("logA: ", logA)

  let usercount = 0
  users.forEach(user => {
    let i = 0
    let j = 0
    ++usercount
    Object.entries(parametrosEncontrados).forEach(([key, value]) => {
      ++j
      if ((user[key] !== undefined) && (String(user[key]).includes(String(value)))) {
        ++i
      }
    })
    if (req.logBefore) {
      ++j
      if (logB.length !== 0) {
        logB.forEach(el => {
          if (user.id === el) {
            ++i
          }
        })
      }
    }
    if (req.logAfter) {
      ++j
      if (logA.length !== 0) {
        logA.forEach(el => {
          if (user.id === el) {
            ++i
          }
        })
      }
    }
    if (i === j)
      filterUsers.push(user)
  })
  return {
    code: 200,
    message: filterUsers
  }
}

const updateUser = async (req) => {
  const user = db.User.findOne({
    where: {
      id: req.params.id,
      status: true,
    }
  });
  const payload = {};
  payload.name = req.body.name ?? user.name;
  payload.password = req.body.password ? await bcrypt.hash(req.body.password, 10) : user.password;
  payload.cellphone = req.body.cellphone ?? user.cellphone;
  await db.User.update(payload, {
    where: {
      id: req.params.id
    }

  });
  return {
    code: 200,
    message: 'User updated successfully'
  };
}

const deleteUser = async (id) => {
  /* await db.User.destroy({
      where: {
          id: id
      }
  }); */
  const user = db.User.findOne({
    where: {
      id: id,
      status: true,
    }
  });
  await db.User.update({
    status: false
  }, {
    where: {
      id: id
    }
  });
  return {
    code: 200,
    message: 'User deleted successfully'
  };
}

export default {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAll,
  createMultipleUsers, find
}