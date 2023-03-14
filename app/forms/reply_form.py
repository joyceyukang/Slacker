from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField
from wtforms.validators import DataRequired

class ReplyForm(FlaskForm):
    owner_id = IntegerField('owner_id', validators=[DataRequired()])
    message_id = IntegerField('message_id', validators=[DataRequired()])
    input = StringField('input', validators=[DataRequired()])
    submit = SubmitField('submit')