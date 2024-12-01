document.addEventListener('DOMContentLoaded', function() {
    function toggleInlines() {
        var questionType = document.querySelector('#id_question_type').value;
        console.log('Question Type:', questionType);

        var mcqInline = document.querySelector('.mcq-inline');
        var tfInline = document.querySelector('.tf-inline');

        console.log('MCQ Inline:', mcqInline);
        console.log('TF Inline:', tfInline);

        // Assuming '.inline-group' is a class that's present in both sections
        document.querySelectorAll('.inline-group').forEach(function(group) {
            group.style.display = 'none';
        });

        if (questionType === 'MCQ' && mcqInline) {
            mcqInline.style.display = 'block';
            console.log('Showing MCQ');
        } else if (questionType === 'TF' && tfInline) {
            tfInline.style.display = 'block';
            console.log('Showing TF');
        } else {
            console.log('No match for Question Type');
        }
    }

    var questionTypeSelect = document.querySelector('#id_question_type');
    if (questionTypeSelect) {
        questionTypeSelect.addEventListener('change', toggleInlines);
        toggleInlines(); // Call the function to set the correct display on load
    } else {
        console.log('Question Type Select not found');
    }
});
