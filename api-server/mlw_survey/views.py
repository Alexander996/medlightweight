import shutil

from django.db.models import Q
from rest_framework import viewsets

from mlw_survey.models import Survey, SurveyComment
from mlw_survey.serializers import SurveySerializer, SurveyCommentSerializer
from utils.pagination import PagePagination
from utils.storage import get_absolute_path_regarding_media


class SurveyViewSet(viewsets.ModelViewSet):
    serializer_class = SurveySerializer
    pagination_class = PagePagination

    def get_queryset(self):
        search_text = self.request.GET.get('searchText')
        patient_id = self.request.GET.get('patientId')

        q = Q(owner=self.request.user) | Q(users=self.request.user)

        if search_text is not None:
            q &= Q(name__icontains=search_text) | Q(description__icontains=search_text)

        if patient_id is not None:
            q &= Q(patient_id=patient_id)

        return Survey.objects.filter(q)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_destroy(self, instance):
        survey_directory_absolute_path = get_absolute_path_regarding_media(instance.directory)

        try:
            shutil.rmtree(survey_directory_absolute_path)
        except FileNotFoundError:
            pass

        instance.delete()


class SurveyCommentViewSet(viewsets.ModelViewSet):
    serializer_class = SurveyCommentSerializer

    def get_queryset(self):
        survey_id = self.request.GET.get('surveyId')
        return SurveyComment.objects.filter(survey_id=survey_id)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
