from tokenize import String
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, EmailField
from wtforms.validators import DataRequired, EqualTo

class RegisterForm(FlaskForm):
  userid = StringField('userid', validators=[DataRequired()])
  username = StringField('username', validators=[DataRequired()])
  password = PasswordField('password', validators=[DataRequired()])
  email = EmailField('email', validators=[DataRequired()])
  