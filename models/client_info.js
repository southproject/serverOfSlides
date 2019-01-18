/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('client_info', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    client_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    client_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    client_secret: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'client_info',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
