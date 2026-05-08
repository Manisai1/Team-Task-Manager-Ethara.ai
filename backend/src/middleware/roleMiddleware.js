const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized",
        })
      }

      if (
        !roles.includes(req.user.role)
      ) {
        return res.status(403).json({
          message: "Access Denied",
        })
      }

      next()
    } catch (err) {
      return res.status(500).json({
        message: "Server Error",
      })
    }
  }
}

module.exports = roleMiddleware