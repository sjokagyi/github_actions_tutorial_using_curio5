document.addEventListener("DOMContentLoaded", function() {
  function toggleFillInTheBlanksField() {
    // Get the current value of the test type
    const testTypeSelect = document.querySelector('#id_test_type');
    const testType = testTypeSelect.value;

    // Find all question blocks
    const questionBlocks = document.querySelectorAll('.dynamic-question_set-group');

    questionBlocks.forEach(function(questionBlock) {
      const questionTypeSelect = questionBlock.querySelector('.field-question_type select');
      const fillInTheBlanksDataField = questionBlock.querySelector('.field-fill_in_the_blanks_data');
      
      if (testType === 'FB' || (testType === 'MX' && questionTypeSelect && questionTypeSelect.value === 'FB')) {
        fillInTheBlanksDataField.style.display = ''; // Show the field
      } else {
        fillInTheBlanksDataField.style.display = 'none'; // Hide the field
      }

      // If the test type is mixed, we need to monitor changes on the question type as well
      if (testType === 'MX') {
        questionTypeSelect.addEventListener('change', function() {
          if (this.value === 'FB') {
            fillInTheBlanksDataField.style.display = '';
          } else {
            fillInTheBlanksDataField.style.display = 'none';
          }
        });
      }
    });
  }

  // Initial call
  toggleFillInTheBlanksField();

  // Monitor changes on the test type
  document.querySelector('#id_test_type').addEventListener('change', toggleFillInTheBlanksField);
});
