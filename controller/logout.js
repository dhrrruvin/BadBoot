const logout = async (req, res, next) => {
  res.cookie("jwt", null, { expires: new Date(0) });
  res.redirect("/");
};

module.exports = logout;
