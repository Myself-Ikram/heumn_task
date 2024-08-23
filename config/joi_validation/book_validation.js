import Joi from "joi";

// Add Book
export const bookAddValidation = (body) => {
  const schema = Joi.object({
    title: Joi.string().lowercase().required(),
    author: Joi.string().required(),
    isbn: Joi.string().required(),
    genre: Joi.string().valid(
      "Horror",
      "Fiction",
      "Science",
      "Stories",
      "Romance",
      "Novels",
      "Others"
    ),
    publication_date: Joi.string(),
    copies: Joi.number(),
  });

  return schema.validate(body);
};

// Update Book
export const bookUpdateValidation = (body) => {
  const schema = Joi.object({
    title: Joi.string().lowercase(),
    author: Joi.string(),
    isbn: Joi.string(),
    publication_date: Joi.string(),
    genre: Joi.string().valid(
      "Horror",
      "Fiction",
      "Science",
      "Stories",
      "Romance",
      "Novels",
      "Others"
    ),
    copies: Joi.number(),
  });

  return schema.validate(body);
};
