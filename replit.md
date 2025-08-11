# Ukrainian Community Winnipeg App

## Overview

This is a Progressive Web App (PWA) designed to support Ukrainian newcomers to Winnipeg, Canada. The application provides essential tools for language translation, English learning, community resources, cultural heritage information, and local events. Built with Flask, it serves as a comprehensive digital bridge helping Ukrainian immigrants navigate their new home while maintaining cultural connections.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a traditional server-side rendered approach with Flask templates and Bootstrap 5 for responsive design. The frontend is enhanced with vanilla JavaScript modules for interactive features including:
- Voice translation capabilities using Web Speech API
- Progressive Web App functionality with service worker
- Responsive design optimized for mobile-first usage
- Offline capability for essential translation features

### Backend Architecture
Built on Flask with a modular structure:
- **App Factory Pattern**: Main application setup in `app.py` with SQLAlchemy ORM
- **Model-View-Controller**: Clear separation with dedicated `models.py`, `routes.py`, and template files
- **Form Handling**: WTForms integration for secure form processing and validation
- **Database Layer**: SQLAlchemy with declarative base class for ORM operations

### Data Storage
The application uses SQLAlchemy ORM with support for multiple database backends:
- **Development**: SQLite database for local development
- **Production**: PostgreSQL support via DATABASE_URL environment variable
- **Models**: Five core entities - Translations, Lessons, CommunityInfo, HeritageInfo, and Events
- **Migration Strategy**: Database tables created automatically on startup with default data initialization

### Content Management
A built-in admin interface allows community members to contribute content:
- Translation phrase management with categories and difficulty levels
- English lesson creation and organization
- Community resource directory maintenance
- Cultural heritage content curation
- Event management and calendar integration

### Progressive Web App Features
Full PWA implementation for native app-like experience:
- **Service Worker**: Aggressive caching strategy for offline functionality
- **Web App Manifest**: Installation prompts and app-like behavior
- **Responsive Design**: Mobile-optimized interface with touch-friendly controls
- **Performance**: Lazy loading and optimized asset delivery

## External Dependencies

### Core Framework Dependencies
- **Flask**: Web framework with SQLAlchemy for database operations
- **Bootstrap 5**: CSS framework for responsive design and components
- **WTForms**: Form handling and validation library
- **Feather Icons**: Icon system for consistent UI elements

### Browser APIs
- **Web Speech API**: Speech recognition and synthesis for translation features
- **Service Worker API**: Background processing and offline functionality
- **Web App Manifest**: PWA installation and app behavior

### Development Tools
- **Werkzeug**: WSGI utilities and development server
- **SQLAlchemy**: Database ORM and migration support

### Content Delivery
- **Bootstrap CDN**: External CSS and JavaScript delivery
- **Feather Icons CDN**: Icon font and SVG delivery system

The application is designed to be deployable on various platforms with minimal configuration, supporting both development and production environments through environment variable configuration.