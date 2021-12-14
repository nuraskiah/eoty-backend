const { db } = require("./db");
const { count, getUser, validate } = require("./helper");

const ErrInternalServer = { message: "internal server error." };
const maxUser = 50;

exports.register = async (req, res) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.username) {
      return res.status(400).send({ message: "all fields required" });
    }

    // validation
    const total = await count();
    if (total >= maxUser) {
      return res.status(403).send({ message: "quota full" });
    }

    const { email, username } = req.body;

    const isValid = validate(email, username);
    if (!isValid.valid) {
      return res.status(400).send({ message: isValid.msg });
    }

    const emailExists = await getUser({ email });
    if (emailExists) {
      return res.status(400).send({ message: "email already registered" });
    }

    const usernameExists = await getUser({ username });
    if (usernameExists) {
      return res.status(400).send({ message: "username already registered" });
    }

    // passed validation
    await db().collection("eoty_users").insertOne(req.body);

    return res
      .status(200)
      .send({ message: "registration success", data: req.body });
  } catch (error) {
    console.log(error);
    return res.status(500).send(ErrInternalServer);
  }
};

exports.count = async (req, res) => {
  try {
    const total = await count();

    res.status(200).send({ total: total, remaining: maxUser - total });
  } catch (error) {
    console.log(error);
    res.status(500).send(ErrInternalServer);
  }
};
