// ==UserScript==
// @name         juejin掘金小帮手
// @name:zh-CN   掘金小帮手：掘金纯净复制、掘金纯净小册阅读
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @updateURL    https://raw.githubusercontent.com/zzall/temperMonkey/master/juejin_helper/index.js
// @description  掘金纯净复制、掘金纯净小册阅读
// @author       zzailianlian
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @match        *://juejin.cn/*
// @match        *://juejin.im/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meitun-test.com
// @license      MIT
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// ==/UserScript==

(function () {
  'use strict';

  // 复制去除后缀
  [...document.querySelectorAll('*')].forEach(
    item =>
      (item.oncopy = function (e) {
        e.stopPropagation();
      })
  );

  // 沉浸式小册阅读
  const openJuejinPamphlethelper = () => {
    if (/juejin\.[cnim]{2}.+\/section/.test(window.location.href)) {
      // 处理沉浸式时要处理的dom列表
      const displayDoms = [
        {
          observer: () => document.querySelector('.book-summary'),
          action: () => {
            document.querySelector('.book-summary').style.display = 'none';
          },
          unset: () => {
            document.querySelector('.book-summary').style = '';
          },
        },
        {
          observer: () => document.querySelector('.book-content__header'),
          action: () => {
            document.querySelector('.book-content__header').style.display = 'none';
          },
          unset: () => {
            document.querySelector('.book-content__header').style = '';
          },
        },
        {
          observer: () => document.querySelector('.book-comments'),
          action: () => {
            document.querySelector('.book-comments').style.display = 'none';
          },
          unset: () => {
            document.querySelector('.book-comments').style = '';
          },
        },
        {
          observer: () => document.querySelector('.book-body'),
          action: () => {
            document.querySelector('.book-body').style.paddingTop = '0';
          },
          unset: () => {
            document.querySelector('.book-body').style = '';
          },
        },
        {
          observer: () => document.querySelector('.book-content'),
          action: () => {
            document.querySelector('.book-content').style.marginLeft = '0';
          },
          unset: () => {
            document.querySelector('.book-content').style = '';
          },
        },
        {
          observer: () => document.querySelector('.book-section-view'),
          action: () => {
            document.querySelector('.book-section-view').style.maxWidth = 'unset';
          },
          unset: () => {
            document.querySelector('.book-section-view').style = '';
          },
        },
        {
          observer: () => document.querySelector('.book-handle'),
          action: () => {
            document.querySelector('.book-handle').style.maxWidth = 'unset';
            document.querySelector('.book-handle').style.marginLeft = '0';
          },
          unset: () => {
            document.querySelector('.book-handle').style = '';
          },
        },
      ];

      // 沉浸式控制按钮
      loopDom({
        observer: () => document.querySelector('.book-handle'),
        action: () => {
          document.querySelector('.book-handle').style.maxWidth = 'unset';
          document.querySelector('.book-handle').style.marginLeft = '0';

          const bookHandle = document.querySelector('.book-handle');
          let isTrigger = false;
          const immersionBtn = document.createElement('div');
          immersionBtn.innerHTML = '恢复';
          immersionBtn.style = `background-color:#007fff;border-radius:50%;width:50px;height:50px;display:flex;justify-content:center;align-items:center;z-index:10;cursor:pointer;color:white;position:absolute;left:10px;font-size:14px;bottom:70px;`;
          immersionBtn.onclick = function () {
            console.log('isTrigger', isTrigger);
            if (isTrigger) {
              // 沉浸阅读界面
              displayDoms.map(dom => {
                loopDom(dom, 'active');
              });
              immersionBtn.innerHTML = '恢复';
            } else {
              // 默认展示界面
              displayDoms.map(dom => {
                loopDom(dom, 'disabled');
              });
              immersionBtn.innerHTML = '沉浸';
            }
            isTrigger = !isTrigger;
          };
          immersionBtn.classList.add('step-btn', 'step-btn--prev');
          bookHandle.insertBefore(immersionBtn, bookHandle.firstChild);
        },
      });

      displayDoms.map(dom => {
        loopDom(dom, 'active');
      });
    }
  };

  window.onload = () => {
    var _wr = function (type) {
      var orig = history[type];
      return function () {
        var rv = orig.apply(this, arguments);
        var e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
      };
    };

    window.addEventListener('replaceState', function (e) {
      console.log('监听自定义replaceState', e);
      openJuejinPamphlethelper();
    });
    window.addEventListener('pushState', function (e) {
      console.log('监听自定义pushState', e);
      openJuejinPamphlethelper();
    });

    history.pushState = _wr('pushState');
    history.replaceState = _wr('replaceState');

    openJuejinPamphlethelper();
  };

  function loopDom({ observer, action = () => {}, unset = () => {} }, type = 'active') {
    console.log('observer', observer());
    const hadnler = () => {
      if (type === 'active') {
        action();
      } else {
        unset();
      }
      // 干掉document的title，让阅读不被others打扰
      document.title = 'LinStaMIDIAccess';
    };
    if (observer()) {
      hadnler();
    }
    const interval = setInterval(() => {
      console.log('observer2', observer());
      if (observer()) {
        hadnler();
        clearInterval(interval);
      }
    }, 200);
  }
})();
