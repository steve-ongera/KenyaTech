# KenyaTech — Full Stack Web Application

> **Built in Nairobi. Deployed Globally.**  
> Django REST Framework backend + React (Vite) frontend.

---

## Project Structure

```
kenyatech/
├── backend/                  # Django project
│   ├── core/                 # Main app (models, views, serializers, urls, admin)
│   │   ├── models.py         # 16 models with SEO slugs
│   │   ├── serializers.py    # DRF serializers
│   │   ├── views.py          # ViewSets + custom endpoints
│   │   ├── urls.py           # App URL router
│   │   └── admin.py          # Full admin configuration
│   ├── kenyatech/
│   │   ├── settings.py       # PostgreSQL, CORS, DRF, cache
│   │   ├── urls.py           # Main URL config
│   │   └── wsgi.py
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/                 # React + Vite project
    ├── src/
    │   ├── services/
    │   │   └── api.js         # Full fetch API layer
    │   ├── components/
    │   │   ├── Navbar.jsx     # Scroll-aware, mobile-responsive
    │   │   ├── Footer.jsx     # With newsletter subscription
    │   │   └── UI.jsx         # Reusable primitives (Spinner, Card, etc.)
    │   ├── pages/
    │   │   ├── HomePage.jsx   # Full hero, services, projects, team, blog, testimonials
    │   │   ├── AboutPage.jsx  # Team, values, timeline, mission
    │   │   ├── ServicesPage.jsx
    │   │   ├── ServiceDetailPage.jsx
    │   │   ├── ProjectsPage.jsx
    │   │   ├── ProjectDetailPage.jsx
    │   │   ├── BlogPage.jsx   # Search, tag filtering, pagination
    │   │   ├── BlogDetailPage.jsx
    │   │   ├── CareersPage.jsx # Perks, job listings, department filter
    │   │   ├── JobDetailPage.jsx # With full application form
    │   │   ├── ContactPage.jsx  # Form + FAQ accordion
    │   │   └── NotFoundPage.jsx
    │   ├── styles/
    │   │   └── main.css       # Full design system (Syne + DM Sans)
    │   ├── App.jsx            # Router
    │   └── main.jsx           # Entry point
    ├── index.html             # SEO meta tags, OG tags
    ├── package.json
    └── vite.config.js         # Dev proxy to Django

```

---

## Backend Setup

### 1. Create virtual environment
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure environment variables
Create a `.env` file in `backend/`:
```env
SECRET_KEY=your-very-secret-key-here
DEBUG=True
DB_NAME=kenyatech
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Create PostgreSQL database
```bash
psql -U postgres
CREATE DATABASE kenyatech;
\q
```

### 5. Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create superuser
```bash
python manage.py createsuperuser
```

### 7. Populate sample data (optional)
```bash
python manage.py shell
```
```python
from core.models import *

# Site settings
s = SiteSettings.get()
s.company_name = 'KenyaTech'
s.tagline = 'Building Africa\'s Digital Future'
s.email = 'hello@kenyatech.co.ke'
s.phone = '+254 700 000 000'
s.address = 'ABC Place, Waiyaki Way, Westlands, Nairobi'
s.save()

# Stats
SiteStat.objects.bulk_create([
    SiteStat(label='Projects Delivered', value='150',  suffix='+', order=1),
    SiteStat(label='Happy Clients',      value='80',   suffix='+', order=2),
    SiteStat(label='Years Experience',   value='6',    suffix='+', order=3),
    SiteStat(label='Team Members',       value='25',   suffix='+', order=4),
])

# Service categories
cat_web  = ServiceCategory.objects.create(name='Web Development',   order=1)
cat_mob  = ServiceCategory.objects.create(name='Mobile Apps',       order=2)
cat_cld  = ServiceCategory.objects.create(name='Cloud & DevOps',    order=3)
cat_des  = ServiceCategory.objects.create(name='UI/UX Design',      order=4)
cat_dat  = ServiceCategory.objects.create(name='Data & AI',         order=5)

# Services
Service.objects.create(category=cat_web, title='Web Application Development', icon='bi bi-code-slash', short_desc='Fast, scalable web applications built with React, Django, Node.js and more.', is_featured=True, order=1)
Service.objects.create(category=cat_mob, title='Mobile App Development',     icon='bi bi-phone',      short_desc='Native and cross-platform iOS & Android apps with Flutter and React Native.', is_featured=True, order=2)
Service.objects.create(category=cat_cld, title='Cloud Infrastructure',       icon='bi bi-cloud',      short_desc='AWS, GCP, and Azure architecture, CI/CD pipelines, and Kubernetes deployments.', is_featured=True, order=3)
Service.objects.create(category=cat_des, title='UI/UX Design',               icon='bi bi-palette',    short_desc='User research, wireframing, and pixel-perfect Figma designs.', is_featured=True, order=4)
Service.objects.create(category=cat_dat, title='Data Engineering & AI',      icon='bi bi-graph-up',   short_desc='Data pipelines, dashboards, and machine learning models for African businesses.', is_featured=True, order=5)
Service.objects.create(category=cat_web, title='E-Commerce Solutions',       icon='bi bi-bag',        short_desc='Custom Shopify, WooCommerce, and headless commerce builds.', is_featured=True, order=6)

print('Seed data created!')
```

### 8. Start the dev server
```bash
python manage.py runserver
```

Admin panel: **http://localhost:8000/admin/**  
API root:    **http://localhost:8000/api/v1/**

---

## Frontend Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Configure environment (optional)
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000/api/v1
```
> The Vite dev proxy in `vite.config.js` already forwards `/api` to port 8000 automatically.

### 3. Start dev server
```bash
npm run dev
```

Frontend: **http://localhost:5173**

---

## API Endpoints Reference

| Method | Endpoint                        | Description                  |
|--------|---------------------------------|------------------------------|
| GET    | `/api/v1/homepage/`             | All homepage data (single request) |
| GET    | `/api/v1/settings/`             | Site settings                |
| GET    | `/api/v1/stats/`                | Site statistics              |
| GET    | `/api/v1/services/`             | List all services            |
| GET    | `/api/v1/services/{slug}/`      | Service detail               |
| GET    | `/api/v1/services/featured/`    | Featured services            |
| GET    | `/api/v1/service-categories/`   | Service categories           |
| GET    | `/api/v1/projects/`             | List all projects            |
| GET    | `/api/v1/projects/{slug}/`      | Project detail               |
| GET    | `/api/v1/team/`                 | Team members                 |
| GET    | `/api/v1/team/{slug}/`          | Team member detail           |
| GET    | `/api/v1/blog/`                 | Blog posts (published)       |
| GET    | `/api/v1/blog/{slug}/`          | Blog post detail + view count|
| GET    | `/api/v1/jobs/`                 | Active job listings          |
| GET    | `/api/v1/jobs/{slug}/`          | Job detail                   |
| POST   | `/api/v1/jobs/{slug}/apply/`    | Submit job application       |
| GET    | `/api/v1/testimonials/`         | Testimonials                 |
| GET    | `/api/v1/faqs/`                 | FAQs                         |
| GET    | `/api/v1/faq-categories/`       | FAQ categories with nested FAQs |
| POST   | `/api/v1/contact/`              | Send contact message         |
| POST   | `/api/v1/newsletter/`           | Newsletter subscribe         |
| GET    | `/api/v1/client-logos/`         | Client/partner logos         |
| GET    | `/api/v1/departments/`          | Job departments              |

### Query Parameters (filtering, search, pagination)
```
/api/v1/services/?category__slug=web-development&is_featured=true
/api/v1/blog/?search=react&tags__slug=frontend&ordering=-published_at
/api/v1/jobs/?job_type=remote&level=senior&department__slug=engineering
/api/v1/projects/?status=completed&is_featured=true
```

---

## Production Deployment

### Backend (gunicorn + nginx)
```bash
pip install gunicorn
gunicorn kenyatech.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### Frontend (build static files)
```bash
npm run build
# Serve dist/ via nginx or copy to Django's static root
```

### Environment variables for production
```env
DEBUG=False
SECRET_KEY=<strong-random-key>
ALLOWED_HOSTS=kenyatech.co.ke,www.kenyatech.co.ke
CORS_ALLOWED_ORIGINS=https://kenyatech.co.ke
DB_PASSWORD=<strong-db-password>
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=hello@kenyatech.co.ke
EMAIL_HOST_PASSWORD=<app-password>
```

---

## Design System

- **Display font:** Syne (headings, logo, numbers)
- **Body font:** DM Sans
- **Primary colour:** `#22a045` (forest green)
- **Accent colour:** `#e8a020` (warm gold)
- **Dark bg:** `#0f1117` (near-black slate)
- **Border radius:** 6px–24px scale
- **Shadows:** 4-level elevation system

All design tokens are CSS custom properties in `src/styles/main.css` under `:root`.