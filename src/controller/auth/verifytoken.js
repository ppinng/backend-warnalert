const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  //console.log(req.headers);
  const token = req.headers["authorization"];
  if (token === undefined) {
    // console.log(token);

    return res.status(401).send({
      error: "Token is not present",
    });
  }
  if (typeof token !== "string" || !token.startsWith("Bearer ")) {
    return res.status(401).send({
      error: "Invalid token format",
    });
  }

  // if (!token) return res.status(401).send("Access Denied");
  // try {
  //   const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  //   req.user = decoded;
  // } catch (error) {
  //   res.status(400).send("Invalid token");
  // }
  // return next();
  
  const tokenValue = token.slice(7);
  jwt.verify(tokenValue, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.json({
        error: true,
        message: "Invalid token",
      });
    } else {
      req.user = user;
      next();
    }
  });
};

module.exports = verifyToken;
