const { db } = require("./db");

exports.count = async () => {
  try {
    const [result] = await db()
      .collection("eoty_users")
      .aggregate([{ $count: "count" }])
      .toArray();

    const count = result ? result.count : 0;

    return count;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getUser = async (filter) => {
  try {
    const user = await db().collection("eoty_users").findOne(filter);
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

validateEmail = (email) => {
  const re = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  return re.test(email);
};

validateUsername = (username) => {
  const re = new RegExp(/^((.+?)#\d{4})/);
  return re.test(username);
};

exports.validate = (email, username) => {
  if (!validateEmail(email)) {
    return {
      valid: false,
      msg: "Email tidak valid",
    };
  }
  if (!validateUsername(username)) {
    return {
      valid: false,
      msg: "Username tidak valid",
    };
  }
  return {
    valid: true,
  };
};
