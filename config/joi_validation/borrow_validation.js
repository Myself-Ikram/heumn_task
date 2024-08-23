import Joi from "joi";

// Borrow
export const borrowBookValidation = (body) => {
  const schema = Joi.object({
    bookId: Joi.string().required(),
    borrow_date: Joi.string().required(),
  });

  return schema.validate(body);
};
