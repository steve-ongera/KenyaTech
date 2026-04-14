# core/management/commands/seed_data.py
"""
KenyaTech — Seed command
Usage:
    python manage.py seed_data           # seed everything
    python manage.py seed_data --flush   # wipe then re-seed
    python manage.py seed_data --only services team blog
"""
import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.utils.text import slugify


class Command(BaseCommand):
    help = 'Seed the database with realistic KenyaTech sample data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--flush',
            action='store_true',
            help='Delete all existing data before seeding',
        )
        parser.add_argument(
            '--only',
            nargs='+',
            choices=[
                'settings', 'stats', 'hero', 'clients',
                'services', 'team', 'projects',
                'blog', 'jobs', 'testimonials', 'faqs',
            ],
            help='Seed only specific sections',
        )

    def handle(self, *args, **options):
        flush = options['flush']
        only  = options['only']

        # late import — avoids AppRegistryNotReady
        from core.models import (
            SiteSettings, SiteStat, HeroBanner, ClientLogo,
            ServiceCategory, Service, TeamMember, Project,
            BlogTag, BlogPost, Department, JobListing,
            Testimonial, FAQCategory, FAQ,
            ContactMessage, NewsletterSubscriber,
        )

        def should_run(section):
            return only is None or section in only

        if flush:
            self.stdout.write(self.style.WARNING('Flushing existing data…'))
            models_to_flush = [
                FAQ, FAQCategory, Testimonial,
                JobListing, Department,
                BlogPost, BlogTag,
                Project, Service, ServiceCategory,
                TeamMember, ClientLogo, HeroBanner,
                SiteStat, ContactMessage, NewsletterSubscriber,
            ]
            for m in models_to_flush:
                count, _ = m.objects.all().delete()
                if count:
                    self.stdout.write(f'  Deleted {count} {m.__name__} record(s)')

        # ─── SITE SETTINGS ─────────────────────────────────────
        if should_run('settings'):
            self.stdout.write('Seeding site settings…')
            s = SiteSettings.get()
            s.company_name        = 'KenyaTech'
            s.tagline             = "Building Africa's Digital Future"
            s.email               = 'hello@kenyatech.co.ke'
            s.phone               = '+254 700 123 456'
            s.address             = 'ABC Place, 3rd Floor\nWaiyaki Way, Westlands\nNairobi, Kenya'
            s.twitter_url         = 'https://twitter.com/kenyatech'
            s.linkedin_url        = 'https://linkedin.com/company/kenyatech'
            s.github_url          = 'https://github.com/kenyatech'
            s.meta_description    = (
                'KenyaTech is East Africa\'s leading product studio — '
                'web, mobile, cloud and AI solutions built in Nairobi.'
            )
            s.meta_keywords       = (
                'software development Kenya, web development Nairobi, '
                'mobile app Kenya, fintech Kenya, tech company Africa'
            )
            s.save()
            self.stdout.write(self.style.SUCCESS('  ✓ Site settings'))

        # ─── STATS ─────────────────────────────────────────────
        if should_run('stats'):
            self.stdout.write('Seeding stats…')
            stats = [
                ('Projects Delivered', '150', '+', '🚀', 1),
                ('Happy Clients',      '80',  '+', '🤝', 2),
                ('Years of Experience','6',   '+', '📅', 3),
                ('Team Members',       '30',  '+', '👥', 4),
            ]
            for label, value, suffix, icon, order in stats:
                from core.models import SiteStat
                SiteStat.objects.update_or_create(
                    label=label,
                    defaults=dict(value=value, suffix=suffix, icon=icon, order=order),
                )
            self.stdout.write(self.style.SUCCESS(f'  ✓ {len(stats)} stats'))

        # ─── HERO BANNERS ──────────────────────────────────────
        if should_run('hero'):
            self.stdout.write('Seeding hero banners…')
            from core.models import HeroBanner
            banners = [
                {
                    'eyebrow':    '🇰🇪 Built in Nairobi, Deployed Globally',
                    'title':      'We Build Digital Products Africa is Proud Of',
                    'subtitle':   (
                        'From Nairobi to the world — fast, beautiful, and scalable '
                        'web and mobile solutions for startups, enterprises, and government.'
                    ),
                    'cta_label':  'Start a Project',
                    'cta_url':    '/contact',
                    'cta2_label': 'See Our Work',
                    'cta2_url':   '/projects',
                    'is_active':  True,
                    'order':      1,
                },
            ]
            for b in banners:
                HeroBanner.objects.get_or_create(title=b['title'], defaults=b)
            self.stdout.write(self.style.SUCCESS(f'  ✓ {len(banners)} hero banner(s)'))

        # ─── SERVICE CATEGORIES & SERVICES ─────────────────────
        if should_run('services'):
            self.stdout.write('Seeding service categories and services…')
            from core.models import ServiceCategory, Service

            categories_data = [
                ('Web Development',   'Full-stack web applications and APIs.',  1),
                ('Mobile Apps',       'Native and cross-platform mobile apps.',  2),
                ('Cloud & DevOps',    'Infrastructure, CI/CD, and SRE.',         3),
                ('UI/UX Design',      'Research-driven, pixel-perfect design.',  4),
                ('Data & AI',         'Analytics, pipelines, and ML models.',    5),
                ('E-Commerce',        'Custom online stores and marketplaces.',   6),
            ]
            cats = {}
            for name, desc, order in categories_data:
                cat, _ = ServiceCategory.objects.get_or_create(
                    name=name,
                    defaults=dict(description=desc, order=order),
                )
                cats[name] = cat

            services_data = [
                # (category, title, icon, short_desc, description, is_featured, order)
                (
                    'Web Development',
                    'Web Application Development',
                    'bi bi-code-slash',
                    'Fast, scalable web apps built with React, Next.js, Django, and Node.js.',
                    (
                        '<p>We architect and build production-grade web applications that scale '
                        'from 100 to 10 million users. Our stack includes React/Next.js for the '
                        'frontend, Django/Node.js for the backend, PostgreSQL for data, and AWS '
                        'or GCP for infrastructure.</p>'
                        '<p>Every project includes a comprehensive test suite, CI/CD pipeline, '
                        'monitoring dashboards, and full documentation — delivered on a fixed '
                        'timeline with weekly progress demos.</p>'
                        '<h3>What you get</h3>'
                        '<ul><li>Full source code ownership</li>'
                        '<li>Responsive across all devices</li>'
                        '<li>SEO-optimised and accessible (WCAG 2.1)</li>'
                        '<li>99.9% uptime SLA post-launch</li></ul>'
                    ),
                    True, 1,
                ),
                (
                    'Mobile Apps',
                    'Mobile App Development',
                    'bi bi-phone',
                    'iOS and Android apps with Flutter and React Native — one codebase, native feel.',
                    (
                        '<p>We build cross-platform mobile applications using Flutter and React '
                        'Native that look and feel completely native on both iOS and Android. '
                        'For performance-critical applications we also work in Swift and Kotlin.</p>'
                        '<p>We handle everything from UX design through App Store and Play Store '
                        'submission, including push notifications, offline support, biometric auth, '
                        'and M-PESA / Stripe payment integration.</p>'
                    ),
                    True, 2,
                ),
                (
                    'Cloud & DevOps',
                    'Cloud Infrastructure & DevOps',
                    'bi bi-cloud',
                    'AWS, GCP, and Azure architecture, CI/CD pipelines, and Kubernetes deployments.',
                    (
                        '<p>We design, build, and manage cloud infrastructure that is secure, '
                        'cost-efficient, and able to handle African traffic patterns — including '
                        'low-bandwidth users and intermittent connectivity.</p>'
                        '<p>Services include infrastructure-as-code with Terraform, containerisation '
                        'with Docker and Kubernetes, automated CI/CD with GitHub Actions, and '
                        '24/7 monitoring and alerting.</p>'
                    ),
                    True, 3,
                ),
                (
                    'UI/UX Design',
                    'UI/UX Design & Prototyping',
                    'bi bi-palette',
                    'User research, wireframing, and pixel-perfect Figma designs for web and mobile.',
                    (
                        '<p>Great products start with great design. Our design team conducts '
                        'user research, builds information architecture, creates wireframes, '
                        'and delivers high-fidelity Figma prototypes — all before a single line '
                        'of code is written.</p>'
                        '<p>We design for African users: optimised for small screens, low-bandwidth '
                        'environments, and diverse literacy levels. We also run usability testing '
                        'with real users in Nairobi, Kampala, and Dar es Salaam.</p>'
                    ),
                    True, 4,
                ),
                (
                    'Data & AI',
                    'Data Engineering & AI',
                    'bi bi-graph-up',
                    'Data pipelines, BI dashboards, and machine learning models tailored for Africa.',
                    (
                        '<p>We help organisations make sense of their data. From ETL pipelines '
                        'and data warehouses to interactive Power BI / Metabase dashboards and '
                        'custom machine learning models, we cover the full data lifecycle.</p>'
                        '<p>We have particular expertise in M-PESA transaction data, satellite '
                        'imagery analysis, agricultural yield prediction, and health outcome '
                        'modelling — domains where African-specific training data matters.</p>'
                    ),
                    True, 5,
                ),
                (
                    'E-Commerce',
                    'E-Commerce Solutions',
                    'bi bi-bag',
                    'Custom online stores, marketplaces, and M-PESA-native checkout experiences.',
                    (
                        '<p>We build e-commerce experiences that convert Kenyan and East African '
                        'shoppers — with M-PESA as a first-class payment method, not an afterthought. '
                        'We work with Shopify, WooCommerce, and fully custom headless builds.</p>'
                    ),
                    True, 6,
                ),
                (
                    'Web Development',
                    'API Development & Integration',
                    'bi bi-plug',
                    'RESTful and GraphQL APIs, M-PESA Daraja integration, and third-party connectors.',
                    (
                        '<p>We design and build rock-solid APIs used by web apps, mobile clients, '
                        'and third-party partners. We are Kenya\'s most experienced team for '
                        'Safaricom Daraja (M-PESA STK Push, B2C, C2B) and Airtel Money '
                        'API integrations.</p>'
                    ),
                    False, 7,
                ),
            ]
            count = 0
            for cat_name, title, icon, short_desc, desc, featured, order in services_data:
                Service.objects.get_or_create(
                    title=title,
                    defaults=dict(
                        category=cats[cat_name],
                        icon=icon,
                        short_desc=short_desc,
                        description=desc,
                        is_featured=featured,
                        order=order,
                    ),
                )
                count += 1
            self.stdout.write(self.style.SUCCESS(f'  ✓ {len(categories_data)} categories, {count} services'))

        # ─── TEAM MEMBERS ──────────────────────────────────────
        if should_run('team'):
            self.stdout.write('Seeding team members…')
            from core.models import TeamMember

            team_data = [
                # (name, role, dept, bio, is_featured, order, linkedin, github)
                (
                    'Amara Osei', 'Chief Executive Officer', 'leadership',
                    'Amara co-founded KenyaTech in 2018 after a decade building fintech '
                    'products at Equity Bank and mPesa. She holds a BSc in Computer Science '
                    'from University of Nairobi and an MBA from Strathmore.',
                    True, 1,
                    'https://linkedin.com/in/amara-osei', '',
                ),
                (
                    'David Kimani', 'Chief Technology Officer', 'leadership',
                    'David leads our engineering organisation. Previously Staff Engineer at '
                    'Andela and Senior SWE at Google Nairobi. Expert in distributed systems '
                    'and cloud-native architecture.',
                    True, 2,
                    'https://linkedin.com/in/david-kimani', 'https://github.com/dkimani',
                ),
                (
                    'Fatima Al-Hassan', 'Head of Design', 'design',
                    'Fatima leads product design across all KenyaTech projects. 8 years '
                    'of UX experience across fintech, healthtech, and government. She '
                    'champions human-centred design for low-bandwidth African contexts.',
                    True, 3,
                    'https://linkedin.com/in/fatima-alhassan', '',
                ),
                (
                    'Brian Otieno', 'Lead Backend Engineer', 'engineering',
                    'Brian architects our backend systems with a focus on scalability and '
                    'reliability. Python/Django specialist with deep M-PESA API expertise.',
                    True, 4,
                    'https://linkedin.com/in/brian-otieno', 'https://github.com/botieno',
                ),
                (
                    'Grace Mwangi', 'Senior Frontend Engineer', 'engineering',
                    'Grace builds beautiful, accessible web interfaces with React and '
                    'TypeScript. Contributor to several open-source accessibility projects.',
                    True, 5,
                    'https://linkedin.com/in/grace-mwangi', 'https://github.com/gmwangi',
                ),
                (
                    'Collins Kariuki', 'DevOps Engineer', 'engineering',
                    'Collins manages our cloud infrastructure across AWS and GCP. '
                    'Certified Kubernetes Administrator and AWS Solutions Architect.',
                    False, 6,
                    'https://linkedin.com/in/collins-kariuki', '',
                ),
                (
                    'Aisha Mahmoud', 'Product Manager', 'operations',
                    'Aisha bridges business and technology, turning client requirements '
                    'into clear product specs and managing delivery against tight timelines.',
                    False, 7,
                    'https://linkedin.com/in/aisha-mahmoud', '',
                ),
                (
                    'Peter Njoroge', 'Data Engineer', 'engineering',
                    'Peter designs and maintains our clients\' data pipelines, warehouses, '
                    'and ML model infrastructure. Python, dbt, BigQuery, and Airflow specialist.',
                    False, 8,
                    'https://linkedin.com/in/peter-njoroge', 'https://github.com/pnjoroge',
                ),
            ]
            count = 0
            for name, role, dept, bio, featured, order, linkedin, github in team_data:
                TeamMember.objects.get_or_create(
                    name=name,
                    defaults=dict(
                        role=role, department=dept, bio=bio,
                        is_featured=featured, order=order,
                        linkedin=linkedin, github=github,
                    ),
                )
                count += 1
            self.stdout.write(self.style.SUCCESS(f'  ✓ {count} team members'))

        # ─── PROJECTS ──────────────────────────────────────────
        if should_run('projects'):
            self.stdout.write('Seeding projects…')
            from core.models import Project, ServiceCategory

            try:
                web = ServiceCategory.objects.get(slug='web-development')
                mob = ServiceCategory.objects.get(slug='mobile-apps')
                dat = ServiceCategory.objects.get(slug='data-ai')
                eco = ServiceCategory.objects.get(slug='e-commerce')
            except ServiceCategory.DoesNotExist:
                self.stdout.write(self.style.WARNING('  ! Run --only services first, then projects'))
                web = mob = dat = eco = None

            projects_data = [
                (
                    'PesaPap — Mobile Banking Super-App',
                    'PesaPap Financial Services',
                    mob,
                    'A feature-complete mobile banking app serving 500,000+ users in Kenya, '
                    'with M-PESA integration, savings goals, micro-loans, and bill payments.',
                    ['Flutter', 'Django', 'PostgreSQL', 'AWS', 'M-PESA Daraja'],
                    'completed', True, 1,
                    date(2023, 8, 15),
                    '<p>PesaPap needed a complete rebuild of their mobile banking platform '
                    'to handle explosive growth. We designed and built a Flutter super-app '
                    'with full M-PESA STK Push, B2C, and C2B integrations, biometric login, '
                    'USSD fallback, and an offline-first architecture for low-connectivity areas.</p>'
                    '<p>The new app reduced transaction failures from 8% to 0.3% and '
                    'increased daily active users by 340% within six months of launch.</p>',
                    'https://pesapap.co.ke',
                ),
                (
                    'Duka360 — E-Commerce & Inventory Platform',
                    'Duka360 Ltd',
                    eco,
                    'An end-to-end e-commerce and inventory management platform for '
                    'Kenyan SMEs, integrating M-PESA, Equity, and card payments.',
                    ['React', 'Node.js', 'MongoDB', 'GCP', 'Stripe', 'M-PESA'],
                    'completed', True, 2,
                    date(2023, 3, 1),
                    '<p>Duka360 came to us with a painful spreadsheet-and-WhatsApp-based '
                    'inventory workflow. We built a full-featured SaaS platform that handles '
                    'product catalogues, stock management, order fulfilment, and a customer-facing '
                    'storefront — all with M-PESA as the primary checkout method.</p>',
                    'https://duka360.co.ke',
                ),
                (
                    'AfyaTrack — Patient Management System',
                    'Ministry of Health, Kenya',
                    web,
                    'A national patient registration and appointment booking system '
                    'deployed across 2,400 public health facilities in Kenya.',
                    ['Django', 'React', 'PostgreSQL', 'Docker', 'Nginx'],
                    'completed', True, 3,
                    date(2022, 11, 30),
                    '<p>Working with the Ministry of Health, we replaced a paper-based '
                    'patient registration system with a web application that works reliably '
                    'on intermittent 2G connections, supports offline data entry with sync, '
                    'and integrates with the national NHIF system for insurance verification.</p>',
                    '',
                ),
                (
                    'SokoAnalytics — Agricultural Market Intelligence',
                    'SokoAnalytics Inc.',
                    dat,
                    'A real-time commodity price tracking and forecasting platform '
                    'for smallholder farmers across East Africa.',
                    ['Python', 'FastAPI', 'React', 'BigQuery', 'dbt', 'Airflow', 'ML'],
                    'completed', True, 4,
                    date(2024, 1, 20),
                    '<p>SokoAnalytics aggregates commodity price data from 1,200 markets '
                    'across Kenya, Uganda, and Tanzania. We built the entire data pipeline '
                    '(ingestion → transformation → ML forecasting → API → dashboard) '
                    'and trained gradient-boosting models to predict price movements '
                    '7 days ahead with 82% accuracy.</p>',
                    'https://sokoanalytics.africa',
                ),
                (
                    'Twende — Ride-Hailing Platform',
                    'Twende Mobility',
                    mob,
                    'A full ride-hailing platform — driver and rider apps, dispatcher dashboard, '
                    'and real-time mapping — built to serve Tier-2 Kenyan cities.',
                    ['React Native', 'Node.js', 'PostgreSQL', 'Redis', 'Google Maps API'],
                    'completed', False, 5,
                    date(2023, 6, 10),
                    '<p>Twende wanted to compete with Uber in smaller Kenyan cities where '
                    'international players had limited presence. We built both the rider and '
                    'driver apps in React Native with real-time location tracking, surge pricing, '
                    'M-PESA wallet, and a web-based dispatcher dashboard.</p>',
                    '',
                ),
                (
                    'KenyaLands — Land Registry Portal',
                    'Ministry of Lands, Kenya',
                    web,
                    'A public-facing land search and title transfer portal that handles '
                    '50,000+ searches per day across Kenya.',
                    ['Django', 'React', 'PostgreSQL', 'Redis', 'AWS'],
                    'ongoing', True, 6,
                    None,
                    '<p>We are rebuilding the National Land Registry\'s public portal to '
                    'replace a legacy system that could only handle a few hundred concurrent '
                    'users. The new system handles 50,000+ searches per day, supports online '
                    'title transfer applications, and integrates with eCitizen for payments.</p>',
                    '',
                ),
            ]
            count = 0
            for title, client, cat, short_desc, tech, status, featured, order, comp_date, desc, live_url in projects_data:
                Project.objects.get_or_create(
                    title=title,
                    defaults=dict(
                        client=client, category=cat,
                        short_desc=short_desc, description=desc,
                        tech_stack=tech, status=status,
                        is_featured=featured, order=order,
                        completed_date=comp_date, live_url=live_url,
                    ),
                )
                count += 1
            self.stdout.write(self.style.SUCCESS(f'  ✓ {count} projects'))

        # ─── BLOG ──────────────────────────────────────────────
        if should_run('blog'):
            self.stdout.write('Seeding blog posts…')
            from core.models import BlogTag, BlogPost, TeamMember

            tags_names = ['Engineering', 'Design', 'DevOps', 'Mobile', 'Data', 'Fintech', 'Career', 'Kenya Tech']
            tags = {}
            for name in tags_names:
                t, _ = BlogTag.objects.get_or_create(name=name)
                tags[name] = t

            try:
                author = TeamMember.objects.get(name='Brian Otieno')
                author2 = TeamMember.objects.get(name='Grace Mwangi')
                author3 = TeamMember.objects.get(name='David Kimani')
            except TeamMember.DoesNotExist:
                author = author2 = author3 = None

            posts_data = [
                (
                    'Integrating M-PESA Daraja 2.0 with Django: A Complete Guide',
                    'engineering-mpesa-daraja-django',
                    author,
                    ['Engineering', 'Fintech'],
                    'A practical, production-tested walkthrough of integrating Safaricom\'s '
                    'Daraja 2.0 API — STK Push, B2C, C2B, and reversals — into a Django REST '
                    'Framework backend.',
                    True, 8, timezone.now() - timedelta(days=5),
                ),
                (
                    'Designing for Low-Bandwidth: Lessons from Building Products in Kenya',
                    'ux-low-bandwidth-kenya',
                    author2,
                    ['Design', 'Kenya Tech'],
                    'Most UX advice is written for fast, reliable internet. Here\'s what changes '
                    'when your users are on 2G in Kisumu or Eldoret — and how we account for it '
                    'at every stage of the design process.',
                    True, 6, timezone.now() - timedelta(days=12),
                ),
                (
                    'Zero-Downtime Deployments on AWS with Terraform and GitHub Actions',
                    'zero-downtime-aws-terraform-github-actions',
                    author3,
                    ['DevOps', 'Engineering'],
                    'A step-by-step guide to the deployment pipeline we use for every KenyaTech '
                    'production system — blue-green deployments, automated smoke tests, and '
                    'instant rollback.',
                    True, 7, timezone.now() - timedelta(days=18),
                ),
                (
                    'Flutter vs React Native in 2024: An African Developer\'s Perspective',
                    'flutter-vs-react-native-2024-africa',
                    author,
                    ['Mobile', 'Engineering'],
                    'After building six production apps on each framework in the past 18 months, '
                    'here is an honest comparison — with particular attention to performance on '
                    'mid-range Android devices common in East Africa.',
                    False, 9, timezone.now() - timedelta(days=25),
                ),
                (
                    'How We Built a Real-Time Price Forecasting Model for 1,200 Kenyan Markets',
                    'realtime-price-forecasting-model-kenya-markets',
                    author3,
                    ['Data', 'Engineering', 'Kenya Tech'],
                    'A technical deep-dive into the SokoAnalytics ML pipeline — from raw '
                    'WhatsApp-sourced price data to a gradient-boosting model predicting '
                    'commodity prices 7 days ahead with 82% accuracy.',
                    False, 10, timezone.now() - timedelta(days=35),
                ),
                (
                    'Why We Chose PostgreSQL over MongoDB for Every Project We\'ve Shipped',
                    'postgresql-vs-mongodb-kenya-tech',
                    author,
                    ['Engineering'],
                    'We tried MongoDB on four projects. We keep coming back to PostgreSQL. '
                    'Here is a frank account of why — including the times we were wrong.',
                    False, 8, timezone.now() - timedelta(days=50),
                ),
            ]
            count = 0
            for title, slug, auth, tag_names, excerpt, featured, read_time, pub_at in posts_data:
                post, created = BlogPost.objects.get_or_create(
                    slug=slug,
                    defaults=dict(
                        title=title,
                        author=auth,
                        excerpt=excerpt,
                        body=f'<p>{excerpt}</p><p>Full article content coming soon. This is a seed record.</p>',
                        status='published',
                        is_featured=featured,
                        read_time_minutes=read_time,
                        published_at=pub_at,
                        views=random.randint(120, 3400),
                    ),
                )
                if created:
                    post.tags.set([tags[n] for n in tag_names if n in tags])
                count += 1
            self.stdout.write(self.style.SUCCESS(f'  ✓ {count} blog posts, {len(tags_names)} tags'))

        # ─── JOBS ──────────────────────────────────────────────
        if should_run('jobs'):
            self.stdout.write('Seeding departments and jobs…')
            from core.models import Department, JobListing

            dept_data = [
                ('Engineering',       1),
                ('Design',            2),
                ('Product',           3),
                ('Data & AI',         4),
                ('Sales & Marketing', 5),
                ('Operations',        6),
            ]
            depts = {}
            for name, order in dept_data:
                d, _ = Department.objects.get_or_create(name=name, defaults={'order': order})
                depts[name] = d

            jobs_data = [
                (
                    'Senior Backend Engineer (Django/Python)',
                    depts['Engineering'], 'full_time', 'senior',
                    'Nairobi, Kenya (Hybrid)',
                    350_000, 500_000,
                    'We are looking for a Senior Backend Engineer to join our core platform '
                    'team. You will design, build, and maintain the APIs and services that '
                    'power products used by millions of East Africans.',
                    '- Design and build RESTful and GraphQL APIs with Django REST Framework\n'
                    '- Architect PostgreSQL schemas and write performant queries\n'
                    '- Integrate M-PESA Daraja, Airtel Money, and payment gateway APIs\n'
                    '- Mentor junior engineers through code review and pair programming\n'
                    '- Participate in on-call rotation (max 1 week per quarter)',
                    '- 4+ years of Python and Django production experience\n'
                    '- Strong PostgreSQL skills including indexing and query optimisation\n'
                    '- Experience with REST API design and documentation\n'
                    '- Comfortable with Docker and basic AWS/GCP services\n'
                    '- Excellent written communication in English',
                    '- M-PESA Daraja API experience\n'
                    '- Contributions to open-source Python projects\n'
                    '- Experience with Celery and Redis\n'
                    '- GraphQL (Strawberry or Graphene)',
                    '- Competitive salary: KES 350,000–500,000/month\n'
                    '- Medical cover for you and dependents\n'
                    '- KES 50,000 annual learning budget\n'
                    '- 25 days leave + public holidays\n'
                    '- ESOP participation after 12 months',
                    True, True, date.today() + timedelta(days=45),
                ),
                (
                    'Lead Mobile Engineer (Flutter)',
                    depts['Engineering'], 'full_time', 'lead',
                    'Nairobi, Kenya (Remote-friendly)',
                    400_000, 600_000,
                    'Lead our mobile engineering practice. You will own the architecture '
                    'of multiple Flutter codebases, set technical standards, and mentor '
                    'a team of three mobile engineers.',
                    '- Own end-to-end architecture of Flutter apps (state management, navigation, DI)\n'
                    '- Define and enforce code quality standards for the mobile team\n'
                    '- Work closely with Product and Design to ship new features weekly\n'
                    '- Manage App Store and Google Play releases including phased rollouts\n'
                    '- Interview and grow the mobile team',
                    '- 5+ years of mobile development, 2+ in Flutter/Dart\n'
                    '- Strong understanding of Riverpod or BLoC state management\n'
                    '- Experience shipping apps to >100,000 MAU\n'
                    '- Solid understanding of iOS and Android platform differences\n'
                    '- Experience with Firebase and push notification services',
                    '- React Native experience\n'
                    '- Published apps on both stores with >100k downloads\n'
                    '- Experience with M-PESA SDK\n'
                    '- Familiarity with Kotlin/Swift for native module writing',
                    '- KES 400,000–600,000/month\n'
                    '- Full medical, dental, and optical\n'
                    '- Annual tech hardware stipend (KES 80,000)\n'
                    '- Flexible remote work policy',
                    True, True, date.today() + timedelta(days=30),
                ),
                (
                    'Senior UI/UX Designer',
                    depts['Design'], 'full_time', 'senior',
                    'Nairobi, Kenya (Hybrid)',
                    280_000, 400_000,
                    'We need a Senior Designer who can lead the end-to-end design process — '
                    'from discovery and user research through high-fidelity Figma prototypes '
                    'and design system maintenance.',
                    '- Conduct user interviews and usability testing with real users in Kenya\n'
                    '- Create user flows, wireframes, and high-fidelity Figma designs\n'
                    '- Maintain and evolve the KenyaTech design system\n'
                    '- Work closely with engineers to ensure pixel-perfect implementation\n'
                    '- Present design decisions to clients with confidence',
                    '- 4+ years of product design experience (web and mobile)\n'
                    '- Expert-level Figma skills including auto-layout and components\n'
                    '- Strong portfolio demonstrating end-to-end design process\n'
                    '- Experience designing for low-bandwidth and accessibility constraints\n'
                    '- Solid understanding of front-end implementation (HTML/CSS basics)',
                    '- Motion design skills (Rive, Lottie, or After Effects)\n'
                    '- Experience with design systems at scale\n'
                    '- Swahili language skills for localisation work',
                    '- KES 280,000–400,000/month\n'
                    '- Creative tools budget (Figma, Adobe CC)\n'
                    '- Conference and workshop attendance\n'
                    '- Flexible hours',
                    True, False, date.today() + timedelta(days=60),
                ),
                (
                    'Data Engineer',
                    depts['Data & AI'], 'full_time', 'mid',
                    'Nairobi, Kenya (Hybrid)',
                    250_000, 380_000,
                    'Join our Data & AI practice to build the data pipelines, warehouses, '
                    'and ML infrastructure that power insights for our clients\' businesses.',
                    '- Design and build ELT pipelines using dbt, Airflow, and BigQuery\n'
                    '- Build and maintain data models and transformation logic\n'
                    '- Deploy and monitor ML models in production\n'
                    '- Create dashboards in Metabase and Looker Studio\n'
                    '- Ensure data quality and documentation across all pipelines',
                    '- 3+ years of data engineering experience\n'
                    '- Strong Python and SQL skills\n'
                    '- Experience with dbt and a cloud data warehouse (BigQuery, Redshift, or Snowflake)\n'
                    '- Familiarity with workflow orchestration (Airflow, Prefect, or similar)\n'
                    '- Understanding of data modelling principles',
                    '- Machine learning experience (scikit-learn, XGBoost)\n'
                    '- Experience with streaming data (Kafka or Pub/Sub)\n'
                    '- Agricultural or healthcare domain knowledge',
                    '- KES 250,000–380,000/month\n'
                    '- Annual learning budget\n'
                    '- Conference sponsorship\n'
                    '- Hybrid work arrangement',
                    True, False, date.today() + timedelta(days=45),
                ),
                (
                    'Junior Frontend Engineer (React)',
                    depts['Engineering'], 'full_time', 'entry',
                    'Nairobi, Kenya (On-site with WFH Fridays)',
                    120_000, 180_000,
                    'We are looking for a motivated junior developer to join our frontend '
                    'team. You will work alongside senior engineers on live client projects '
                    'while growing your skills rapidly in a structured mentorship programme.',
                    '- Build React components and pages from Figma designs\n'
                    '- Write clean, tested TypeScript code\n'
                    '- Participate in code reviews and pair programming sessions\n'
                    '- Fix bugs and write automated tests\n'
                    '- Document your work thoroughly',
                    '- 1+ year of React experience (internship, freelance, or employment)\n'
                    '- Solid understanding of HTML, CSS, and JavaScript fundamentals\n'
                    '- Basic understanding of REST APIs\n'
                    '- A portfolio or GitHub profile demonstrating your work\n'
                    '- Willingness to learn and receive feedback',
                    '- TypeScript experience\n'
                    '- Understanding of accessibility (a11y)\n'
                    '- Contributions to open-source projects',
                    '- KES 120,000–180,000/month\n'
                    '- Structured 6-month mentorship programme\n'
                    '- Full medical cover\n'
                    '- Laptop provided',
                    True, False, date.today() + timedelta(days=60),
                ),
                (
                    'Software Engineering Intern',
                    depts['Engineering'], 'internship', 'entry',
                    'Nairobi, Kenya (On-site)',
                    50_000, 70_000,
                    'A 3-month paid internship for final-year university students or recent '
                    'graduates. You will contribute to real client projects under close '
                    'mentorship from our senior engineers.',
                    '- Assist with feature development on live projects\n'
                    '- Write unit and integration tests\n'
                    '- Participate in daily stand-ups and sprint ceremonies\n'
                    '- Document APIs and processes\n'
                    '- Present a small project at the end of your internship',
                    '- Currently in final year of BSc Computer Science, Software Engineering, or IT\n'
                    '- Basic Python or JavaScript knowledge\n'
                    '- Genuine curiosity and eagerness to learn\n'
                    '- Able to commit to full 3-month programme',
                    '- Any personal projects or hackathon participation\n'
                    '- Knowledge of Git and version control',
                    '- KES 50,000–70,000/month stipend\n'
                    '- Mentorship from senior engineers\n'
                    '- Certificate of completion\n'
                    '- Fast-track to full-time offer for outstanding interns',
                    True, False, date.today() + timedelta(days=30),
                ),
            ]
            count = 0
            for (title, dept, jtype, level, location,
                 sal_min, sal_max,
                 desc, resps, reqs, nice, benefits,
                 is_active, is_featured, deadline) in jobs_data:
                JobListing.objects.get_or_create(
                    title=title,
                    defaults=dict(
                        department=dept, job_type=jtype, level=level,
                        location=location, salary_min=sal_min, salary_max=sal_max,
                        description=desc, responsibilities=resps,
                        requirements=reqs, nice_to_have=nice, benefits=benefits,
                        is_active=is_active, is_featured=is_featured,
                        deadline=deadline,
                    ),
                )
                count += 1
            self.stdout.write(self.style.SUCCESS(f'  ✓ {len(dept_data)} departments, {count} jobs'))

        # ─── TESTIMONIALS ───────────────────────────────────────
        if should_run('testimonials'):
            self.stdout.write('Seeding testimonials…')
            from core.models import Testimonial, Service

            try:
                svc_web = Service.objects.get(slug='web-application-development')
                svc_mob = Service.objects.get(slug='mobile-app-development')
                svc_dat = Service.objects.get(slug='data-engineering-ai')
            except Service.DoesNotExist:
                svc_web = svc_mob = svc_dat = None

            testimonials_data = [
                (
                    'Wangari Njuguna', 'Chief Digital Officer', 'PesaPap Financial Services',
                    'KenyaTech rebuilt our mobile app from scratch in just 14 weeks. The new '
                    'app reduced transaction failures from 8% to 0.3% and we saw a 340% jump '
                    'in daily active users. They truly understood what our customers needed.',
                    5, svc_mob, True, 1,
                ),
                (
                    'James Mwaniki', 'Head of Technology', 'Ministry of Health Kenya',
                    'Delivering a system that works across 2,400 health facilities — many with '
                    'intermittent internet — was a huge challenge. KenyaTech solved it elegantly. '
                    'The offline-first approach they designed has been transformative.',
                    5, svc_web, True, 2,
                ),
                (
                    'Priya Sharma', 'CEO', 'SokoAnalytics Inc.',
                    'The ML pipeline KenyaTech built forecasts commodity prices with 82% accuracy '
                    'across 1,200 markets. Farmers and traders on our platform have measurably '
                    'improved their buying and selling decisions. Incredible work.',
                    5, svc_dat, True, 3,
                ),
                (
                    'Emmanuel Otieno', 'Founder', 'Duka360 Ltd',
                    'We went from a messy WhatsApp-and-spreadsheet operation to a fully automated '
                    'e-commerce platform in 10 weeks. The M-PESA checkout alone increased our '
                    'conversion rate by 60%. KenyaTech is simply the best team in Nairobi.',
                    5, svc_web, True, 4,
                ),
                (
                    'Amina Waweru', 'CTO', 'Twende Mobility',
                    'Building a ride-hailing app is hard. Building one that works reliably '
                    'in Mombasa, Nakuru, and Eldoret — where connectivity is unpredictable — '
                    'is even harder. KenyaTech nailed it.',
                    5, svc_mob, True, 5,
                ),
                (
                    'Dr. Kevin Omondi', 'Director, Digital Health', 'AMREF Health Africa',
                    'Professional, communicative, and technically exceptional. They delivered '
                    'every milestone on time and the code quality is the best we have received '
                    'from any vendor. We will absolutely work with them again.',
                    5, svc_web, False, 6,
                ),
            ]
            count = 0
            for name, role, company, content, rating, service, featured, order in testimonials_data:
                Testimonial.objects.get_or_create(
                    name=name,
                    defaults=dict(
                        role=role, company=company, content=content,
                        rating=rating, service=service,
                        is_featured=featured, order=order,
                    ),
                )
                count += 1
            self.stdout.write(self.style.SUCCESS(f'  ✓ {count} testimonials'))

        # ─── FAQs ───────────────────────────────────────────────
        if should_run('faqs'):
            self.stdout.write('Seeding FAQs…')
            from core.models import FAQCategory, FAQ

            faq_data = {
                'Working With Us': [
                    (
                        'How long does a typical project take?',
                        'Most web application projects take 6–14 weeks depending on scope. '
                        'Mobile apps typically take 10–18 weeks. We agree on a fixed timeline '
                        'before we start and hold ourselves accountable to it.',
                        1,
                    ),
                    (
                        'Do you work with startups or only large organisations?',
                        'We work with everyone from pre-seed startups to national government '
                        'agencies. We have flexible engagement models for early-stage companies, '
                        'including milestone-based payments and equity arrangements in some cases.',
                        2,
                    ),
                    (
                        'Will I own the source code?',
                        'Yes — always. You get full ownership of all source code, design files, '
                        'database schemas, and intellectual property. We never retain ownership '
                        'of anything we build for you.',
                        3,
                    ),
                    (
                        'Can you work with our existing codebase?',
                        'Absolutely. Our engineers are experienced at inheriting, auditing, and '
                        'improving existing codebases. We will conduct a technical review in the '
                        'first week and give you an honest assessment before we commit.',
                        4,
                    ),
                    (
                        'What are your payment terms?',
                        'Standard terms are 30% upfront, 40% at the mid-project milestone, and '
                        '30% on delivery. We also offer monthly retainer arrangements for ongoing '
                        'work. We accept bank transfer, M-PESA Paybill, and card payment.',
                        5,
                    ),
                ],
                'Technical Questions': [
                    (
                        'What tech stack do you use?',
                        'We are stack-agnostic and choose the right tool for each project. '
                        'Most commonly: React or Next.js (frontend), Django or Node.js (backend), '
                        'PostgreSQL (database), Flutter or React Native (mobile), AWS or GCP (cloud). '
                        'We can also work within your existing stack.',
                        1,
                    ),
                    (
                        'Do you integrate with M-PESA?',
                        'Yes — M-PESA integration is one of our core specialisms. We have built '
                        'Daraja 2.0 integrations (STK Push, B2C, C2B, reversals, account balance) '
                        'into dozens of production systems. We also work with Airtel Money, '
                        'Equity EazzyPay, and international gateways like Stripe and Flutterwave.',
                        2,
                    ),
                    (
                        'Do you provide hosting and infrastructure?',
                        'We can manage your infrastructure on AWS, GCP, or Azure as part of an '
                        'ongoing retainer, or we can hand over a fully documented, production-ready '
                        'setup for your team to manage. Either way, we use infrastructure-as-code '
                        '(Terraform) so the setup is fully reproducible.',
                        3,
                    ),
                    (
                        'What happens if something breaks after launch?',
                        'All projects include a 60-day warranty period after launch during which '
                        'we fix any bugs at no charge. Beyond that, we offer tiered support retainers '
                        'with 2-hour, 4-hour, or next-business-day SLAs depending on criticality.',
                        4,
                    ),
                ],
            }
            total = 0
            for cat_name, faqs in faq_data.items():
                cat, _ = FAQCategory.objects.get_or_create(name=cat_name)
                for question, answer, order in faqs:
                    FAQ.objects.get_or_create(
                        question=question,
                        defaults=dict(category=cat, answer=answer, order=order, is_active=True),
                    )
                    total += 1
            self.stdout.write(self.style.SUCCESS(f'  ✓ {total} FAQs in {len(faq_data)} categories'))

        # ─── DONE ───────────────────────────────────────────────
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 52))
        self.stdout.write(self.style.SUCCESS('  KenyaTech seed data created successfully! 🇰🇪'))
        self.stdout.write(self.style.SUCCESS('=' * 52))
        self.stdout.write('')
        self.stdout.write('  Admin:    http://localhost:8000/admin/')
        self.stdout.write('  API root: http://localhost:8000/api/v1/')
        self.stdout.write('  Frontend: http://localhost:5173/')
        self.stdout.write('')