const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_customer', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sales: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    foto: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status_aktif: {
      type: DataTypes.ENUM('Y','N'),
      allowNull: false,
      defaultValue: "N"
    },
    masa_aktif: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tgl_reg: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_session: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tgl_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status_login: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'm_customer',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id_customer",
        using: "BTREE",
        fields: [
          { name: "id_customer" },
        ]
      },
    ]
  });
};
