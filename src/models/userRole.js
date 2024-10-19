module.exports = (sequelize, DataTypes, modelDefaultOptions) => {
  const UserRole = sequelize.define(
    "user_role",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      response_data: {
        type: DataTypes.VIRTUAL,
        get() {
          return {
            name: this.name,
          };
        },
        set() {
          throw new Error("Do not try to set the `response_data` value!");
        },
      },
    },
    modelDefaultOptions
  );

  return UserRole;
};
