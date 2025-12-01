const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emc_customer_company', {
    id_detcompany: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_customer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    company: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    npwp: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    alamat_npwp: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pic_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pic_phone: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    foto_npwp: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    foto_pic: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    foto_ktp: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    foto_kantor: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date_update: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'emc_customer_company',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_detcompany" },
        ]
      },
    ]
  });
};
