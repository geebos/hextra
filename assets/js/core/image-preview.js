// Image Preview Functionality
(function() {
  'use strict';

  let overlay = null;
  let previewImg = null;
  let isInitialized = false;

  // Create overlay element
  function createOverlay() {
    const overlayEl = document.createElement('div');
    overlayEl.className = 'image-preview-overlay';
    overlayEl.innerHTML = '<img class="image-preview-content" alt="Preview">';
    document.body.appendChild(overlayEl);
    return overlayEl;
  }

  function closePreview() {
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Handle image click using event delegation
  function handleImageClick(e) {
    const target = e.target;
    
    // Check if the clicked element is an image in content area
    if (target.tagName === 'IMG' && target.closest('main, .content, article')) {
      e.preventDefault();
      e.stopPropagation();
      
      // Set the preview image source
      previewImg.src = target.src;
      previewImg.alt = target.alt || 'Preview';
      
      // Show overlay
      overlay.classList.add('active');
      
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
    }
  }

  // Handle escape key
  function handleKeydown(e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
      closePreview();
    }
  }

  // Handle overlay click
  function handleOverlayClick(e) {
    if (e.target === overlay) {
      closePreview();
    }
  }

  // Handle preview image click
  function handlePreviewImageClick(e) {
    e.stopPropagation();
    closePreview();
  }

  // Initialize image preview
  function initImagePreview() {
    // Only initialize once
    if (isInitialized) {
      return;
    }
    
    // Create overlay if it doesn't exist
    overlay = document.querySelector('.image-preview-overlay');
    if (!overlay) {
      overlay = createOverlay();
    }

    previewImg = overlay.querySelector('.image-preview-content');

    // Use event delegation on document for all image clicks
    document.addEventListener('click', handleImageClick);

    // Close preview when clicking on overlay (but not on image)
    overlay.addEventListener('click', handleOverlayClick);

    // Close preview when clicking on the preview image
    previewImg.addEventListener('click', handlePreviewImageClick);

    // Close preview with Escape key
    document.addEventListener('keydown', handleKeydown);

    isInitialized = true;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImagePreview);
  } else {
    initImagePreview();
  }

})();
