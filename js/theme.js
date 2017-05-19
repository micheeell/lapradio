/**
 * @package Async Template
 *
 * Copyright (c) 2014 ThemeSmarter. All rights reserved.
 * http://www.themesmarter.com
 */

var core;
(function($) {
    "use strict";

    core = {
        init : function() {
            this.newsletter();
            this.contact();
            this._extensions();

            $(window).load(function(){
                core.fullscreenImage();
            });

            var homeblocks= $("#logo-home,#headlines,#countdown,#nav-home,#social-media");
            homeblocks.each(function(i){
                $(this).css({opacity:0,position:'relative',bottom:-30});
            });

            $('#home').css({opacity:0,display:'block',top:'0%'}).animate({ opacity: 1 }, 500, 'easeOutSine', function() {
                homeblocks.each(function(i){
                    $(this).stop().delay(i*250).animate({'opacity':1,'bottom':0},500,'easeOutSine');
                });
            });

            $('body').on('click','#nav-home a',function(e) {
                e.preventDefault();
                var section_id = $(this).data('section-id');
                $('#home').animate({opacity:0,top:'6%'}, 500, 'easeInOutQuad' );
                $('#'+section_id).css({display:'block',top:'100%'}).animate({top:'0%'}, 500, 'easeInOutQuad').addClass('open');
                if(section_id=='twitter'){
                    !function(d,s,id){
                        var js,fjs=d.getElementsByTagName(s)[0];
                        if(!d.getElementById(id)){
                            js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);
                        }
                    }(document,"script","twitter-wjs");
                }
            });

            $('body').on('click','.overlay-close',function(e) {
                e.preventDefault();
                $('.open').animate({top:'100%'}, 500, 'easeInOutQuad', function(){
                    $(this).hide().removeClass('open');
                });
                $('#home').animate({opacity:1,top:'0%'}, 500, 'easeInOutQuad');
            });

            $('.message').on('click','.message-close',function(e) {
                e.preventDefault();
                $(this).closest('.message').slideUp(500, function() {
                    $(this).empty()
                });
            });

            $(window).on( 'resize', function() {
                core.fullscreenImage();
            });
        },

        fullscreenImage : function(){
            var windowWidth	= $(window).width();
            var windowHeight = $(window).height();
            var windowRatio	= windowWidth/windowHeight;
            var image = $("#fullscreen-image > img");
            var imageRatio = image.width()/image.height();
            var $new_width, $new_height, $left, $top;

            if (windowRatio > imageRatio) {
                $new_width = windowWidth;
                $new_height = (windowWidth / imageRatio);
            } else {
                $new_width = (windowHeight * imageRatio);
                $new_height = windowHeight;
            }

            $left = (windowWidth-$new_width)/2;
            $top = (windowHeight-$new_height)/2;

            image.css({
                width: $new_width + 'px',
                height: $new_height + 'px',
                left: $left + 'px',
                top: $top + 'px'
            });
        },

        newsletter : function() {
            $('#subscribeform').submit(function(event) {
                event.preventDefault();
                var $form = $(this),
                    data = $form.serialize(),
                    fields = $form.find('.field-required'),
                    button = $form.find('.submit-button'),
                    message = $('#newsletter .message');
                button.addClass('ajax');
                $.post('php/subscribeform.php', data, function(response){
                    button.removeClass('ajax');
                    if (response.success) {
                        message.removeClass('error').addClass('success');
                        fields.each(function(){
                            $(this).val('');
                        });
                    } else {
                        message.removeClass('success').addClass('error');
                    }
                    message.html(response.message).append('<span class="message-close"/>').slideDown();
                }, 'json');
            });
        },

        contact : function() {
            $('#contactform').submit(function(event) {
                event.preventDefault();
                var $form = $(this),
                    data = $form.serialize(),
                    fields = $form.find('.field-required'),
                    button = $form.find('.submit-button'),
                    message = $('#contact .message');
                button.addClass('ajax');
                $.post('php/contactform.php', data, function(response){
                    button.removeClass('ajax');
                    if (response.success) {
                        message.removeClass('error').addClass('success');
                        fields.each(function(){
                            $(this).val('');
                        });
                    } else {
                        message.removeClass('success').addClass('error');
                    }
                    message.html(response.message).append('<span class="message-close"/>').slideDown();
                }, 'json');
            });
        },

        _extensions : function() {
            $.fn.extend({
                wordRotator: function(options){
                    var settings = $.extend({
                        pauseTime: 2500
                    }, options );
                    return this.each(function() {
                        var txtSlider = $(this),
                            height = txtSlider.height(),
                            slides = txtSlider.children(),
                            totalSlides = slides.length,
                            first = slides.first(),
                            current = 1;
                        setInterval(function() {
                            var number = current * -height;
                            if (current === totalSlides) {
                                first.animate({'margin-top':'0px'}, 500, 'easeInOutQuad');
                                current = 1;
                            } else {
                                first.animate({'margin-top':number+'px'}, 500, 'easeInOutQuad');
                                current++;
                            }
                        }, settings.pauseTime);

                        $(window).on( 'resize', function() {
                            height = txtSlider.height();
                        });
                    });
                },

                countdown: function(options){
                    var settings = $.extend({
                        until: null,
                        labels:{
                            plural:['Days', 'Hours', 'Minutes', 'Seconds'],
                            singular:['Day', 'Hour', 'Minute', 'Second']
                        }
                    }, options );

                    return this.each(function() {
                        var countdown = $(this),
                            end = settings.until,
                            second = 1000,
                            minute = second * 60,
                            hour = minute * 60,
                            day = hour * 24,
                            timer;

                        for ( var i = 0; i < 4; i++ ) {
                            countdown.append('<div class="sec"><span class="number">00</span><span class="desc">d</span></div>');
                        }

                        var _sections = countdown.children();

                        function showRemaining(){
                            var now = new Date();
                            var diff = end.getTime() - now.getTime();

                            if ( diff < 0 ) {
                                clearInterval(timer);
                                var values = [0, 0, 0, 0];
                            }else{
                                var days = Math.floor( diff / day );
                                var hours = Math.floor( ( diff % day ) / hour );
                                var minutes = Math.floor( ( diff % hour ) / minute );
                                var seconds = Math.floor( ( diff % minute ) / second );
                                var values = [days, hours, minutes, seconds];
                            }

                            _sections.each(function(i) {
                                var _this = $(this);
                                _this.find('.number').text((values[i] > 9) ? values[i] : '0' + values[i]);
                                _this.find('.desc').text(function() {
                                    return values[i] == 1 ? settings.labels.singular[i] : settings.labels.plural[i];
                                });
                            });
                        }

                        showRemaining();

                        timer = setInterval(function(){
                            showRemaining();
                        }, 1000);
                    });
                }
            });
        }
    };

    $(document).ready(function(){ core.init(); });
})(jQuery);