
document.addEventListener("DOMContentLoaded", function() {
  // Function to toggle the question_type field
  function toggleQuestionType(testType) {
    // Get all question type fields in the inline forms
    const questionTypes = document.querySelectorAll('.field-question_type');
    questionTypes.forEach(function(field) {
      if (testType === 'MX') {
        field.style.display = '';  // Show the field for mixed type tests
      } else {
        field.style.display = 'none';  // Hide the field otherwise
        const select = field.querySelector('select');
        if (select) {
          select.value = testType;  // Set the value to the test type
        }
      }
    });
  }

  // Get the test type select box
  const testTypeSelectBox = document.querySelector('#id_test_type');
  if (testTypeSelectBox) {
    // Set the initial state of the question_type fields
    toggleQuestionType(testTypeSelectBox.value);

    // Listen for changes on the test type select box
    testTypeSelectBox.addEventListener('change', function(event) {
      toggleQuestionType(event.target.value);
    });
  }
});
