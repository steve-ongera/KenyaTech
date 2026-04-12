"""
KenyaTech — core/serializers.py
"""
from rest_framework import serializers
from .models import (
    SiteSettings, ServiceCategory, Service, TeamMember, Project,
    BlogTag, BlogPost, Department, JobListing, JobApplication,
    Testimonial, FAQCategory, FAQ, ContactMessage, NewsletterSubscriber,
    SiteStat, HeroBanner, ClientLogo,
)


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        exclude = ['google_analytics_id']


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = '__all__'


class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Service
        fields = '__all__'


class ServiceDetailSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)
    testimonials = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = '__all__'

    def get_testimonials(self, obj):
        qs = obj.testimonials.filter(is_featured=True)[:3]
        return TestimonialSerializer(qs, many=True, context=self.context).data


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        exclude = ['email']


class TeamMemberDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Project
        fields = '__all__'


class BlogTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogTag
        fields = '__all__'


class BlogPostListSerializer(serializers.ModelSerializer):
    author_name  = serializers.CharField(source='author.name', read_only=True)
    author_photo = serializers.ImageField(source='author.photo', read_only=True)
    tags         = BlogTagSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        exclude = ['body']


class BlogPostDetailSerializer(serializers.ModelSerializer):
    author  = TeamMemberSerializer(read_only=True)
    tags    = BlogTagSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    job_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = '__all__'

    def get_job_count(self, obj):
        return obj.jobs.filter(is_active=True).count()


class JobListingSerializer(serializers.ModelSerializer):
    department_name   = serializers.CharField(source='department.name', read_only=True)
    salary_range      = serializers.CharField(read_only=True)
    job_type_display  = serializers.CharField(source='get_job_type_display', read_only=True)
    level_display     = serializers.CharField(source='get_level_display', read_only=True)

    class Meta:
        model = JobListing
        exclude = ['responsibilities', 'requirements', 'nice_to_have', 'benefits', 'meta_title', 'meta_description']


class JobListingDetailSerializer(serializers.ModelSerializer):
    department        = DepartmentSerializer(read_only=True)
    salary_range      = serializers.CharField(read_only=True)
    job_type_display  = serializers.CharField(source='get_job_type_display', read_only=True)
    level_display     = serializers.CharField(source='get_level_display', read_only=True)

    class Meta:
        model = JobListing
        fields = '__all__'


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'first_name', 'last_name', 'email', 'phone',
            'linkedin_url', 'portfolio_url', 'cover_letter', 'resume', 'applied_at',
        ]
        read_only_fields = ['id', 'applied_at']


class TestimonialSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service.title', read_only=True)

    class Meta:
        model = Testimonial
        fields = '__all__'


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'


class FAQCategorySerializer(serializers.ModelSerializer):
    faqs = FAQSerializer(many=True, read_only=True)

    class Meta:
        model = FAQCategory
        fields = '__all__'


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'subject', 'service', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['email', 'name']


class SiteStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteStat
        fields = '__all__'


class HeroBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroBanner
        fields = '__all__'


class ClientLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientLogo
        fields = '__all__'