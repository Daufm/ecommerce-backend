export const validate = (schema) => {
  return (req, res, next) => {
    // Validate request body against the provided schema
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    // Replace request body with the sanitized/validated version
    req.body = value;
    next();
  };
};
