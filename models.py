from app import db
from datetime import datetime
from sqlalchemy import Text

class Translation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ukrainian = db.Column(db.String(500), nullable=False)
    english = db.Column(db.String(500), nullable=False)
    pronunciation = db.Column(db.String(500))
    category = db.Column(db.String(100), nullable=False)
    subcategory = db.Column(db.String(100))
    difficulty_level = db.Column(db.String(20), default='beginner')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Lesson(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(Text)
    content = db.Column(Text, nullable=False)
    level = db.Column(db.String(20), nullable=False)
    order_index = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class CommunityInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    contact_info = db.Column(Text)
    website = db.Column(db.String(300))
    address = db.Column(db.String(300))
    phone = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class HeritageInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    historical_period = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(Text)
    date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(300))
    organizer = db.Column(db.String(200))
    contact_info = db.Column(db.String(300))
    category = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Resource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(Text)
    category = db.Column(db.String(100), nullable=False)
    contact_info = db.Column(Text)
    website = db.Column(db.String(300))
    address = db.Column(db.String(300))
    phone = db.Column(db.String(50))
    hours = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

def initialize_default_data():
    """Initialize the database with essential translation data and basic content"""
    
    # Check if we already have data
    if Translation.query.first():
        return
    
    # Essential translations for newcomers
    translations_data = [
        # Greetings
        ("Привіт", "Hello", "Pry-veet", "greetings", "basic"),
        ("Добрий день", "Good day", "Do-bryy den", "greetings", "basic"),
        ("До побачення", "Goodbye", "Do po-ba-chen-nya", "greetings", "basic"),
        ("Дякую", "Thank you", "Dya-ku-yu", "greetings", "basic"),
        ("Будь ласка", "Please", "Bud las-ka", "greetings", "basic"),
        ("Вибачте", "Excuse me", "Vy-bach-te", "greetings", "basic"),
        
        # Emergency
        ("Допоможіть!", "Help!", "Do-po-mo-zheet", "emergency", "critical"),
        ("Викличте поліцію", "Call the police", "Vy-kly-chte po-lee-tsi-yu", "emergency", "critical"),
        ("Викличте швидку", "Call an ambulance", "Vy-kly-chte shvyd-ku", "emergency", "critical"),
        ("Мені потрібна допомога", "I need help", "Me-nee pot-ree-bna do-po-mo-ha", "emergency", "critical"),
        ("Де найближча лікарня?", "Where is the nearest hospital?", "De nay-blyzh-cha lee-kar-nya", "emergency", "critical"),
        
        # Healthcare
        ("Мені погано", "I feel sick", "Me-nee po-ha-no", "healthcare", "basic"),
        ("У мене болить голова", "I have a headache", "U me-ne bo-lyt ho-lo-va", "healthcare", "basic"),
        ("Мені потрібен лікар", "I need a doctor", "Me-nee pot-ree-ben lee-kar", "healthcare", "basic"),
        ("Де аптека?", "Where is the pharmacy?", "De ap-te-ka", "healthcare", "basic"),
        ("У мене алергія", "I have an allergy", "U me-ne a-ler-hee-ya", "healthcare", "intermediate"),
        
        # Government Services
        ("Мені потрібна допомога з документами", "I need help with documents", "Me-nee pot-ree-bna do-po-mo-ha z do-ku-men-ta-my", "government", "basic"),
        ("Де міграційна служба?", "Where is immigration services?", "De mee-hra-tsee-yna sluzh-ba", "government", "basic"),
        ("Мені потрібен перекладач", "I need a translator", "Me-nee pot-ree-ben pe-re-kla-dach", "government", "basic"),
        ("Як отримати соціальну допомогу?", "How to get social assistance?", "Yak o-try-ma-ty so-tsee-al-nu do-po-mo-hu", "government", "intermediate"),
        
        # Employment
        ("Я шукаю роботу", "I'm looking for work", "Ya shu-ka-yu ro-bo-tu", "employment", "basic"),
        ("Де центр зайнятості?", "Where is the employment center?", "De tsentr zay-nya-tos-tee", "employment", "basic"),
        ("Мені потрібна довідка про роботу", "I need a work certificate", "Me-nee pot-ree-bna do-veed-ka pro ro-bo-tu", "employment", "intermediate"),
        
        # Housing
        ("Я шукаю житло", "I'm looking for housing", "Ya shu-ka-yu zhyt-lo", "housing", "basic"),
        ("Скільки коштує оренда?", "How much is the rent?", "Skeel-ky kosh-tu-ye o-ren-da", "housing", "basic"),
        ("Мені потрібна допомога з житлом", "I need help with housing", "Me-nee pot-ree-bna do-po-mo-ha z zhyt-lom", "housing", "basic"),
        
        # Education
        ("Де школа для моєї дитини?", "Where is school for my child?", "De shko-la dlya mo-ye-yi dy-ty-ny", "education", "basic"),
        ("Мені потрібні курси англійської", "I need English courses", "Me-nee pot-ree-bnee kur-sy an-hlee-ys-ko-yi", "education", "basic"),
        ("Як записати дитину до школи?", "How to enroll child in school?", "Yak za-py-sa-ty dy-ty-nu do shko-ly", "education", "intermediate"),
        
        # Transportation
        ("Де автобусна зупинка?", "Where is the bus stop?", "De av-to-bus-na zu-pyn-ka", "transportation", "basic"),
        ("Скільки коштує проїзд?", "How much does it cost to ride?", "Skeel-ky kosh-tu-ye pro-yizd", "transportation", "basic"),
        ("Як дістатися до центру?", "How to get to downtown?", "Yak dees-ta-ty-sya do tsen-tru", "transportation", "basic"),
        
        # Shopping
        ("Скільки це коштує?", "How much does this cost?", "Skeel-ky tse kosh-tu-ye", "shopping", "basic"),
        ("Де супермаркет?", "Where is the supermarket?", "De su-per-mar-ket", "shopping", "basic"),
        ("Я хочу купити...", "I want to buy...", "Ya kho-chu ku-py-ty", "shopping", "basic"),
        
        # Basic Conversation
        ("Як справи?", "How are things?", "Yak spra-vy", "conversation", "basic"),
        ("Я не розумію", "I don't understand", "Ya ne ro-zu-mee-yu", "conversation", "basic"),
        ("Повторіть, будь ласка", "Please repeat", "Pov-to-reet bud las-ka", "conversation", "basic"),
        ("Говоріть повільніше", "Speak slower", "Ho-vo-reet po-veel-nee-she", "conversation", "basic"),
        ("Я вивчаю англійську", "I'm learning English", "Ya vy-vcha-yu an-hlee-ys-ku", "conversation", "basic"),
    ]
    
    for ukrainian, english, pronunciation, category, subcategory in translations_data:
        translation = Translation()
        translation.ukrainian = ukrainian
        translation.english = english
        translation.pronunciation = pronunciation
        translation.category = category
        translation.subcategory = subcategory
        translation.difficulty_level = subcategory
        db.session.add(translation)
    
    # Basic lessons
    lessons_data = [
        {
            "title": "Ukrainian Alphabet",
            "description": "Learn the Ukrainian alphabet and basic pronunciation",
            "content": """
            <h3>The Ukrainian Alphabet</h3>
            <p>The Ukrainian alphabet has 33 letters. Here are the basics:</p>
            <div class="alphabet-grid">
                <div class="letter-card"><strong>А а</strong> - sounds like 'a' in 'father'</div>
                <div class="letter-card"><strong>Б б</strong> - sounds like 'b' in 'boy'</div>
                <div class="letter-card"><strong>В в</strong> - sounds like 'v' in 'very'</div>
                <div class="letter-card"><strong>Г г</strong> - sounds like 'h' in 'house'</div>
                <div class="letter-card"><strong>Д д</strong> - sounds like 'd' in 'dog'</div>
                <div class="letter-card"><strong>Е е</strong> - sounds like 'e' in 'bet'</div>
                <div class="letter-card"><strong>Є є</strong> - sounds like 'ye' in 'yes'</div>
                <div class="letter-card"><strong>Ж ж</strong> - sounds like 's' in 'measure'</div>
                <div class="letter-card"><strong>З з</strong> - sounds like 'z' in 'zoo'</div>
                <div class="letter-card"><strong>И и</strong> - sounds like 'i' in 'bit'</div>
                <div class="letter-card"><strong>І і</strong> - sounds like 'ee' in 'see'</div>
                <div class="letter-card"><strong>Ї ї</strong> - sounds like 'yee'</div>
                <div class="letter-card"><strong>Й й</strong> - sounds like 'y' in 'boy'</div>
                <div class="letter-card"><strong>К к</strong> - sounds like 'k' in 'key'</div>
                <div class="letter-card"><strong>Л л</strong> - sounds like 'l' in 'love'</div>
                <div class="letter-card"><strong>М м</strong> - sounds like 'm' in 'mother'</div>
                <div class="letter-card"><strong>Н н</strong> - sounds like 'n' in 'no'</div>
                <div class="letter-card"><strong>О о</strong> - sounds like 'o' in 'not'</div>
                <div class="letter-card"><strong>П п</strong> - sounds like 'p' in 'pen'</div>
                <div class="letter-card"><strong>Р р</strong> - rolled 'r'</div>
                <div class="letter-card"><strong>С с</strong> - sounds like 's' in 'sun'</div>
                <div class="letter-card"><strong>Т т</strong> - sounds like 't' in 'top'</div>
                <div class="letter-card"><strong>У у</strong> - sounds like 'oo' in 'moon'</div>
                <div class="letter-card"><strong>Ф ф</strong> - sounds like 'f' in 'fun'</div>
                <div class="letter-card"><strong>Х х</strong> - sounds like 'ch' in Scottish 'loch'</div>
                <div class="letter-card"><strong>Ц ц</strong> - sounds like 'ts' in 'cats'</div>
                <div class="letter-card"><strong>Ч ч</strong> - sounds like 'ch' in 'chair'</div>
                <div class="letter-card"><strong>Ш ш</strong> - sounds like 'sh' in 'shop'</div>
                <div class="letter-card"><strong>Щ щ</strong> - sounds like 'shch'</div>
                <div class="letter-card"><strong>Ь ь</strong> - soft sign (no sound, softens preceding consonant)</div>
                <div class="letter-card"><strong>Ю ю</strong> - sounds like 'yu' in 'yule'</div>
                <div class="letter-card"><strong>Я я</strong> - sounds like 'ya' in 'yard'</div>
            </div>
            """,
            "level": "beginner",
            "order_index": 1
        },
        {
            "title": "Basic Greetings",
            "description": "Essential greetings and polite expressions",
            "content": """
            <h3>Essential Greetings</h3>
            <div class="phrase-list">
                <div class="phrase-item">
                    <strong>Привіт</strong> (Pry-veet) - Hello (informal)
                </div>
                <div class="phrase-item">
                    <strong>Добрий день</strong> (Do-bryy den) - Good day (formal)
                </div>
                <div class="phrase-item">
                    <strong>Добрий ранок</strong> (Do-bryy ra-nok) - Good morning
                </div>
                <div class="phrase-item">
                    <strong>Добрий вечір</strong> (Do-bryy ve-cheer) - Good evening
                </div>
                <div class="phrase-item">
                    <strong>До побачення</strong> (Do po-ba-chen-nya) - Goodbye
                </div>
                <div class="phrase-item">
                    <strong>Дякую</strong> (Dya-ku-yu) - Thank you
                </div>
                <div class="phrase-item">
                    <strong>Будь ласка</strong> (Bud las-ka) - Please
                </div>
                <div class="phrase-item">
                    <strong>Вибачте</strong> (Vy-bach-te) - Excuse me / Sorry
                </div>
            </div>
            """,
            "level": "beginner",
            "order_index": 2
        }
    ]
    
    for lesson_data in lessons_data:
        lesson = Lesson()
        for key, value in lesson_data.items():
            setattr(lesson, key, value)
        db.session.add(lesson)
    
    # Basic community info
    community_data = [
        {
            "title": "Ukrainian Cultural Centre of Winnipeg",
            "content": "The Ukrainian Cultural Centre serves as a hub for Ukrainian-Canadian community activities in Winnipeg.",
            "category": "cultural_centers",
            "contact_info": "Contact information to be added",
            "website": "",
            "address": "Winnipeg, MB",
            "phone": ""
        },
        {
            "title": "Ukrainian Orthodox Cathedral",
            "content": "Historic Ukrainian Orthodox cathedral serving the community since early settlement.",
            "category": "religious",
            "contact_info": "Contact information to be added",
            "website": "",
            "address": "Winnipeg, MB", 
            "phone": ""
        },
        {
            "title": "Ukrainian Canadian Congress - Manitoba",
            "content": "Provincial branch of the Ukrainian Canadian Congress representing Ukrainian-Canadians in Manitoba.",
            "category": "organizations",
            "contact_info": "Contact information to be added",
            "website": "",
            "address": "Winnipeg, MB",
            "phone": ""
        }
    ]
    
    for community_item in community_data:
        community = CommunityInfo()
        for key, value in community_item.items():
            setattr(community, key, value)
        db.session.add(community)
    
    # Comprehensive Manitoban-Ukrainian heritage content
    heritage_data = [
        # Historical Settlements and Communities
        {
            "title": "Ukrainian Settlement in Manitoba",
            "content": "The first wave of Ukrainian immigration to Manitoba began in the 1890s, with settlers establishing farming communities throughout the province. Major settlement areas included the Interlake region, Dauphin area, and communities near Winnipeg.",
            "category": "history",
            "historical_period": "1890s-1920s"
        },
        {
            "title": "Stuartburn Settlement",
            "content": "One of the earliest Ukrainian settlements in Manitoba, established in 1896 in southeastern Manitoba. Known for its preserved pioneer village and cultural heritage.",
            "category": "settlements",
            "historical_period": "1896-present"
        },
        {
            "title": "Dauphin Ukrainian Settlement",
            "content": "Major Ukrainian farming community established in western Manitoba, known for its annual National Ukrainian Festival and strong cultural preservation.",
            "category": "settlements", 
            "historical_period": "1896-present"
        },
        {
            "title": "Interlake Ukrainian Communities",
            "content": "Numerous Ukrainian settlements throughout the Interlake region including Komarno, Fraserwood, and Poplarfield, known for maintaining traditional farming and cultural practices.",
            "category": "settlements",
            "historical_period": "1890s-present"
        },
        {
            "title": "North End Winnipeg Ukrainian District",
            "content": "Historic urban Ukrainian community centered around Selkirk Avenue, featuring Ukrainian businesses, churches, and cultural institutions that served as the heart of Ukrainian life in Winnipeg.",
            "category": "urban_heritage",
            "historical_period": "1900s-1970s"
        },
        
        # Notable People
        {
            "title": "Rev. Nestor Dmytriw",
            "content": "First Ukrainian Orthodox priest in Canada, arrived in Manitoba in 1897. Instrumental in establishing Ukrainian Orthodox churches and preserving Ukrainian religious traditions.",
            "category": "people",
            "historical_period": "1897-1925"
        },
        {
            "title": "Michael Hrushevsky",
            "content": "Renowned Ukrainian historian who spent time in Manitoba during his North American period, contributing to Ukrainian scholarly and cultural life in the province.",
            "category": "people",
            "historical_period": "1914-1924"
        },
        {
            "title": "Wasyl Swystun",
            "content": "Pioneer farmer and community leader who established one of the first Ukrainian settlements in Manitoba, becoming a model for successful agricultural adaptation.",
            "category": "people",
            "historical_period": "1890s-1920s"
        },
        {
            "title": "Dr. Mary Beck",
            "content": "Ukrainian-Canadian physician who served rural Ukrainian communities in Manitoba, breaking barriers as one of the first female doctors of Ukrainian heritage in the province.",
            "category": "people",
            "historical_period": "1920s-1960s"
        },
        {
            "title": "Ramon Hnatyshyn",
            "content": "Governor General of Canada (1990-1995) of Ukrainian descent, born in Saskatoon but with strong Manitoba Ukrainian community connections.",
            "category": "people",
            "historical_period": "1934-2002"
        },
        {
            "title": "Paul Yuzyk",
            "content": "Ukrainian-Canadian historian and Senator, known as the 'Father of Multiculturalism' in Canada, with significant contributions to Manitoba's Ukrainian historical documentation.",
            "category": "people",
            "historical_period": "1913-1986"
        },
        
        # Architecture and Buildings
        {
            "title": "St. Nicholas Ukrainian Catholic Church",
            "content": "Historic church in Winnipeg's North End, featuring traditional Ukrainian architectural elements and serving as a community center for generations of Ukrainian families.",
            "category": "architecture",
            "historical_period": "1905-present"
        },
        {
            "title": "Holy Trinity Ukrainian Orthodox Cathedral",
            "content": "Magnificent cathedral in Winnipeg featuring Byzantine-style architecture with distinctive onion domes, serving as the mother church for Ukrainian Orthodox in Manitoba.",
            "category": "architecture",
            "historical_period": "1952-present"
        },
        {
            "title": "Ukrainian Labour Temple",
            "content": "Historic building on Pritchard Avenue that served as a cultural and political center for Ukrainian workers, featuring murals and traditional architectural details.",
            "category": "architecture",
            "historical_period": "1918-present"
        },
        {
            "title": "Immaculate Heart of Mary Ukrainian Catholic Church",
            "content": "Beautiful Ukrainian Catholic church in Winnipeg featuring traditional iconostasis and Ukrainian liturgical art, important center for Ukrainian Catholic community.",
            "category": "architecture", 
            "historical_period": "1960s-present"
        },
        {
            "title": "St. Andrew's Ukrainian Orthodox Church (Gimli)",
            "content": "Historic wooden church built by Ukrainian settlers, representing traditional Ukrainian church architecture adapted to Manitoba's climate and materials.",
            "category": "architecture",
            "historical_period": "1899-present"
        },
        {
            "title": "Ukrainian Cultural and Educational Centre",
            "content": "Modern complex in Winnipeg housing the Ukrainian Museum of Canada, libraries, and cultural facilities, representing contemporary Ukrainian-Canadian architectural achievement.",
            "category": "architecture",
            "historical_period": "1970s-present"
        },
        {
            "title": "Taras Shevchenko Monument",
            "content": "Memorial monument in Winnipeg's Kildonan Park honoring Ukraine's national poet, designed by Ukrainian-Canadian sculptor Leo Mol.",
            "category": "monuments",
            "historical_period": "1961-present"
        },
        {
            "title": "Ukrainian Pioneer Home (Dauphin)",
            "content": "Preserved pioneer home showcasing traditional Ukrainian settler architecture and lifestyle, now serving as a museum.",
            "category": "architecture",
            "historical_period": "1896-present"
        },
        
        # Cultural Institutions
        {
            "title": "Ukrainian Museum of Canada (Manitoba Branch)",
            "content": "Premier institution preserving and showcasing Ukrainian heritage in Manitoba, featuring artifacts, traditional clothing, and historical exhibits.",
            "category": "institutions",
            "historical_period": "1944-present"
        },
        {
            "title": "National Ukrainian Festival (Dauphin)",
            "content": "Canada's largest Ukrainian cultural festival, held annually in Dauphin since 1965, celebrating Ukrainian music, dance, food, and traditions.",
            "category": "festivals",
            "historical_period": "1965-present"
        },
        {
            "title": "Ukrainian Cultural Centre (Winnipeg)",
            "content": "Major cultural facility hosting Ukrainian language classes, cultural events, and serving as headquarters for numerous Ukrainian organizations.",
            "category": "institutions",
            "historical_period": "1950s-present"
        },
        {
            "title": "Vesna Ukrainian Dancers",
            "content": "Renowned Ukrainian dance troupe from Dauphin, representing Manitoba at national and international events, preserving traditional Ukrainian dance forms.",
            "category": "cultural_groups",
            "historical_period": "1960s-present"
        },
        {
            "title": "Ukrainian Male Chorus of Winnipeg",
            "content": "Historic men's choir preserving Ukrainian choral traditions and performing at cultural events throughout Manitoba and beyond.",
            "category": "cultural_groups",
            "historical_period": "1930s-present"
        },
        
        # Educational Institutions
        {
            "title": "Ukrainian Bilingual Education Program",
            "content": "Pioneering bilingual education program in Manitoba public schools, allowing students to learn in both English and Ukrainian from kindergarten through grade 12.",
            "category": "education",
            "historical_period": "1979-present"
        },
        {
            "title": "St. Andrew's College",
            "content": "Ukrainian Orthodox theological college affiliated with the University of Manitoba, training Ukrainian Orthodox clergy and preserving theological traditions.",
            "category": "education",
            "historical_period": "1946-present"
        },
        {
            "title": "Ukrainian Language and Culture School",
            "content": "Saturday schools throughout Manitoba teaching Ukrainian language, history, and culture to second and third-generation Ukrainian-Canadians.",
            "category": "education",
            "historical_period": "1920s-present"
        },
        
        # Historical Events
        {
            "title": "First Ukrainian Mass Immigration (1891-1914)",
            "content": "Period of major Ukrainian settlement in Manitoba, with over 170,000 Ukrainians arriving in Canada, many settling in Manitoba's agricultural areas.",
            "category": "events",
            "historical_period": "1891-1914"
        },
        {
            "title": "Ukrainian Internment in Manitoba (1914-1920)",
            "content": "Difficult period when Ukrainian-Canadians were classified as 'enemy aliens' during WWI, with internment camps established in Manitoba including at Kapuskasing.",
            "category": "events",
            "historical_period": "1914-1920"
        },
        {
            "title": "Ukrainian Orthodox Church Split (1918)",
            "content": "Significant religious and cultural event when Ukrainian Orthodox churches in Manitoba gained independence from Russian Orthodox authority.",
            "category": "events",
            "historical_period": "1918"
        },
        {
            "title": "Founding of Ukrainian Self-Reliance League (1927)",
            "content": "Establishment of major Ukrainian-Canadian organization in Winnipeg promoting Ukrainian culture, education, and community development.",
            "category": "events",
            "historical_period": "1927"
        },
        {
            "title": "Post-WWII Ukrainian Refugees (1945-1955)",
            "content": "Second major wave of Ukrainian immigration to Manitoba, including displaced persons and political refugees from Soviet-controlled Ukraine.",
            "category": "events",
            "historical_period": "1945-1955"
        },
        {
            "title": "Ukraine's Independence Recognition (1991)",
            "content": "Celebration throughout Manitoba's Ukrainian communities when Canada became the first Western nation to recognize Ukraine's independence.",
            "category": "events",
            "historical_period": "1991"
        },
        
        # Traditional Arts and Crafts
        {
            "title": "Ukrainian Pysanka Tradition",
            "content": "Ancient Ukrainian art of decorated Easter eggs, maintained and taught in Manitoba through cultural centers and family traditions.",
            "category": "arts",
            "historical_period": "ongoing"
        },
        {
            "title": "Ukrainian Embroidery (Vyshyvanka)",
            "content": "Traditional Ukrainian embroidery art preserved and practiced in Manitoba, with distinct regional patterns brought by different settler groups.",
            "category": "arts",
            "historical_period": "ongoing"
        },
        {
            "title": "Ukrainian Woodcarving Tradition",
            "content": "Traditional woodcarving skills brought by Ukrainian settlers, evident in church decorations and household items throughout Manitoba.",
            "category": "arts",
            "historical_period": "1890s-present"
        },
        {
            "title": "Ukrainian Folk Music in Manitoba",
            "content": "Rich tradition of Ukrainian folk music including church choral music, folk songs, and instrumental music preserved through community groups.",
            "category": "arts",
            "historical_period": "ongoing"
        },
        
        # Agricultural Heritage
        {
            "title": "Ukrainian Farming Techniques",
            "content": "Traditional Ukrainian farming methods adapted to Manitoba's prairie conditions, including crop rotation and animal husbandry practices.",
            "category": "agriculture",
            "historical_period": "1890s-present"
        },
        {
            "title": "Ukrainian Cuisine in Manitoba",
            "content": "Traditional Ukrainian foods adapted to Canadian ingredients, including perogies, cabbage rolls, and Ukrainian breads, now part of Manitoba's culinary heritage.",
            "category": "cuisine",
            "historical_period": "1890s-present"
        },
        
        # Modern Ukrainian Community
        {
            "title": "Ukrainian Canadian Congress (Manitoba)",
            "content": "Provincial branch of national organization coordinating Ukrainian-Canadian activities and advocating for community interests.",
            "category": "organizations",
            "historical_period": "1940s-present"
        },
        {
            "title": "Ukrainian Professional and Business Federation",
            "content": "Organization supporting Ukrainian-Canadian professionals and businesses in Manitoba, promoting economic development and networking.",
            "category": "organizations", 
            "historical_period": "1970s-present"
        },
        {
            "title": "Contemporary Ukrainian Immigration",
            "content": "Recent waves of Ukrainian immigration to Manitoba, including political refugees and economic immigrants maintaining connections with homeland.",
            "category": "contemporary",
            "historical_period": "1991-present"
        },
        
        # Religious Heritage
        {
            "title": "Ukrainian Orthodox Church of Canada",
            "content": "Major Ukrainian Orthodox denomination in Manitoba, established in 1918 as an autonomous church serving Ukrainian Orthodox communities.",
            "category": "religious",
            "historical_period": "1918-present"
        },
        {
            "title": "Ukrainian Catholic Archeparchy of Winnipeg",
            "content": "Ecclesiastical territory of the Ukrainian Catholic Church covering Manitoba and Saskatchewan, established in 1956.",
            "category": "religious",
            "historical_period": "1956-present"
        },
        
        # Sports and Recreation
        {
            "title": "Ukrainian National Association Sports",
            "content": "Traditional Ukrainian sports and athletic clubs that promoted physical fitness and cultural identity among Ukrainian-Canadians in Manitoba.",
            "category": "sports",
            "historical_period": "1920s-present"
        },
        {
            "title": "Ukrainian Youth Organizations",
            "content": "Various youth groups including Plast Ukrainian Scouting Organization and Ukrainian Youth Association promoting Ukrainian culture among young people.",
            "category": "youth",
            "historical_period": "1920s-present"
        }
    ]
    
    for heritage_item in heritage_data:
        heritage = HeritageInfo()
        heritage.title = heritage_item['title']
        heritage.content = heritage_item['content'] 
        heritage.category = heritage_item['category']
        heritage.historical_period = heritage_item['historical_period']
        db.session.add(heritage)
    
    # Basic resources
    resources_data = [
        {
            "title": "Manitoba Immigration Services",
            "description": "Government services for new immigrants including settlement support and language training.",
            "category": "government",
            "contact_info": "Contact information to be added",
            "website": "",
            "address": "Winnipeg, MB",
            "phone": "",
            "hours": "Monday-Friday 8:30 AM - 4:30 PM"
        },
        {
            "title": "Winnipeg Public Library",
            "description": "Free library services including English language learning resources and computer access.",
            "category": "education",
            "contact_info": "Multiple locations throughout Winnipeg",
            "website": "",
            "address": "Various locations",
            "phone": "",
            "hours": "Varies by location"
        },
        {
            "title": "Health Sciences Centre",
            "description": "Major hospital providing comprehensive healthcare services with interpretation services available.",
            "category": "healthcare",
            "contact_info": "Emergency services available 24/7",
            "website": "",
            "address": "Winnipeg, MB",
            "phone": "",
            "hours": "24/7 Emergency, varies for other services"
        }
    ]
    
    for resource_item in resources_data:
        resource = Resource()
        for key, value in resource_item.items():
            setattr(resource, key, value)
        db.session.add(resource)
    
    # Comprehensive Ukrainian-Manitoba events
    events_data = [
        # Annual Festivals and Cultural Events
        {
            "title": "National Ukrainian Festival (Dauphin)",
            "description": "Canada's largest Ukrainian cultural festival featuring traditional music, dance, food, crafts, and cultural exhibits. Held annually in Dauphin since 1965.",
            "date": datetime(2025, 8, 1, 10, 0),  # First Friday in August
            "location": "Dauphin, Manitoba",
            "organizer": "Dauphin Ukrainian Festival Association",
            "contact_info": "Ukrainian Festival Grounds, Dauphin",
            "category": "cultural"
        },
        {
            "title": "Ukrainian Easter Celebration",
            "description": "Traditional Ukrainian Easter celebrations with pysanka workshops, traditional foods, and religious ceremonies at Ukrainian churches throughout Manitoba.",
            "date": datetime(2025, 4, 20, 10, 0),  # Easter Sunday
            "location": "Various Ukrainian Churches, Manitoba",
            "organizer": "Ukrainian Orthodox and Catholic Churches",
            "contact_info": "Local Ukrainian Churches",
            "category": "religious"
        },
        {
            "title": "Vesna Festival",
            "description": "Spring festival celebrating Ukrainian culture with traditional performances by the famous Vesna Ukrainian Dancers and community groups.",
            "date": datetime(2025, 5, 15, 19, 0),
            "location": "Ukrainian Cultural Centre, Winnipeg",
            "organizer": "Ukrainian Cultural Centre",
            "contact_info": "184 Alexander Avenue East, Winnipeg",
            "category": "cultural"
        },
        {
            "title": "Ukrainian Independence Day Celebration",
            "description": "Commemoration of Ukraine's independence with cultural performances, traditional foods, and community gathering.",
            "date": datetime(2025, 8, 24, 14, 0),
            "location": "Kildonan Park, Winnipeg",
            "organizer": "Ukrainian Canadian Congress - Manitoba",
            "contact_info": "Ukrainian Canadian Congress Manitoba",
            "category": "patriotic"
        },
        {
            "title": "Shevchenko Poetry Evening",
            "description": "Annual celebration of Ukraine's national poet Taras Shevchenko with poetry readings, musical performances, and cultural presentations.",
            "date": datetime(2025, 3, 9, 19, 0),
            "location": "Ukrainian Labour Temple, Winnipeg",
            "organizer": "Taras Shevchenko Foundation",
            "contact_info": "Ukrainian Cultural Organizations",
            "category": "cultural"
        },
        
        # Educational and Community Events
        {
            "title": "Ukrainian Language School Registration",
            "description": "Annual registration for Ukrainian Saturday schools throughout Manitoba, offering language and cultural education for children and adults.",
            "date": datetime(2025, 9, 1, 18, 0),
            "location": "Ukrainian Cultural Centre, Winnipeg",
            "organizer": "Ukrainian Language Schools Association",
            "contact_info": "Ukrainian Cultural Centre",
            "category": "education"
        },
        {
            "title": "Ukrainian Museum Heritage Day",
            "description": "Special exhibition and educational programs showcasing Ukrainian heritage in Manitoba with guided tours and artifact displays.",
            "date": datetime(2025, 5, 18, 10, 0),
            "location": "Ukrainian Museum of Canada, Winnipeg",
            "organizer": "Ukrainian Museum of Canada",
            "contact_info": "Ukrainian Cultural Centre",
            "category": "education"
        },
        {
            "title": "Pysanka Workshop Series",
            "description": "Traditional Ukrainian Easter egg decorating workshops for all skill levels, teaching ancient techniques and patterns.",
            "date": datetime(2025, 3, 15, 13, 0),
            "location": "Ukrainian Cultural Centre, Winnipeg",
            "organizer": "Ukrainian Women's Association",
            "contact_info": "Ukrainian Cultural Centre",
            "category": "arts"
        },
        
        # Religious and Commemorative Events
        {
            "title": "Holodomor Memorial Service",
            "description": "Annual memorial service commemorating the victims of the 1932-33 Ukrainian famine-genocide with candlelight vigil and remembrance ceremony.",
            "date": datetime(2025, 11, 22, 18, 0),
            "location": "Holy Trinity Ukrainian Orthodox Cathedral, Winnipeg",
            "organizer": "Ukrainian Orthodox and Catholic Churches",
            "contact_info": "Ukrainian Churches in Manitoba",
            "category": "memorial"
        },
        {
            "title": "Ukrainian Christmas Carol Service",
            "description": "Traditional Ukrainian Christmas celebration with carols (kolyadky), traditional foods, and community fellowship according to the Julian calendar.",
            "date": datetime(2025, 1, 7, 18, 0),
            "location": "Various Ukrainian Churches, Manitoba",
            "organizer": "Ukrainian Orthodox Churches",
            "contact_info": "Local Ukrainian Orthodox Parishes",
            "category": "religious"
        },
        {
            "title": "St. Nicholas Day Celebration",
            "description": "Traditional Ukrainian celebration for children with St. Nicholas visits, gifts, and cultural activities.",
            "date": datetime(2025, 12, 6, 15, 0),
            "location": "Ukrainian Cultural Centre, Winnipeg",
            "organizer": "Ukrainian Youth Organizations",
            "contact_info": "Ukrainian Cultural Centre",
            "category": "family"
        },
        
        # Historical and Heritage Events
        {
            "title": "Ukrainian Settlement Days (Stuartburn)",
            "description": "Annual celebration of early Ukrainian settlement in Manitoba with pioneer demonstrations, traditional crafts, and historical reenactments.",
            "date": datetime(2025, 7, 12, 10, 0),
            "location": "Stuartburn, Manitoba",
            "organizer": "Stuartburn Historical Society",
            "contact_info": "Stuartburn Community Centre",
            "category": "historical"
        },
        {
            "title": "Ukrainian Pioneer Heritage Weekend",
            "description": "Two-day event showcasing traditional Ukrainian farming techniques, pioneer lifestyle, and heritage preservation activities.",
            "date": datetime(2025, 8, 15, 9, 0),
            "location": "Ukrainian Pioneer Village, Various Locations",
            "organizer": "Manitoba Ukrainian Heritage Organizations",
            "contact_info": "Heritage Organizations",
            "category": "historical"
        },
        
        # Arts and Performance Events
        {
            "title": "Ukrainian Male Chorus Concert",
            "description": "Traditional Ukrainian choral music performance featuring classical and folk songs by the historic Ukrainian Male Chorus of Winnipeg.",
            "date": datetime(2025, 10, 15, 19, 30),
            "location": "Centennial Concert Hall, Winnipeg",
            "organizer": "Ukrainian Male Chorus of Winnipeg",
            "contact_info": "Ukrainian Cultural Centre",
            "category": "music"
        },
        {
            "title": "Ukrainian Dance Festival",
            "description": "Showcase of traditional Ukrainian dance featuring local dance groups and the renowned Vesna Ukrainian Dancers.",
            "date": datetime(2025, 6, 20, 19, 0),
            "location": "Gas Station Arts Centre, Winnipeg",
            "organizer": "Ukrainian Dance Federation",
            "contact_info": "Ukrainian Cultural Organizations",
            "category": "dance"
        },
        {
            "title": "Ukrainian Embroidery Exhibition",
            "description": "Exhibition of traditional Ukrainian embroidery (vyshyvanka) with demonstrations of traditional techniques and patterns.",
            "date": datetime(2025, 4, 10, 13, 0),
            "location": "Ukrainian Museum of Canada, Winnipeg",
            "organizer": "Ukrainian Women's Association",
            "contact_info": "Ukrainian Museum",
            "category": "arts"
        },
        
        # Community and Social Events
        {
            "title": "Ukrainian Canadian Congress Annual Meeting",
            "description": "Annual meeting of the Ukrainian Canadian Congress Manitoba branch with community updates and cultural programming.",
            "date": datetime(2025, 11, 10, 14, 0),
            "location": "Ukrainian Cultural Centre, Winnipeg",
            "organizer": "Ukrainian Canadian Congress - Manitoba",
            "contact_info": "Ukrainian Canadian Congress",
            "category": "community"
        },
        {
            "title": "Ukrainian Youth Summer Camp",
            "description": "Week-long summer camp for Ukrainian-Canadian youth featuring language learning, cultural activities, and traditional crafts.",
            "date": datetime(2025, 7, 20, 9, 0),
            "location": "Camp Trembowla, Manitoba",
            "organizer": "Ukrainian Youth Association",
            "contact_info": "Ukrainian Youth Organizations",
            "category": "youth"
        },
        {
            "title": "Ukrainian Seniors Social Evening",
            "description": "Monthly social gathering for Ukrainian seniors with traditional music, cards, refreshments, and community updates.",
            "date": datetime(2025, 2, 15, 14, 0),
            "location": "Ukrainian Cultural Centre, Winnipeg",
            "organizer": "Ukrainian Seniors Association",
            "contact_info": "Ukrainian Cultural Centre",
            "category": "seniors"
        },
        
        # Contemporary Events
        {
            "title": "Support Ukraine Fundraising Gala",
            "description": "Community fundraising event supporting humanitarian aid for Ukraine with cultural performances and silent auction.",
            "date": datetime(2025, 3, 22, 18, 0),
            "location": "Fairmont Winnipeg Hotel",
            "organizer": "Ukrainian Canadian Congress - Manitoba",
            "contact_info": "Ukrainian Canadian Congress",
            "category": "fundraising"
        },
        {
            "title": "Ukrainian-Canadian Professional Network Meeting",
            "description": "Networking event for Ukrainian-Canadian professionals and business owners with guest speakers and business development opportunities.",
            "date": datetime(2025, 10, 5, 17, 30),
            "location": "Delta Winnipeg Hotel",
            "organizer": "Ukrainian Professional and Business Federation",
            "contact_info": "Ukrainian Professional Association",
            "category": "professional"
        },
        
        # Food and Cultural Events
        {
            "title": "Ukrainian Food Festival",
            "description": "Celebration of Ukrainian cuisine featuring traditional foods like perogies, cabbage rolls, and Ukrainian breads with cooking demonstrations.",
            "date": datetime(2025, 9, 15, 11, 0),
            "location": "Ukrainian Cultural Centre, Winnipeg",
            "organizer": "Ukrainian Women's Association",
            "contact_info": "Ukrainian Cultural Centre",
            "category": "food"
        },
        {
            "title": "Ukrainian Harvest Festival",
            "description": "Traditional harvest celebration with Ukrainian folk activities, traditional foods, and agricultural heritage demonstrations.",
            "date": datetime(2025, 9, 30, 13, 0),
            "location": "Rural Ukrainian Communities, Manitoba",
            "organizer": "Ukrainian Rural Communities",
            "contact_info": "Local Ukrainian Organizations",
            "category": "agricultural"
        }
    ]
    
    for event_item in events_data:
        event = Event()
        for key, value in event_item.items():
            setattr(event, key, value)
        db.session.add(event)
    
    db.session.commit()
