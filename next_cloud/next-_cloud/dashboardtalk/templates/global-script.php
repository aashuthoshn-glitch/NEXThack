<?php
/**
 * Global Smart Talk Widget Template
 * This template loads the Smart Talk widget on all pages
 */
?>

<script>
// Global Smart Talk Widget Loader
(function() {
    'use strict';
    
    // Prevent multiple loads
    if (window.smartTalkGlobalLoaded) {
        return;
    }
    window.smartTalkGlobalLoaded = true;
    
    // Load the global widget script
    const script = document.createElement('script');
    script.src = '<?php echo \OC::$WEBROOT; ?>/custom_apps/dashboardtalk/js/global-smart-talk.js';
    script.async = true;
    script.onload = function() {
        console.log('Smart Talk Global Widget loaded successfully');
    };
    script.onerror = function() {
        console.error('Failed to load Smart Talk Global Widget');
    };
    
    document.head.appendChild(script);
})();
</script>


