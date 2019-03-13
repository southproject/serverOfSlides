/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_role', {
    user_role_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    role_name: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    tableName: 'user_role',
    timestamps:false,
    paranoid:true,
    underscored:false,
    version:false
  });
};
