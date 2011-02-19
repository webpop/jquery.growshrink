/*!
 * jQuery GrowFrom / ShrinkTo Plugin 0.1
 *
 * Copyright 2011, Webpop
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * See a copy of the MIT license in the LICENSE file
 */

(function($) {

    // Shared defaults for growFrom and shrinkTo
    var defaults = {
        duration: 300,
        opacity: true,
        easing: "swing",
        complete: $.noop
    };

    // Extends the jQuery.browser object to return browser prefixes for
    // CSS experimental selectors.
    $.browser.cssPrefix = function(){
        // OK, ok, I know jQuery.browser is deprecated... but, don't know
        // what alternative will jQuery offer for this:
        if (this.webkit)  return "-webkit-";
        if (this.mozilla) return "-moz-";
        if (this.opera)   return "-o-";
        return "";
    };

    // $.customSel returns a custom (experimental) selector based on the
    // current browser.
    //
    //  Example:  $.customSel("transform") --> "-moz-transform" in Mozilla
    //
    $.customSel = function(selector){
        return $.browser.cssPrefix() + selector;
    };

    // $.transformValues returns the correct values for a transform function
    // to scale and translate a source object into a destination object.
    //
    // Scale here is really a "nav" point from full size into dest (1.0) or
    // the original orig transform (0.0). ie: 0.0 means no transformation.
    //
    $.transformValues = function(src, dest, scale){
        var origBox = src.jquery ? $(src).dimensions() : src;
        var destBox = dest.jquery ? $(dest).dimensions() : dest;
        scale = typeof scale == 'undefined' ? 1.0 : scale;
        if (scale === 0) return "none";

        var hRatio = origBox.width > 0 ? (destBox.width / origBox.width) : 0;
        var vRatio = origBox.height > 0 ? (destBox.height / origBox.height) : 0;

        // Scale transform function
        return "translate(" + (((destBox.left + destBox.width/2) - (origBox.left + origBox.width/2)) * scale) + "px, " +
                              (((destBox.top + destBox.height/2) - (origBox.top + origBox.height/2)) * scale) + "px) " +
               "scale(" + (((1 - hRatio) * (1 - scale)) + hRatio) + "," + (((1 - vRatio) * (1 - scale)) + vRatio) + ")";
    };

    // $.fn.dimensions calculates the correct bounding box for an element or
    // group of elements and all its children. With $(elem).width() and
    // .height(), we get only the current dimensions of the container, but
    // not for the childs.
    //
    // Example: Imagine a DIV 200px wide with an H1 that actually spans 300px
    // With $(div).width() you get 200, while $(div).dimensions returns 300.
    //
    // Returns:
    // This function actually returns an object with the following properties:
    //
    //  top, left, width, height: The usual suspects...
    //  weight: A function returning width * height. Useful to know if a
    //          region actually has any dimensions.
    //   union: Calculates the union of two rectangles.
    //   toCss: Returns dimensions suitable for jQuery.css() function
    //    grow: Returns a rectangle grown by "padding" pixels.
    //
    // Options:
    // Pass topOnly == true to avoid recursion and get dimensions only for
    // the top element and not its children.
    //
    // Example:  $("#example").dimensions({topOnly: true});
    // 
    $.fn.dimensions = function(options) {
        if ((this.length == 0) || !this.is(":visible")) return null;

        var off = this.offset();
        var current = {
            top: off.top - $(window).scrollTop(),
            left: off.left - $(window).scrollLeft(),
            width: this.width(),
            height: this.height(),
            weight: function() {
                return this.width * this.height;
            },
            union: function(rect) {
                // Ignore floats with 0 height
                if (rect && rect.weight() > 0) {
                    this.left   = Math.min(this.left, rect.left);
                    this.width  = Math.max(this.left + this.width, rect.left + rect.width) - this.left;
                    this.top    = Math.min(this.top, rect.top);
                    this.height = Math.max(this.top + this.height, rect.top + rect.height) - this.top;
                }
                return this;
            },
            toCss: function() {
                return {
                    top: this.top,
                    left: this.left,
                    width: this.width,
                    height: this.height
                };
            },
            grow: function(padding) {
                var pad = padding || 0;
                return {
                    top: this.top - pad,
                    left: this.left - pad,
                    width: this.width + (pad * 2),
                    height: this.height + (pad * 2)
                };
            }
        };
        if (this.length == 1) {
            return options && options.topOnly
                    ? current
                    : current.union($(this).children().dimensions());
        }
        this.each(function(){
            current && current.weight() > 0 ? current.union($(this).dimensions()) : current = $(this).dimensions();
            if (options && !options.topOnly) current.union($(this).children().dimensions());
        });
        return current;
    };

    // Private function that handles both animations.
    function _just_doit(dest, options, grow)
    {
        return this.each(function(){
            var _sel = $.customSel("transform");
            var $self = $(this).show().css(_sel, "none");
            var _origBox = $self.dimensions();
            var _destBox = $(dest).dimensions();
            var _opts = $.extend(defaults, options);
            if (!_origBox || !_destBox) return;

            this.prop = grow ? 1 : 0;
            $self.animate({prop: grow ? 0 : 1}, $.extend(_opts, {
    		    step : function(scale){
                    $self.css(_sel, $.transformValues(_origBox, _destBox, scale));
                    if (_opts.opacity) $self.css({opacity: 1 - scale});
    			},
    		    complete: function() {
    		        $self.css({
    		            _sel: "none",
    		            display: grow ? "block" : ""
    		        });
    		        (options && options.complete || $.noop).call(this);
    		    }
    		}));
        });
    };

    // $.fn.growFrom
    //
    // Grows an element from a source element size and position to the current
    // element size and position using CSS transforms.
    //
    // Params: (Passed as options to growFrom)
    // duration: Duration of the animation (in ms) [Default: 300]
    //  opacity: Also animate the opacity of the grown element [Default: true]
    //   easing: Easing function to apply [Default "swing"]
    // complete: Callback for animation completion
    //
    // * Every other option is passed as is to the .animate jQuery function.
    //
    $.fn.growFrom = function(src, options) {
        return _just_doit.call(this, src, options, true);
    };

    // $.fn.shrinkTo
    //
    // Shrinks an element to a source element size and position from the
    // current element size and position using CSS transforms.
    //
    // Params: (Passed as options to shrinkTo)
    // duration: Duration of the animation (in ms) [Default: 300]
    //  opacity: Also animate the opacity of the shrink element [Default: true]
    //   easing: Easing function to apply [Default "swing"]
    // complete: Callback for animation completion
    //
    // * Every other option is passed as is to the .animate jQuery function.
    //
    $.fn.shrinkTo = function(dest, options) {
        return _just_doit.call(this, dest, options, false);
    };

})(jQuery);
