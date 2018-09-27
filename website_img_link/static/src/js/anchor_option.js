var $currImage = false;
"use strict";
odoo.define("website_img_link.anchor_option", function (require) {
    var core = require("web.core"),
        options = require("web_editor.snippets.options"),
        website = require("website.website"),
        sprintf = _.str.sprintf,
        _t = core._t;

    // Option to have anchors in snippets
    options.registry.anchor = options.Class.extend({
        // Let user choose anchor name
        anchor_ask: function (type, window_title) {
            // Only react on clicks, not on resets or other events
            if (type != "click") {
                return $.Deferred().reject();
            }
            // Ask the anchor to the user
            return website.prompt({
                "window_title": window_title || _t("Choose anchor"),
                "input": _t("Anchor (Use http:// for external Urls)"),
                "default": this.$target.attr("id"),
            }).done($.proxy(this.anchor_update, this));
        },

        /**
         * Return an array of anchors except the one found in `except`.
         */
        current_anchors: function (except) {
            var anchors = Array();
            $("[id]").not(except).each(function () {
                anchors.push($(this).attr("id"));
            });
            return anchors;
        },

        /**
         * Indicates if this is a valid anchor
         */
        anchor_valid: function (anchor) {
             return true; ///^[\w-]+$/.test(anchor) &&
                // !$(sprintf("#%s", anchor)).not(this.$target).length;
        },

        /**
         * Update an anchor and all its dependencies.
         */
        anchor_update: function (new_anchor, $input, $dialog) {
            // Remove current anchor if any falsey value came in
            if (!new_anchor) {
                this.$target.removeAttr("id");
                return;
            }
            var old_anchor = this.$target.attr("id");
            if (old_anchor) {
                if  ($(sprintf('[href="#%s"]', old_anchor)).length > 0){
                    $(sprintf('[href="#%s"]', old_anchor))
                    .attr("href", sprintf("#%s", new_anchor));                    
                }
                else{
                    if ($currImage.parent().is("a")){
                        $currImage.unwrap();                        
                    }
                    $currImage.wrapAll('<a href="'+new_anchor+'"/>');
                }
            }
            this.$target.attr("id", new_anchor);
        },
    });
});


$(document).on('click', 'img', function(){
    $currImage = $(this);
    return;
})

