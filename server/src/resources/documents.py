from django_elasticsearch_dsl import Document, Index, fields
from django_elasticsearch_dsl.registries import registry
from .models import Resource

resource_index = Index('resources')

@registry.register_document
class ResourceDocument(Document):
    title_suggest = fields.CompletionField()
    description_suggest = fields.CompletionField()

    class Index:
        # Name of the Elasticsearch index
        name = 'resources'
        # See Elasticsearch Indices API reference for available settings
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:
        model = Resource  # The model associated with this Document

        # The fields of the model you want to index in Elasticsearch
        fields = [
            'title',
            'description',
            'resource_type',
            'upload_date',
        ]

    def save(self, **kwargs):
        self.title_suggest = self.title
        self.description_suggest = self.description
        super().save(**kwargs)

        # Ignore auto updating of Elasticsearch when a model is saved
        # or deleted
        # ignore_signals = True

        # Don't perform an index refresh after every update (overrides global setting)
        # auto_refresh = False

        # Paginate the django queryset used to populate the index with the specified size
        # This is recommended for large datasets
        # queryset_pagination = 5000
