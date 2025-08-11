from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, DateTimeField
from wtforms.validators import DataRequired, Length, Optional

class TranslationForm(FlaskForm):
    ukrainian = StringField('Ukrainian Text', validators=[DataRequired(), Length(max=500)])
    english = StringField('English Text', validators=[DataRequired(), Length(max=500)])
    pronunciation = StringField('Pronunciation', validators=[Length(max=500)])
    category = SelectField('Category', choices=[
        ('greetings', 'Greetings'),
        ('emergency', 'Emergency'),
        ('healthcare', 'Healthcare'),
        ('government', 'Government Services'),
        ('employment', 'Employment'),
        ('housing', 'Housing'),
        ('education', 'Education'),
        ('transportation', 'Transportation'),
        ('shopping', 'Shopping'),
        ('conversation', 'Basic Conversation')
    ], validators=[DataRequired()])
    subcategory = StringField('Subcategory', validators=[Length(max=100)])
    difficulty_level = SelectField('Difficulty Level', choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ], default='beginner')

class LessonForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=200)])
    description = TextAreaField('Description')
    content = TextAreaField('Content', validators=[DataRequired()])
    level = SelectField('Level', choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ], validators=[DataRequired()])
    order_index = StringField('Order Index', default='0')

class CommunityForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=200)])
    content = TextAreaField('Content', validators=[DataRequired()])
    category = SelectField('Category', choices=[
        ('cultural_centers', 'Cultural Centers'),
        ('religious', 'Religious Organizations'),
        ('organizations', 'Community Organizations'),
        ('businesses', 'Ukrainian Businesses'),
        ('media', 'Media'),
        ('sports', 'Sports & Recreation')
    ], validators=[DataRequired()])
    contact_info = TextAreaField('Contact Information')
    website = StringField('Website', validators=[Length(max=300)])
    address = StringField('Address', validators=[Length(max=300)])
    phone = StringField('Phone', validators=[Length(max=50)])

class HeritageForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=200)])
    content = TextAreaField('Content', validators=[DataRequired()])
    category = SelectField('Category', choices=[
        ('history', 'History'),
        ('culture', 'Culture'),
        ('architecture', 'Architecture'),
        ('people', 'Notable People'),
        ('traditions', 'Traditions'),
        ('language', 'Language')
    ], validators=[DataRequired()])
    historical_period = StringField('Historical Period', validators=[Length(max=100)])

class EventForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=200)])
    description = TextAreaField('Description')
    date = DateTimeField('Date & Time', validators=[DataRequired()])
    location = StringField('Location', validators=[Length(max=300)])
    organizer = StringField('Organizer', validators=[Length(max=200)])
    contact_info = StringField('Contact Information', validators=[Length(max=300)])
    category = SelectField('Category', choices=[
        ('cultural', 'Cultural'),
        ('educational', 'Educational'),
        ('religious', 'Religious'),
        ('social', 'Social'),
        ('business', 'Business'),
        ('sports', 'Sports')
    ])

class ResourceForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=200)])
    description = TextAreaField('Description')
    category = SelectField('Category', choices=[
        ('government', 'Government Services'),
        ('healthcare', 'Healthcare'),
        ('education', 'Education'),
        ('employment', 'Employment'),
        ('housing', 'Housing'),
        ('legal', 'Legal Services'),
        ('financial', 'Financial Services'),
        ('transportation', 'Transportation')
    ], validators=[DataRequired()])
    contact_info = TextAreaField('Contact Information')
    website = StringField('Website', validators=[Length(max=300)])
    address = StringField('Address', validators=[Length(max=300)])
    phone = StringField('Phone', validators=[Length(max=50)])
    hours = StringField('Hours', validators=[Length(max=200)])
