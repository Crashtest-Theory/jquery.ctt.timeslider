 /**
 * A jQuery plugin that creates an image slide show with a timeline bar.
 *
 * Copyright (c) 2012, Crashtest Theory
 *
 * Licensed under the Revised BSD Licence:
 * - http://www.opensource.org/licenses/BSD-3-Clause
 */
(function($) {
    var TimeSlider = function($element, options) {
        var settings = $.extend({
            delay: 8000,    // Delay in ms before transitioning the image.
            speed: 50       // Timer interval in ms to move the progress bar.
        }, options);
        
        var obj = this;
        
        /// Setup.
        var $active = $element.children('.active').eq(0);
        var $bar = $element.children('.bar').eq(0);
        var $controls = $element.find('.controls').eq(0);
        var $display = $element.children('.display').eq(0);
        var items = $element.children('.item');
        var itemHeight = items.eq(0).outerHeight();
        
        $bar.css('width', 0);
        $element.css('height', $display.outerHeight() + $bar.outerHeight() + itemHeight);
        $element.css('width', $display.outerWidth());
        
        var itemBorderColor = '#ccc';
        var itemBorderType = 'solid';
        var itemBorderWidth = 1;
        
        var currentDisplayIndex = -1;
        var currentTime = 0;
        var itemWidth = Math.floor($element.outerWidth() / items.length);
        var modePause = false;
        
        var barSpeed = itemWidth / settings.delay; // Pixels/interval to increment the progress bar.
        
        $active.css('height', itemHeight);
        $active.css('width', itemWidth);
        ///
        
        /// Public methods.
        this.pause = function() {
            modePause = true;
            $controls.click(onResumeClickEvent);
            
            return $element;
        }
        
        this.resume = function() {
            modePause = false;
            $controls.click(onPauseClickEvent);
            
            return $element;
        }
        
        this.view = function(index) {
            currentTime = settings.delay * index;
            
            if (modePause) transition();
        }
        ///
        
        /// Private methods.
        var transition = function() {
            $bar.css('width', currentTime * barSpeed);
            
            // Transition of image is base on time.
            var index = Math.floor(currentTime / settings.delay);
            
            if (index >= items.length) index = 0;
            
            if (index != currentDisplayIndex) {
                // Clear queue, jump to end.
                $active.stop(true, true);
                $active.animate({'margin-left': itemWidth * index});
                
                $nextItem = items.eq(index);
                
                $img = $nextItem.children('img').eq(0).clone();
                $anchor = $nextItem.find('a').eq(0).clone();
                $anchor.html($img.wrap('<span></span>').parent().html());
                
                $display.html($anchor);
                
                items.eq(currentDisplayIndex).removeClass('current');
                $nextItem.addClass('current');
                
                currentDisplayIndex = index;
            }
        };
        
        var onItemClickEvent = function(e) {
            obj.view($(e.currentTarget).attr('rel'))
            
            e.preventDefault();
        };
        
        var onIntervalEvent = function() {
            if (modePause) return;
            
            currentTime += settings.speed;
            
            if (currentTime > (settings.delay * items.length)) currentTime = 0;
            
            transition();
        };
        
        var onPauseClickEvent = function(e) {
            obj.pause();
            
            e.preventDefault();
        };
        
        var onResumeClickEvent = function(e) {
            obj.resume();
            
            e.preventDefault();
        };
        ///
        
        /// Init.
        var itemBorderString = itemBorderWidth + 'px ' + itemBorderType + ' ' + itemBorderColor;
        
        $.each(items, function(index, value) {
            var $this = $(this);
            $this.attr('rel', index);
            $this.click(onItemClickEvent);
            
            if (index == 0) {
                $this.css('width', itemWidth - (itemBorderWidth * 2));
                $this.css('border-left', itemBorderString);
            } else {
                $this.css('width', itemWidth - itemBorderWidth);
            }
            
            $this.css('border-right', itemBorderString);
            $this.css('border-bottom', itemBorderString);
        });
        
        $controls.click(onPauseClickEvent);
        
        var interval = setInterval(onIntervalEvent, settings.speed);
        ///
    };
    
    $.fn.cttTimeSlider = function(options) {
        return this.each(function() {
            var $element = $(this);
            
            $element.cttTimeSlider.instance = function() {
                return $element.data('cttTimeSlider');
            }
            
            if ($element.data('cttTimeSlider')) return;
            
            var cttTimeSlider = new TimeSlider($element, options);
            $element.data('cttTimeSlider', cttTimeSlider);
        });
    };
})(jQuery);
