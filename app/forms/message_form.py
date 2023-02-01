from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField
from wtforms.validators import DataRequired

class MessageForm(FlaskForm):
    owner_id = IntegerField('owner_id', validators=[DataRequired()])
    channel_id = IntegerField('channel_id', validators=[DataRequired()])
    input = StringField('input', validators=[DataRequired()])
    submit = SubmitField('submit')