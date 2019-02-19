/* jshint indent: 2 */
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_table', {
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    passwd: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    phone_num: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    tableName: 'user_table',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
