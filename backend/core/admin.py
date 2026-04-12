"""
KenyaTech — core/admin.py
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    SiteSettings, ServiceCategory, Service, TeamMember, Project,
    BlogTag, BlogPost, Department, JobListing, JobApplication,
    Testimonial, FAQCategory, FAQ, ContactMessage, NewsletterSubscriber,
    SiteStat, HeroBanner, ClientLogo,
)

admin.site.site_header = 'KenyaTech Admin'
admin.site.site_title  = 'KenyaTech'
admin.site.index_title = 'Dashboard'


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Company', {'fields': ('company_name', 'tagline', 'logo')}),
        ('Contact', {'fields': ('email', 'phone', 'address')}),
        ('Social', {'fields': ('twitter_url', 'linkedin_url', 'github_url', 'facebook_url', 'youtube_url')}),
        ('SEO', {'fields': ('meta_description', 'meta_keywords', 'google_analytics_id')}),
    )


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display  = ('name', 'slug', 'order')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('order',)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display  = ('title', 'category', 'is_featured', 'order', 'created_at')
    list_filter   = ('category', 'is_featured')
    search_fields = ('title', 'short_desc')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_featured', 'order')


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display  = ('name', 'role', 'department', 'is_featured', 'order')
    list_filter   = ('department', 'is_featured')
    search_fields = ('name', 'role')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('is_featured', 'order')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display  = ('title', 'client', 'category', 'status', 'is_featured', 'completed_date')
    list_filter   = ('status', 'category', 'is_featured')
    search_fields = ('title', 'client', 'short_desc')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_featured',)


@admin.register(BlogTag)
class BlogTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display  = ('title', 'author', 'status', 'is_featured', 'views', 'published_at')
    list_filter   = ('status', 'is_featured', 'tags')
    search_fields = ('title', 'excerpt', 'body')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('status', 'is_featured')
    filter_horizontal = ('tags',)
    readonly_fields = ('views', 'published_at', 'created_at', 'updated_at')


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'order')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(JobListing)
class JobListingAdmin(admin.ModelAdmin):
    list_display  = ('title', 'department', 'job_type', 'level', 'location', 'is_active', 'is_featured', 'deadline')
    list_filter   = ('job_type', 'level', 'department', 'is_active', 'is_featured')
    search_fields = ('title', 'description', 'location')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_active', 'is_featured')


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display  = ('__str__', 'email', 'status', 'applied_at')
    list_filter   = ('status', 'job')
    search_fields = ('first_name', 'last_name', 'email')
    readonly_fields = ('id', 'applied_at', 'updated_at')
    list_editable = ('status',)


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display  = ('name', 'company', 'rating', 'is_featured', 'order')
    list_filter   = ('rating', 'is_featured')
    list_editable = ('is_featured', 'order')


@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'order')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display  = ('question', 'category', 'is_active', 'order')
    list_filter   = ('category', 'is_active')
    search_fields = ('question', 'answer')
    list_editable = ('is_active', 'order')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display  = ('name', 'email', 'subject', 'status', 'created_at')
    list_filter   = ('status',)
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('id', 'ip_address', 'created_at', 'updated_at')
    list_editable = ('status',)


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display  = ('email', 'name', 'is_active', 'subscribed_at')
    list_filter   = ('is_active',)
    search_fields = ('email', 'name')


@admin.register(SiteStat)
class SiteStatAdmin(admin.ModelAdmin):
    list_display  = ('label', 'value', 'suffix', 'order')
    list_editable = ('order',)


@admin.register(HeroBanner)
class HeroBannerAdmin(admin.ModelAdmin):
    list_display  = ('title', 'eyebrow', 'is_active', 'order')
    list_editable = ('is_active', 'order')


@admin.register(ClientLogo)
class ClientLogoAdmin(admin.ModelAdmin):
    list_display  = ('name', 'is_active', 'order')
    list_editable = ('is_active', 'order')