// questions/js/admin_question_handler.js
document.addEventListener("DOMContentLoaded", function() {
    function toggleCorrectAnswersField(questionTypeSelect) {
    let correctAnswersField = document.querySelector('.field-correct_answers');
    if (correctAnswersField) { // Check if the element exists
        if (questionTypeSelect.value === 'FB') {
            correctAnswersField.style.display = 'block';
        } else {
            correctAnswersField.style.display = 'none';
        }
    } else {
        console.error('The correct answers field could not be found.');
    }
}


    let questionTypeSelect = document.querySelector('#id_question_type');
    if (questionTypeSelect) {
        // Set initial state
        toggleCorrectAnswersField(questionTypeSelect);

        // Add event listener
        questionTypeSelect.addEventListener('change', function() {
            toggleCorrectAnswersField(questionTypeSelect);
        });
    }
});
