document.addEventListener('DOMContentLoaded', function() {
    function toggleCorrectAnswer() {
        // Check the value of the question type dropdown
        var questionType = document.querySelector('#id_question_type').value;
        // Find the correct answer checkbox wrapper
        var correctAnswerWrapper = document.querySelector('.field-correct_answer');

        // If the question type is 'TF' (true/false), show the toggle, else hide it
        if (questionType === 'TF') {
            correctAnswerWrapper.style.display = 'block';
        } else {
            correctAnswerWrapper.style.display = 'none';
        }
    }

    // Attach the toggle function to the question type dropdown change event
    var questionTypeSelect = document.querySelector('#id_question_type');
    if (questionTypeSelect) {
        questionTypeSelect.addEventListener('change', toggleCorrectAnswer);
    }

    // Call the function on initial load
    toggleCorrectAnswer();
});
