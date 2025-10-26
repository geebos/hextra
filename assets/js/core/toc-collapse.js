/**
 * TOC Collapse - Handles collapsible table of contents functionality
 * 
 * Features:
 * - Default collapse all sections
 * - Auto-expand current section based on scroll position
 * - Manual toggle functionality
 * - Smooth animations
 */
document.addEventListener("DOMContentLoaded", function () {
  const toc = document.querySelector(".hextra-toc");
  if (!toc) return;

  const tocItems = toc.querySelectorAll('.hextra-toc-item[data-level="0"]');
  const tocToggles = toc.querySelectorAll('.hextra-toc-toggle');
  
  if (tocItems.length === 0) return;

  let currentActiveSection = null;
  let isManualToggle = false;

  // 初始化：默认折叠所有目录
  function initializeCollapsedState() {
    tocItems.forEach(item => {
      const children = item.querySelector('.hextra-toc-children');
      if (children) {
        item.classList.remove('expanded');
        children.style.maxHeight = '0';
        children.style.opacity = '0';
      }
    });
  }

  // 展开指定的目录项
  function expandSection(item) {
    if (!item) return;
    
    const children = item.querySelector('.hextra-toc-children');
    if (children) {
      item.classList.add('expanded');
      // 计算实际高度
      children.style.maxHeight = 'none';
      const height = children.scrollHeight;
      children.style.maxHeight = '0';
      
      // 强制重绘后设置目标高度
      requestAnimationFrame(() => {
        children.style.maxHeight = height + 'px';
        children.style.opacity = '1';
      });
      
      // 动画完成后移除固定高度
      setTimeout(() => {
        if (item.classList.contains('expanded')) {
          children.style.maxHeight = 'none';
        }
      }, 300);
    }
  }

  // 折叠指定的目录项
  function collapseSection(item) {
    if (!item) return;
    
    const children = item.querySelector('.hextra-toc-children');
    if (children) {
      const height = children.scrollHeight;
      children.style.maxHeight = height + 'px';
      
      requestAnimationFrame(() => {
        item.classList.remove('expanded');
        children.style.maxHeight = '0';
        children.style.opacity = '0';
      });
    }
  }

  // 切换目录项展开/折叠状态
  function toggleSection(item) {
    if (item.classList.contains('expanded')) {
      collapseSection(item);
    } else {
      expandSection(item);
    }
  }

  // 根据当前激活的标题自动展开对应的一级目录
  function autoExpandCurrentSection() {
    if (isManualToggle) return;

    const activeLink = toc.querySelector('a.hextra-toc-active');
    if (!activeLink) return;

    // 找到激活链接所属的一级目录项
    const activeItem = activeLink.closest('.hextra-toc-item[data-level="0"]');
    if (!activeItem || activeItem === currentActiveSection) return;

    // 折叠之前的活动部分
    if (currentActiveSection && currentActiveSection !== activeItem) {
      currentActiveSection.classList.remove('current-section');
      collapseSection(currentActiveSection);
    }

    // 展开新的活动部分
    if (activeItem) {
      activeItem.classList.add('current-section');
      expandSection(activeItem);
      currentActiveSection = activeItem;
    }
  }

  // 添加手动切换事件监听器
  tocToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const item = toggle.closest('.hextra-toc-item[data-level="0"]');
      if (item) {
        isManualToggle = true;
        toggleSection(item);
        
        // 如果手动展开了一个部分，将其标记为当前部分
        if (item.classList.contains('expanded')) {
          if (currentActiveSection && currentActiveSection !== item) {
            currentActiveSection.classList.remove('current-section');
          }
          item.classList.add('current-section');
          currentActiveSection = item;
        } else {
          item.classList.remove('current-section');
          if (currentActiveSection === item) {
            currentActiveSection = null;
          }
        }
        
        // 短暂禁用自动展开，避免冲突
        setTimeout(() => {
          isManualToggle = false;
        }, 500);
      }
    });
  });

  // 监听目录激活状态变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const target = mutation.target;
        if (target.tagName === 'A' && target.classList.contains('hextra-toc-active')) {
          // 延迟执行以确保DOM更新完成
          setTimeout(autoExpandCurrentSection, 50);
        }
      }
    });
  });

  // 观察所有目录链接的class变化
  const tocLinks = toc.querySelectorAll('a[href^="#"]');
  tocLinks.forEach(link => {
    observer.observe(link, { attributes: true, attributeFilter: ['class'] });
  });

  // 初始化状态
  initializeCollapsedState();
  
  // 初始检查当前激活状态
  setTimeout(() => {
    autoExpandCurrentSection();
  }, 100);

  // 监听哈希变化
  window.addEventListener('hashchange', () => {
    setTimeout(autoExpandCurrentSection, 100);
  });
});
