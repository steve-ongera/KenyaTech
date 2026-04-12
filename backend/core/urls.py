"""
KenyaTech — core/urls.py
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'hero-banners',        views.HeroBannerViewSet,       basename='hero-banner')
router.register(r'service-categories',  views.ServiceCategoryViewSet,  basename='service-category')
router.register(r'services',            views.ServiceViewSet,          basename='service')
router.register(r'team',                views.TeamMemberViewSet,       basename='team')
router.register(r'projects',            views.ProjectViewSet,          basename='project')
router.register(r'blog/tags',           views.BlogTagViewSet,          basename='blog-tag')
router.register(r'blog',               views.BlogPostViewSet,          basename='blog-post')
router.register(r'departments',         views.DepartmentViewSet,       basename='department')
router.register(r'jobs',               views.JobListingViewSet,        basename='job')
router.register(r'testimonials',        views.TestimonialViewSet,      basename='testimonial')
router.register(r'faq-categories',     views.FAQCategoryViewSet,       basename='faq-category')
router.register(r'faqs',               views.FAQViewSet,               basename='faq')

urlpatterns = [
    path('', include(router.urls)),
    path('settings/',           views.site_settings,              name='site-settings'),
    path('stats/',              views.site_stats,                 name='site-stats'),
    path('client-logos/',       views.client_logos,               name='client-logos'),
    path('homepage/',           views.homepage_data,              name='homepage-data'),
    path('contact/',            views.ContactMessageCreateView.as_view(),    name='contact'),
    path('newsletter/',         views.NewsletterSubscribeView.as_view(),     name='newsletter'),
]