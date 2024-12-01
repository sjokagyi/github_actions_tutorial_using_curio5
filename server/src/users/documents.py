'''from django_elasticsearch_dsl import Document, Index, fields
from django_elasticsearch_dsl.registries import registry
from .models import User

user_index = Index('users')

@registry.register_document
class UserDocument(Document):
    school = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'name': fields.TextField(),
        'address': fields.TextField(),
        'school_type': fields.TextField()
    })
    college = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'name': fields.TextField(),
    }, required=False)
    faculty = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'name': fields.TextField(),
    }, required=False)
    programme = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'name': fields.TextField(),
    }, required=False)
    courses = fields.NestedField(properties={
        'id': fields.IntegerField(),
        'name': fields.TextField(),
        'code': fields.TextField(),
    }, required=False)

    class Index:
        name = 'users'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'middle_name',
            'last_name',
            'user_type',
            'primary_contact',
            'secondary_contact',
            'residence'
        ]
'''