const { Boom } = require("@hapi/boom");

const forgotPassword = (req, res) => {
  const { email } = req.body;

  const user = Users.findOne({
    email,
  });

  if (!user) {
    next(Boom.notFound());

    return;
  }

  const token = Tokens.insert({
    value: generateToken(),
    scope: 'FORGOT_PASSWORD',
  });

  EmailService.send({
    template: 'FORGOT_PASSWORD',
    token: token.value,
  });

  // `/auth/reset-password?token=ABC123`

  // onClickButton -> api /api/auth/reset-password
}
