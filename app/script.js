;(function(global) {
    "use strict";
    // polyfills
    if (typeof document.getElementsByClassName != 'function') {
        HTMLDocument.prototype.getElementsByClassName = function (className) {
            if (!className) {
                return [];
            }
            var elements = this.getElementsByTagName('*');
            var list = [];
            var expr = new RegExp('(^|\\b)' + className + '(\\b|$)');
            for (var i = 0; i < elements.length; i++)
                if (expr.test(elements[i].className)) {
                    list.push(elements[i]);
                }
            return list;
        };
    }

    function addClass(element, className) {
        var i, classList;
        if (element.classList) {
            element.classList.add(className);
        } else {
            classList = element.className ? element.className.split(' ') : [];
            for (i = 0; i < classList.length; i++) {
                if (classList[i] === className) {
                    return;
                }
            }
            classList.push(className);
            element.className = classList.join(' ');
        }
    }

    function removeClass(element, className) {
        var i,
            classList;
        if (element.classList) {
            element.classList.remove(className);
        } else {
            classList = element.className.split(' ');
            for (i = 0; i < classList.length; i++) {
                if (classList[i] === className) {
                    delete classList[i];
                }
            }
            element.className = classList.join(' ');
        }
    }

    function addEventListener(element, event, callback) {
        if (element.addEventListener) {
            element.addEventListener(event, callback);
        } else {
            element.attachEvent('on' + event, callback);
        }
    }

    // main script
    var menuClass = 'navigation__menu',
        activeMenuItemClass = 'active',
        pageClass = 'page';

    function getCurrentPage(pagesClass) {
        var i,
            pages = global.document.getElementsByClassName(pagesClass),
            currentScroll = global.scrollY || global.document.documentElement.scrollTop || global.document.body.scrollTop;
        if(!pages.length) {
            return '';
        }
        for (i = pages.length - 1; i >= 0 ; i--) {
            if (pages[i].offsetTop <= currentScroll) {
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
                addClass(item, activeMenuItemClass);
            } else {
                removeClass(item, activeMenuItemClass);
            }
        }
    }

    function setActiveMenuElement() {
        renderMenu(menuClass, activeMenuItemClass, getCurrentPage(pageClass));
    }

    setActiveMenuElement();
    addEventListener(global, 'scroll', setActiveMenuElement);
})(window);
