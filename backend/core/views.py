"""
KenyaTech — core/views.py
"""
from rest_framework import viewsets, generics, filters, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from .models import (
    SiteSettings, ServiceCategory, Service, TeamMember, Project,
    BlogTag, BlogPost, Department, JobListing, JobApplication,
    Testimonial, FAQCategory, FAQ, ContactMessage, NewsletterSubscriber,
    SiteStat, HeroBanner, ClientLogo,
)
from .serializers import (
    SiteSettingsSerializer, ServiceCategorySerializer,
    ServiceSerializer, ServiceDetailSerializer,
    TeamMemberSerializer, TeamMemberDetailSerializer,
    ProjectSerializer, BlogTagSerializer,
    BlogPostListSerializer, BlogPostDetailSerializer,
    DepartmentSerializer, JobListingSerializer, JobListingDetailSerializer,
    JobApplicationSerializer, TestimonialSerializer,
    FAQSerializer, FAQCategorySerializer,
    ContactMessageSerializer, NewsletterSerializer,
    SiteStatSerializer, HeroBannerSerializer, ClientLogoSerializer,
)


# ─── Site Settings ───────────────────────────────────────
@api_view(['GET'])
def site_settings(request):
    settings = SiteSettings.get()
    return Response(SiteSettingsSerializer(settings).data)


# ─── Hero Banners ─────────────────────────────────────────
class HeroBannerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HeroBanner.objects.filter(is_active=True)
    serializer_class = HeroBannerSerializer
    permission_classes = [AllowAny]

    @method_decorator(cache_page(60 * 15))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


# ─── Service Category ────────────────────────────────────
class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


# ─── Service ─────────────────────────────────────────────
class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.select_related('category')
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'is_featured']
    search_fields = ['title', 'short_desc', 'description']
    ordering_fields = ['order', 'created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ServiceDetailSerializer
        return ServiceSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)
        return Response(ServiceSerializer(qs, many=True).data)


# ─── Team ────────────────────────────────────────────────
class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TeamMember.objects.all()
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['department', 'is_featured']
    search_fields = ['name', 'role']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TeamMemberDetailSerializer
        return TeamMemberSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)
        return Response(TeamMemberSerializer(qs, many=True).data)


# ─── Projects ────────────────────────────────────────────
class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.select_related('category')
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'status', 'is_featured']
    search_fields = ['title', 'short_desc', 'client']
    ordering_fields = ['completed_date', 'order']

    @action(detail=False, methods=['get'])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)[:6]
        return Response(ProjectSerializer(qs, many=True).data)


# ─── Blog ────────────────────────────────────────────────
class BlogTagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogTag.objects.all()
    serializer_class = BlogTagSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.filter(status='published').select_related('author').prefetch_related('tags')
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tags__slug', 'author__slug', 'is_featured']
    search_fields = ['title', 'excerpt', 'body']
    ordering_fields = ['published_at', 'views']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostListSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save(update_fields=['views'])
        return Response(self.get_serializer(instance).data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)[:3]
        return Response(BlogPostListSerializer(qs, many=True).data)


# ─── Careers ─────────────────────────────────────────────
class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class JobListingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = JobListing.objects.filter(is_active=True).select_related('department')
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department__slug', 'job_type', 'level', 'is_featured']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['created_at', 'deadline']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return JobListingDetailSerializer
        return JobListingSerializer

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def apply(self, request, slug=None):
        job = self.get_object()
        serializer = JobApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(job=job)
            return Response(
                {'message': 'Application submitted successfully.', 'id': str(serializer.instance.id)},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── Testimonials ─────────────────────────────────────────
class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.select_related('service')
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_featured', 'service__slug']

    @method_decorator(cache_page(60 * 30))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


# ─── FAQ ─────────────────────────────────────────────────
class FAQCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQCategory.objects.prefetch_related('faqs')
    serializer_class = FAQCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(is_active=True).select_related('category')
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category__slug']
    search_fields = ['question', 'answer']


# ─── Contact ─────────────────────────────────────────────
class ContactMessageCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        ip = x_forwarded_for.split(',')[0] if x_forwarded_for else self.request.META.get('REMOTE_ADDR')
        serializer.save(ip_address=ip)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(
                {'message': 'Message sent successfully. We will get back to you soon!'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── Newsletter ──────────────────────────────────────────
class NewsletterSubscribeView(generics.CreateAPIView):
    serializer_class = NewsletterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        email = request.data.get('email', '')
        if NewsletterSubscriber.objects.filter(email=email).exists():
            sub = NewsletterSubscriber.objects.get(email=email)
            if not sub.is_active:
                sub.is_active = True
                sub.save()
            return Response({'message': 'You are already subscribed!'}, status=status.HTTP_200_OK)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Subscribed successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── Stats ───────────────────────────────────────────────
@api_view(['GET'])
def site_stats(request):
    stats = SiteStat.objects.all()
    return Response(SiteStatSerializer(stats, many=True).data)


# ─── Client Logos ─────────────────────────────────────────
@api_view(['GET'])
def client_logos(request):
    logos = ClientLogo.objects.filter(is_active=True)
    return Response(ClientLogoSerializer(logos, many=True).data)


# ─── Homepage aggregate ──────────────────────────────────
@api_view(['GET'])
def homepage_data(request):
    """Single endpoint to fetch all homepage data in one request."""
    hero = HeroBanner.objects.filter(is_active=True).first()
    services = Service.objects.filter(is_featured=True)[:6]
    projects = Project.objects.filter(is_featured=True)[:6]
    testimonials = Testimonial.objects.filter(is_featured=True)[:6]
    stats = SiteStat.objects.all()
    team = TeamMember.objects.filter(is_featured=True)[:4]
    blogs = BlogPost.objects.filter(status='published', is_featured=True)[:3]
    clients = ClientLogo.objects.filter(is_active=True)

    return Response({
        'hero': HeroBannerSerializer(hero).data if hero else None,
        'services': ServiceSerializer(services, many=True).data,
        'projects': ProjectSerializer(projects, many=True).data,
        'testimonials': TestimonialSerializer(testimonials, many=True).data,
        'stats': SiteStatSerializer(stats, many=True).data,
        'team': TeamMemberSerializer(team, many=True).data,
        'blog_posts': BlogPostListSerializer(blogs, many=True).data,
        'clients': ClientLogoSerializer(clients, many=True).data,
    })