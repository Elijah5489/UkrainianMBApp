from flask import render_template, request, jsonify, redirect, url_for, flash
from app import app, db
from models import Translation, Lesson, CommunityInfo, HeritageInfo, Event, Resource
from forms import TranslationForm, LessonForm, CommunityForm, HeritageForm, EventForm, ResourceForm
from datetime import datetime
from sqlalchemy import or_

@app.route('/')
def index():
    # Get featured content for homepage
    recent_events = Event.query.filter(Event.date >= datetime.now()).order_by(Event.date).limit(3).all()
    featured_community = CommunityInfo.query.limit(3).all()
    featured_heritage = HeritageInfo.query.limit(3).all()
    
    return render_template('index.html', 
                         recent_events=recent_events,
                         featured_community=featured_community,
                         featured_heritage=featured_heritage)

@app.route('/translator')
def translator():
    categories = db.session.query(Translation.category).distinct().all()
    categories = [cat[0] for cat in categories]
    return render_template('translator.html', categories=categories)

@app.route('/api/translations')
def api_translations():
    category = request.args.get('category', 'all')
    search = request.args.get('search', '')
    
    query = Translation.query
    
    if category != 'all':
        query = query.filter(Translation.category == category)
    
    if search:
        query = query.filter(
            or_(
                Translation.ukrainian.contains(search),
                Translation.english.contains(search)
            )
        )
    
    translations = query.all()
    
    return jsonify([{
        'id': t.id,
        'ukrainian': t.ukrainian,
        'english': t.english,
        'pronunciation': t.pronunciation,
        'category': t.category,
        'subcategory': t.subcategory
    } for t in translations])

@app.route('/lessons')
def lessons():
    lessons = Lesson.query.order_by(Lesson.order_index).all()
    return render_template('lessons.html', lessons=lessons)

@app.route('/lessons/<int:lesson_id>')
def lesson_detail(lesson_id):
    lesson = Lesson.query.get_or_404(lesson_id)
    return render_template('lesson_detail.html', lesson=lesson)

@app.route('/community')
def community():
    category = request.args.get('category', 'all')
    
    query = CommunityInfo.query
    if category != 'all':
        query = query.filter(CommunityInfo.category == category)
    
    community_info = query.all()
    categories = db.session.query(CommunityInfo.category).distinct().all()
    categories = [cat[0] for cat in categories]
    
    return render_template('community.html', 
                         community_info=community_info,
                         categories=categories,
                         selected_category=category)

@app.route('/heritage')
def heritage():
    category = request.args.get('category', 'all')
    
    query = HeritageInfo.query
    if category != 'all':
        query = query.filter(HeritageInfo.category == category)
    
    heritage_info = query.all()
    categories = db.session.query(HeritageInfo.category).distinct().all()
    categories = [cat[0] for cat in categories]
    
    return render_template('heritage.html',
                         heritage_info=heritage_info,
                         categories=categories,
                         selected_category=category)

@app.route('/events')
def events():
    upcoming_events = Event.query.filter(Event.date >= datetime.now()).order_by(Event.date).all()
    past_events = Event.query.filter(Event.date < datetime.now()).order_by(Event.date.desc()).limit(10).all()
    
    return render_template('events.html',
                         upcoming_events=upcoming_events,
                         past_events=past_events)

@app.route('/resources')
def resources():
    category = request.args.get('category', 'all')
    
    query = Resource.query
    if category != 'all':
        query = query.filter(Resource.category == category)
    
    resources = query.all()
    categories = db.session.query(Resource.category).distinct().all()
    categories = [cat[0] for cat in categories]
    
    return render_template('resources.html',
                         resources=resources,
                         categories=categories,
                         selected_category=category)

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/admin/translations', methods=['GET', 'POST'])
def admin_translations():
    form = TranslationForm()
    if form.validate_on_submit():
        translation = Translation()
        translation.ukrainian = form.ukrainian.data
        translation.english = form.english.data
        translation.pronunciation = form.pronunciation.data
        translation.category = form.category.data
        translation.subcategory = form.subcategory.data
        translation.difficulty_level = form.difficulty_level.data
        db.session.add(translation)
        db.session.commit()
        flash('Translation added successfully!', 'success')
        return redirect(url_for('admin_translations'))
    
    translations = Translation.query.order_by(Translation.category, Translation.ukrainian).all()
    return render_template('admin.html', form=form, translations=translations, section='translations')

@app.route('/search')
def search():
    query = request.args.get('q', '')
    if not query:
        return redirect(url_for('index'))
    
    # Search across all content
    translation_results = Translation.query.filter(
        or_(
            Translation.ukrainian.contains(query),
            Translation.english.contains(query)
        )
    ).limit(10).all()
    
    community_results = CommunityInfo.query.filter(
        or_(
            CommunityInfo.title.contains(query),
            CommunityInfo.content.contains(query)
        )
    ).limit(10).all()
    
    heritage_results = HeritageInfo.query.filter(
        or_(
            HeritageInfo.title.contains(query),
            HeritageInfo.content.contains(query)
        )
    ).limit(10).all()
    
    event_results = Event.query.filter(
        or_(
            Event.title.contains(query),
            Event.description.contains(query)
        )
    ).limit(10).all()
    
    resource_results = Resource.query.filter(
        or_(
            Resource.title.contains(query),
            Resource.description.contains(query)
        )
    ).limit(10).all()
    
    return render_template('search_results.html',
                         query=query,
                         translation_results=translation_results,
                         community_results=community_results,
                         heritage_results=heritage_results,
                         event_results=event_results,
                         resource_results=resource_results)
