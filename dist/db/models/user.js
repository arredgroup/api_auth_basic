import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Asegúrate de que sequelize esté correctamente configurado

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lastLogin: {
    type: DataTypes.DATE,
  },
  // Añade otros campos necesarios para tu usuario
});

export default User;
