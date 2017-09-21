(function (factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(window.jQuery);
  }
}(function ($) {
  // Extends lang for print plugin.
  $.extend(true, $.summernote.lang, {
    'en-US': {
      markdown: {
        markdown: 'Editer Markdown'
      }
    }
  });

  // Extends plugins for print plugin.
  $.extend($.summernote.plugins, {
    /**
     * @param {Object} context - context object has status of editor.
     */
    'markdown': function (context) {
      var self = this;

      // ui has renders to build ui elements.
      //  - you can create a button with `ui.button`
      var ui = $.summernote.ui;
      var $editor = context.layoutInfo.editor;
      var options = context.options;
      var lang = options.langInfo;

      // markdown
      var md = window.markdownit();
      var $preview = $('.previewMarkdown');
      var showMarkdown = true;

      $('.summernote').on('summernote.init', function() {
        setTimeout(function(){ showToHtml(); }, 500);
      });

      $('.summernote').on('summernote.change', function(we, contents, $editable) {
        $preview.html(md.render($editor[0].innerText));
      });

      var showToHtml = function(){
        showMarkdown = true;
        $preview.html(md.render($editor[0].innerText));
        $preview.show();
      }

      var showToMarkdown = function(){
        showMarkdown = false;
        $preview.hide();
        $('.note-editing-area').show();
      }

      // add print button
      context.memo('button.markdown', function () {
        // create button
        var button = ui.button({
          contents: '<i class="fa fa-pencil-square-o"/> Editer',
          tooltip: lang.markdown.markdown,
          click: function () {
            if(showMarkdown === true){
              showToMarkdown();
            } else {
              showToHtml();
            }
          }
        });
        // create jQuery object from button instance.
        var $print = button.render();
        return $print;
      });
    }
  });
}));
