const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customer_npwp', {
    npwp_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pic_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pic_position: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pic_phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    pic_number: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    pic_email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pic_fax: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    npwp: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address_npwp: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    format_npwp: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address_office: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address_google: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    latitude: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    longitude: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    date_update: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'customer_npwp',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "npwp_id" },
        ]
      },
    ]
  });
};
