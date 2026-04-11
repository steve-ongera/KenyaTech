"""
KenyaTech — core/models.py
All models use slugs for SEO-friendly URLs.
"""
from django.db import models
from django.utils.text import slugify
from django.utils import timezone
import uuid


def unique_slug(instance, value, slug_field='slug'):
    base = slugify(value)
    slug = base
    Model = instance.__class__
    n = 1
    while True:
        qs = Model.objects.filter(**{slug_field: slug})
        if instance.pk:
            qs = qs.exclude(pk=instance.pk)
        if not qs.exists():
            break
        slug = f"{base}-{n}"
        n += 1
    return slug


# ─── Site Settings (singleton) ──────────────────────────
class SiteSettings(models.Model):
    company_name         = models.CharField(max_length=100, default='KenyaTech')
    tagline              = models.CharField(max_length=200, blank=True)
    email                = models.EmailField(blank=True)
    phone                = models.CharField(max_length=30, blank=True)
    address              = models.TextField(blank=True)
    logo                 = models.ImageField(upload_to='site/', blank=True, null=True)
    twitter_url          = models.URLField(blank=True)
    linkedin_url         = models.URLField(blank=True)
    github_url           = models.URLField(blank=True)
    facebook_url         = models.URLField(blank=True)
    youtube_url          = models.URLField(blank=True)
    meta_description     = models.TextField(blank=True)
    meta_keywords        = models.TextField(blank=True)
    google_analytics_id  = models.CharField(max_length=30, blank=True)
    updated_at           = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = verbose_name_plural = 'Site Settings'

    def __str__(self): return self.company_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


# ─── Service Category ────────────────────────────────────
class ServiceCategory(models.Model):
    name        = models.CharField(max_length=100)
    slug        = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    order       = models.PositiveSmallIntegerField(default=0)

    class Meta:
        verbose_name_plural = 'Service Categories'
        ordering = ['order', 'name']

    def __str__(self): return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(self, self.name)
        super().save(*args, **kwargs)


# ─── Service ─────────────────────────────────────────────
class Service(models.Model):
    category         = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='services')
    title            = models.CharField(max_length=150)
    slug             = models.SlugField(unique=True, blank=True)
    icon             = models.CharField(max_length=60, blank=True, help_text='Bootstrap icon class')
    short_desc       = models.CharField(max_length=300, blank=True)
    description      = models.TextField(blank=True)
    image            = models.ImageField(upload_to='services/', blank=True, null=True)
    is_featured      = models.BooleanField(default=False)
    order            = models.PositiveSmallIntegerField(default=0)
    meta_title       = models.CharField(max_length=160, blank=True)
    meta_description = models.TextField(blank=True)
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self): return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(self, self.title)
        if not self.meta_title:
            self.meta_title = f"{self.title} | KenyaTech"
        super().save(*args, **kwargs)


# ─── Team Member ─────────────────────────────────────────
class TeamMember(models.Model):
    DEPARTMENT_CHOICES = [
        ('leadership', 'Leadership'), ('engineering', 'Engineering'),
        ('design', 'Design'), ('marketing', 'Marketing'),
        ('sales', 'Sales'), ('operations', 'Operations'), ('support', 'Support'),
    ]
    name        = models.CharField(max_length=150)
    slug        = models.SlugField(unique=True, blank=True)
    role        = models.CharField(max_length=150)
    department  = models.CharField(max_length=30, choices=DEPARTMENT_CHOICES, default='engineering')
    bio         = models.TextField(blank=True)
    photo       = models.ImageField(upload_to='team/', blank=True, null=True)
    email       = models.EmailField(blank=True)
    linkedin    = models.URLField(blank=True)
    twitter     = models.URLField(blank=True)
    github      = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)
    order       = models.PositiveSmallIntegerField(default=0)
    joined_date = models.DateField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self): return f"{self.name} — {self.role}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(self, self.name)
        super().save(*args, **kwargs)


# ─── Project / Portfolio ─────────────────────────────────
class Project(models.Model):
    STATUS_CHOICES = [
        ('completed', 'Completed'), ('ongoing', 'Ongoing'), ('coming_soon', 'Coming Soon'),
    ]
    title            = models.CharField(max_length=200)
    slug             = models.SlugField(unique=True, blank=True)
    client           = models.CharField(max_length=150, blank=True)
    category         = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    short_desc       = models.CharField(max_length=300, blank=True)
    description      = models.TextField(blank=True)
    cover_image      = models.ImageField(upload_to='projects/', blank=True, null=True)
    tech_stack       = models.JSONField(default=list, blank=True)
    live_url         = models.URLField(blank=True)
    github_url       = models.URLField(blank=True)
    status           = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    is_featured      = models.BooleanField(default=False)
    order            = models.PositiveSmallIntegerField(default=0)
    completed_date   = models.DateField(null=True, blank=True)
    meta_title       = models.CharField(max_length=160, blank=True)
    meta_description = models.TextField(blank=True)
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-completed_date', 'order']

    def __str__(self): return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(self, self.title)
        if not self.meta_title:
            self.meta_title = f"{self.title} | KenyaTech Portfolio"
        super().save(*args, **kwargs)


# ─── Blog ────────────────────────────────────────────────
class BlogTag(models.Model):
    name = models.CharField(max_length=60)
    slug = models.SlugField(unique=True, blank=True)

    class Meta: ordering = ['name']
    def __str__(self): return self.name
    def save(self, *args, **kwargs):
        if not self.slug: self.slug = unique_slug(self, self.name)
        super().save(*args, **kwargs)


class BlogPost(models.Model):
    STATUS_CHOICES = [('draft', 'Draft'), ('published', 'Published')]
    title            = models.CharField(max_length=200)
    slug             = models.SlugField(unique=True, blank=True)
    author           = models.ForeignKey(TeamMember, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    tags             = models.ManyToManyField(BlogTag, blank=True, related_name='posts')
    excerpt          = models.CharField(max_length=400, blank=True)
    body             = models.TextField()
    cover_image      = models.ImageField(upload_to='blog/', blank=True, null=True)
    status           = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    is_featured      = models.BooleanField(default=False)
    views            = models.PositiveIntegerField(default=0)
    read_time_minutes= models.PositiveSmallIntegerField(default=5)
    published_at     = models.DateTimeField(null=True, blank=True)
    meta_title       = models.CharField(max_length=160, blank=True)
    meta_description = models.TextField(blank=True)
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta: ordering = ['-published_at']
    def __str__(self): return self.title

    def save(self, *args, **kwargs):
        if not self.slug: self.slug = unique_slug(self, self.title)
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        if not self.meta_title: self.meta_title = f"{self.title} | KenyaTech Blog"
        if not self.meta_description and self.excerpt: self.meta_description = self.excerpt
        super().save(*args, **kwargs)


# ─── Careers ─────────────────────────────────────────────
class Department(models.Model):
    name  = models.CharField(max_length=100)
    slug  = models.SlugField(unique=True, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta: ordering = ['order', 'name']
    def __str__(self): return self.name
    def save(self, *args, **kwargs):
        if not self.slug: self.slug = unique_slug(self, self.name)
        super().save(*args, **kwargs)


class JobListing(models.Model):
    TYPE_CHOICES = [
        ('full_time', 'Full Time'), ('part_time', 'Part Time'),
        ('contract', 'Contract'), ('internship', 'Internship'), ('remote', 'Remote'),
    ]
    LEVEL_CHOICES = [
        ('entry', 'Entry Level'), ('mid', 'Mid Level'), ('senior', 'Senior'),
        ('lead', 'Lead / Principal'), ('manager', 'Manager'),
    ]
    title            = models.CharField(max_length=200)
    slug             = models.SlugField(unique=True, blank=True)
    department       = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='jobs')
    job_type         = models.CharField(max_length=20, choices=TYPE_CHOICES, default='full_time')
    level            = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='mid')
    location         = models.CharField(max_length=150, default='Nairobi, Kenya')
    salary_min       = models.PositiveIntegerField(null=True, blank=True)
    salary_max       = models.PositiveIntegerField(null=True, blank=True)
    salary_currency  = models.CharField(max_length=10, default='KES')
    description      = models.TextField()
    responsibilities = models.TextField(blank=True)
    requirements     = models.TextField(blank=True)
    nice_to_have     = models.TextField(blank=True)
    benefits         = models.TextField(blank=True)
    is_active        = models.BooleanField(default=True)
    is_featured      = models.BooleanField(default=False)
    deadline         = models.DateField(null=True, blank=True)
    meta_title       = models.CharField(max_length=160, blank=True)
    meta_description = models.TextField(blank=True)
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta: ordering = ['-created_at']
    def __str__(self): return f"{self.title} ({self.get_job_type_display()})"

    @property
    def salary_range(self):
        if self.salary_min and self.salary_max:
            return f"{self.salary_currency} {self.salary_min:,} – {self.salary_max:,}"
        return 'Competitive'

    def save(self, *args, **kwargs):
        if not self.slug: self.slug = unique_slug(self, self.title)
        if not self.meta_title: self.meta_title = f"{self.title} at KenyaTech | Careers"
        super().save(*args, **kwargs)


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('received', 'Received'), ('reviewing', 'Under Review'),
        ('interview', 'Interview Scheduled'), ('offered', 'Offer Extended'),
        ('hired', 'Hired'), ('rejected', 'Rejected'), ('withdrawn', 'Withdrawn'),
    ]
    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job           = models.ForeignKey(JobListing, on_delete=models.CASCADE, related_name='applications')
    first_name    = models.CharField(max_length=100)
    last_name     = models.CharField(max_length=100)
    email         = models.EmailField()
    phone         = models.CharField(max_length=30, blank=True)
    linkedin_url  = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    cover_letter  = models.TextField(blank=True)
    resume        = models.FileField(upload_to='applications/resumes/')
    status        = models.CharField(max_length=15, choices=STATUS_CHOICES, default='received')
    notes         = models.TextField(blank=True)
    applied_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta: ordering = ['-applied_at']
    def __str__(self): return f"{self.first_name} {self.last_name} → {self.job.title}"


# ─── Testimonial ─────────────────────────────────────────
class Testimonial(models.Model):
    name        = models.CharField(max_length=150)
    role        = models.CharField(max_length=150, blank=True)
    company     = models.CharField(max_length=150, blank=True)
    photo       = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    content     = models.TextField()
    rating      = models.PositiveSmallIntegerField(default=5, choices=[(i, i) for i in range(1, 6)])
    service     = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name='testimonials')
    is_featured = models.BooleanField(default=False)
    order       = models.PositiveSmallIntegerField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta: ordering = ['order', '-created_at']
    def __str__(self): return f"{self.name} — {self.company}"


# ─── FAQ ─────────────────────────────────────────────────
class FAQCategory(models.Model):
    name  = models.CharField(max_length=100)
    slug  = models.SlugField(unique=True, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        verbose_name = 'FAQ Category'
        verbose_name_plural = 'FAQ Categories'
        ordering = ['order']

    def __str__(self): return self.name
    def save(self, *args, **kwargs):
        if not self.slug: self.slug = unique_slug(self, self.name)
        super().save(*args, **kwargs)


class FAQ(models.Model):
    category  = models.ForeignKey(FAQCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='faqs')
    question  = models.CharField(max_length=300)
    answer    = models.TextField()
    order     = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'FAQ'
        ordering = ['order']

    def __str__(self): return self.question[:80]


# ─── Contact ─────────────────────────────────────────────
class ContactMessage(models.Model):
    STATUS_CHOICES = [('new', 'New'), ('read', 'Read'), ('replied', 'Replied'), ('closed', 'Closed')]
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name       = models.CharField(max_length=150)
    email      = models.EmailField()
    phone      = models.CharField(max_length=30, blank=True)
    subject    = models.CharField(max_length=200, blank=True)
    service    = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name='inquiries')
    message    = models.TextField()
    status     = models.CharField(max_length=10, choices=STATUS_CHOICES, default='new')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta: ordering = ['-created_at']
    def __str__(self): return f"{self.name} — {self.subject or 'No subject'}"


# ─── Newsletter ──────────────────────────────────────────
class NewsletterSubscriber(models.Model):
    email         = models.EmailField(unique=True)
    name          = models.CharField(max_length=150, blank=True)
    is_active     = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta: ordering = ['-subscribed_at']
    def __str__(self): return self.email


# ─── Stats ───────────────────────────────────────────────
class SiteStat(models.Model):
    label  = models.CharField(max_length=100)
    value  = models.CharField(max_length=50)
    suffix = models.CharField(max_length=20, blank=True)
    icon   = models.CharField(max_length=60, blank=True)
    order  = models.PositiveSmallIntegerField(default=0)

    class Meta: ordering = ['order']
    def __str__(self): return f"{self.value} {self.label}"


# ─── Hero Banner ─────────────────────────────────────────
class HeroBanner(models.Model):
    eyebrow    = models.CharField(max_length=100, blank=True)
    title      = models.CharField(max_length=200)
    subtitle   = models.TextField(blank=True)
    cta_label  = models.CharField(max_length=60, default='Get Started')
    cta_url    = models.CharField(max_length=200, default='#contact')
    cta2_label = models.CharField(max_length=60, blank=True)
    cta2_url   = models.CharField(max_length=200, blank=True)
    image      = models.ImageField(upload_to='hero/', blank=True, null=True)
    is_active  = models.BooleanField(default=True)
    order      = models.PositiveSmallIntegerField(default=0)

    class Meta: ordering = ['order']
    def __str__(self): return self.title


# ─── Client / Partner Logo ───────────────────────────────
class ClientLogo(models.Model):
    name      = models.CharField(max_length=100)
    logo      = models.ImageField(upload_to='clients/')
    url       = models.URLField(blank=True)
    order     = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta: ordering = ['order', 'name']
    def __str__(self): return self.name