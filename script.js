;(function(global) {
    "use strict";
    var menuClass = 'menu',
        activeMenuItemClass = 'active',
        pageClass = 'page';

    function getCurrentPage(pagesClass) {
        var pages = global.document.getElementsByClassName(pagesClass);
        if(!pages.length) {
            return '';
        }
        for (var i = pages.length - 1; i >= 0 ; i--) {
            if (pages[i].offsetTop <= global.document.body.scrollTop) {
                return pages[i].id;
            }
        }
        return pages[0].id;
    }

    function renderMenu(menuClass, activeMenuItemClass, activePageName) {
        var i,
            item,
            menuItems = global.document.getElementsByClassName(menuClass)[0].children;
        for (i = 0; i < menuItems.length; i++) {
            item = menuItems[i];
            if (activePageName === item.hash.substr(1)) {
                item.classList.add(activeMenuItemClass);
            } else {
                item.classList.remove(activeMenuItemClass);
            }
        }
    }

    function setActiveMenuElement() {
        renderMenu(menuClass, activeMenuItemClass, getCurrentPage(pageClass));
    }

    setActiveMenuElement();
    global.document.addEventListener('scroll', setActiveMenuElement);
})(window);
