'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    startDate: DataTypes.DATE,
    dueDate: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    attache: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsTo(models.User);
  };
  return Transaction;
};