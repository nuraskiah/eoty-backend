const { db } = require("./db");
const { count, getUser, validate } = require("./helper");

const ErrInternalServer = { message: "internal server error." };
const maxUser = 50;

exports.register = async (req, res) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.username) {
      return res.status(400).send({ message: "Semua field harus terisi" });
    }

    // validation
    const total = await count();
    if (total >= maxUser) {
      return res.status(403).send({ message: "Kuota peserta telah habis" });
    }

    const { email, username } = req.body;

    const isValid = validate(email, username);
    if (!isValid.valid) {
      return res.status(400).send({ message: isValid.msg });
    }

    const emailExists = await getUser({ email });
    if (emailExists) {
      return res.status(400).send({ message: "Email telah terdaftar" });
    }

    const usernameExists = await getUser({ username });
    if (usernameExists) {
      return res.status(400).send({ message: "Username telah terdaftar" });
    }

    // passed validation
    await db().collection("eoty_users").insertOne(req.body);

    return res
      .status(200)
      .send({ message: "Registrasi berhasil", data: req.body });
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
