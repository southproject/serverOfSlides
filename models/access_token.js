/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('access_token', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    client_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    token: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    created_time: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'access_token',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
