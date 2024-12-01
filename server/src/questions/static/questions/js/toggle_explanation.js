
document.addEventListener('DOMContentLoaded', function() {

    function toggleExplanationVisibility(toggle) {
        const explanationField = toggle.closest('.inline-related').querySelector('.field-explanation_text');
        if (!toggle.checked) {
            explanationField.style.display = 'none';
        } else {
            explanationField.style.display = '';
        }
    }

    function bindToggleEvent(toggle) {
        toggle.addEventListener('change', () => toggleExplanationVisibility(toggle));
    }

    function processToggleFields() {
        const toggleFields = document.querySelectorAll('.field-explanation_enabled input[type="checkbox"]');
        toggleFields.forEach(toggle => {
            // Check if event is already bound to prevent duplicate bindings
            if (!toggle.dataset.bound) {
                bindToggleEvent(toggle);
                toggleExplanationVisibility(toggle);
                toggle.dataset.bound = true;  // Mark it as bound
            }
        });
    }

    processToggleFields();  // Initial processing

    // Using MutationObserver to observe addition of new DOM elements
    const observer = new MutationObserver(function(mutationsList) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                processToggleFields();  // Process again for newly added rows
            }
        }
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
});
