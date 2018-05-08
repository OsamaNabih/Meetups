const Joi = require('joi');

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      req.body.birthDate = Number(req.body.birthDate.split('-').join(''));
      /*
      let arr = req.body.birthDate.split("-"); // We'll assume months < 10 are prefixed with 0 e.g. 03 for March
      let arr2 = [arr[2], arr[1],arr[0]];
      arr2 = Number(arr2.join(''));
      req.body.birthDate = arr2;
      */
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        console.log(result.error.message);
        return res.status(400).json(result.error);
      }

      if (!req.value) { req.value = {};}
      req.value['body'] = result.value;
      req.value.body['birthDate'] = req.body.birthDate;
      next();
      // req.value.body instead req.body
    }
  },

  schemas: {
    signupAuthSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      authField: Joi.string().required().min(7).max(30),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      position: Joi.string(),
      birthDate: Joi.date().min('1-1-1910').max(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)
    })
  }
}
