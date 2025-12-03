const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('m_purch_unitpakai', {
    Id_mpup: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_mpu: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    jml_terpakai: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    keterangan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tgl_update: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'm_purch_unitpakai',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_mpup" },
        ]
      },
    ]
  });
};
