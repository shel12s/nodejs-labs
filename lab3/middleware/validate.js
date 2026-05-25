import Joi from "joi";

export function validate(schema) {
    return function (req, res, next) {
        const data = req.body;

        const { error } = schema.validate(data, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                success: false,
                errors: error.details.map(item => item.message)
            });
        }

        next();
    };
}
