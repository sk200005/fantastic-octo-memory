exports.testServer = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend working properly"
  });
};