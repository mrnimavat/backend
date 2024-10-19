module.exports = (sequelize, DataTypes, modelDefaultOptions) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.STRING(70),
        defaultValue: DataTypes.UUIDV4,
      },
      first_name: {
        type: DataTypes.STRING(30),
      },
      last_name: {
        type: DataTypes.STRING(30),
      },
      email: {
        type: DataTypes.STRING(300),
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      user_role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "user_role",
          key: "id",
        },
      },
      token: {
        type: DataTypes.STRING,
      },
      expiration_time: {
        type: DataTypes.DATE,
      },
      response_data: {
        type: DataTypes.VIRTUAL,
        get() {
          return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            user_id: this.user_id,
            token: this.token,
            user_role_id: this.user_role_id,
            expiration_time: this.expiration_time,
          };
        },
        set() {
          throw new Error("Do not try to set the `response_data` value!");
        },
      },
    },
    modelDefaultOptions
  );

  User.associate = function (models) {};

  return User;
};
