const { User, UserRole } = require("../models/");
const {
  successData,
  errorData,
  getHash,
  generateToken,
} = require("../utils/utils");
const { USER_ROLES, USER_ROLES_ID } = require("../constant/appConstant");
const Joi = require("joi");

const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const createUser = async (req, res) => {
  const reqSchema = Joi.object({
    first_name: Joi.string()
      .min(1)
      .max(30)
      .regex(/^[a-zA-Z' ]*$/)
      .required()
      .messages({
        "string.base": "First name must be a string.",
        "string.empty": "First name is required.",
        "string.min": "First name must be at least 1 character long.",
        "string.max":
          "First name must be less than or equal to 30 characters long.",
        "string.pattern.base":
          "First name can only contain letters, spaces, and apostrophes.",
      }),
    last_name: Joi.string()
      .min(1)
      .max(30)
      .regex(/^[a-zA-Z' ]*$/)
      .required()
      .messages({
        "string.base": "Last name must be a string.",
        "string.empty": "Last name is required.",
        "string.min": "Last name must be at least 1 character long.",
        "string.max":
          "Last name must be less than or equal to 30 characters long.",
        "string.pattern.base":
          "Last name can only contain letters, spaces, and apostrophes.",
      }),
    email: Joi.string().pattern(regexEmail).required().messages({
      "string.empty": "Email is required!",
      "string.pattern.base": "Please enter a valid email address!",
    }),
    password: Joi.string().pattern(regexPassword).required().messages({
      "string.empty": "Password is required!",
      "string.pattern.base":
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a digit.",
    }),
    source_page: Joi.string().valid("Customer", "Admin").required(),
  });
  const { value, error } = reqSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error && value) {
    return errorData(res, error, 400);
  }

  const { first_name, last_name, email, source_page, password } = value;

  const emailId = await User.findOne({
    where: {
      email: email,
    },
  });

  if (emailId) {
    return errorData(res, { message: "Email Id already exists" }, 400);
  }

  const encryptPass = await getHash(password);
  const user = await User.create({
    first_name,
    last_name,
    email,
    password: encryptPass,
    user_role_id:
      source_page === "Customer" ? USER_ROLES_ID.CUSTOMER : USER_ROLES_ID.ADMIN,
  });

  return successData(
    res,
    {
      message: "Successfully created",
      data: user.response_data,
    },
    200
  );
};

const loginUser = async (req, res) => {
  const reqSchema = Joi.object({
    email: Joi.string().pattern(regexEmail).required().messages({
      "string.empty": "Email is required!",
      "string.pattern.base": "Please enter a valid email address!",
    }),
    password: Joi.string().pattern(regexPassword).required().messages({
      "string.empty": "Password is required!",
      "string.pattern.base":
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a digit.",
    }),
    source_page: Joi.string().valid("Customer", "Admin").required(),
  });

  const { value, error } = reqSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error && value) {
    return errorData(res, error, 400);
  }
  const { email, password, source_page } = value;
  const encryptPass = getHash(password);

  const userInstance = await User.findOne({
    where: {
      email: email,
    },
  });

  if (!userInstance) {
    return errorData(res, { message: "Invalid credentials" }, 400);
  }

  if (encryptPass !== userInstance.password) {
    return errorData(res, { message: "Invalid credentials" }, 400);
  }

  const userRoleInstance = await UserRole.findOne({
    where: {
      id: userInstance.user_role_id,
    },
  });
  if (
    source_page === "Admin" &&
    userRoleInstance.name === USER_ROLES.CUSTOMER
  ) {
    return errorData(
      res,
      { message: "You are not allowed to login from here" },
      400
    );
  }

  const accessToken = generateToken(userInstance.user_id);
  userInstance.token = accessToken;
  await userInstance.save();
  return successData(res, {
    token: accessToken,
    userData: userInstance.response_data,
  });
};

const logoutUser = async (req, res) => {
  const user_id = req.params.uuid;

  const userInstance = await User.findOne({ where: { user_id } });
  userInstance.token = null;
  await userInstance.save();
  return successData(res, { msg: "Successful Logout", redirect: `/` });
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
};
