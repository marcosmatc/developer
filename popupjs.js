(function () {
    'use strict';

    function PopupJS(data, options) {

        var close;
        var _this = this;
        _this.options = jQuery.extend({}, PopupJS.prototype.options, options || {});

        // Resolve the viewport vs prototype option (prototype overrides viewport)
        if (this.options.position === PopupJS.prototype.options.position) {
            _this.options.position = _this.options.viewport;
        }

        // Prepare the item
        _this.popupJS = jQuery(_this.template);
        _this.setContent(data);

        // Adjust the title
        if (_this.options.title === null) {

            jQuery('.popupJS-titlebox', _this.popupJS)
                .remove();

        } else {

            jQuery('.popupJS-title', _this.popupJS)
                .append(_this.options.title);

            if (_this.options.buttons.length === 0 && !_this.options.autoclose) {

                // Close button required
                close = jQuery('<span class="popupJS-closebtn"></span>');
                close.bind('click', function () {
                    _this.hide();
                });

                jQuery('.popupJS-titlebox', this.popupJS)
                    .prepend(close);

            }

            if (_this.options.titleClass !== null) {
                jQuery('.popupJS-titlebox', this.popupJS)
                    .addClass(_this.options.titleClass);
            }

        }

        // Adjust the width
        if (_this.options.width !== null) {
            jQuery('.popupJS-box', _this.popupJS)
                .css('width', _this.options.width);
        }

        // Prepare the buttons
        if (_this.options.buttons.length > 0) {

            for (var i = 0; i < _this.options.buttons.length; i++) {
                var btnbox = jQuery('<div>', {'class':'popupJS-btnbox'})
                    .css('width', parseInt(100/_this.options.buttons.length, 10) + '%');
                var cls = (_this.options.buttons[i]['class']) ? _this.options.buttons[i]['class'] : '';
                var btn = jQuery('<button>', {
                    href: '#',
                    'class': 'btn ' + cls,
                    value: _this.options.buttons[i].val,
                    'click': function () {
                        var value = $(this).val();

                        if (typeof _this.options.callback === 'function') {
                            if (_this.options.callback(value) === false) {
                                return this;
                            }
                        }

                        _this.hide();
                    }
                }).text(_this.options.buttons[i].label);

                btnbox.append(btn);
                jQuery('.popupJS-actions', this.popupJS).append(btnbox);

            }

        } else {

            jQuery('.popupJS-footbox', this.popupJS)
                .remove();

        }

        // Prepare the close button automatically
        if (_this.options.buttons.length === 0 && _this.options.title === null && !_this.options.autoclose) {

            if (_this.options.closeButton) {
                close = jQuery('<span class="popupJS-closebtn"></span>');
                close.bind('click', function () {
                    _this.hide();
                });

                jQuery('.popupJS-content', this.popupJS)
                    .prepend(close);

            }

        }

        // Activate the modal screen
        if (_this.options.modal) {
            _this.modal = jQuery('<div class="popupJS-modal"></div>')
            .css({
                opacity: _this.options.modalOpacity,
                width: jQuery(document).width(),
                height: jQuery(document).height(),
                position: 'fixed',
                'z-index': _this.options.zIndex + jQuery('.popupJS').length
            })
            .appendTo(document.body);
        }

        // Show the message
        if (_this.options.show) { _this.show(); }

        // Control the resizing of the display
        jQuery(window).bind('resize scroll', function () {
            _this.resize();
        });

        // Configure the automatic closing
        if (_this.options.autoclose !== null) {
            setTimeout(function () {
                var value = jQuery.data(this, 'value');
                var after = (_this.options.callback !== null) ? function () {
                        _this.options.callback(value);
                    } : null;
                _this.hide();
            }, _this.options.autoclose, this);
        }

        return _this;

    }

    PopupJS.prototype = {

        options: {
            animate: { open: 'bounceIn', close: 'bounceOut' },  // default animation (disable by setting animate: false)
            autoclose: null,                                    // autoclose message after 'x' miliseconds, i.e: 5000
            buttons: [],                                        // array of buttons, i.e: [{id: 'ok', label: 'OK', val: 'OK'}]
            callback: null,                                     // callback function after close message
            center: true,                                       // center message on screen
            closeButton: true,                                  // show close button in header title (or content if buttons array is empty).
            height: 'auto',                                     // content height
            title: null,                                        // message title
            titleClass: null,                                   // title style: info, warning, success, error
            margin: 0,                                          // enforce a minimal viewport margin the dialog cannot move outside, set to zero to disable
            modal: false,                                       // shows message in modal (loads background)
            modalOpacity: 0.2,                                  // modal background opacity
            padding: '10px',                                    // content padding
            position: { top: '0px', left: '0px' },              // if center: false, sets X and Y position
            show: true,                                         // show message after load
            unload: true,                                       // unload message after hide
            viewport: { top: '0px', left: '0px' },              // deprecated, see position
            width: '500px',                                     // message width
            zIndex: 99999                                       // first dialog z-index
        },
        template: '<div class="popupJS"><div class="popupJS-box"><div class="popupJS-wrapper"><div class="popupJS-titlebox"><span class="popupJS-title"></span></div><div class="popupJS-content"></div><div class="popupJS-footbox"><div class="popupJS-actions"></div></div></div></div></div>',
        content: '<div></div>',
        visible: false,

        setContent: function (data) {
            jQuery('.popupJS-content', this.popupJS)
                .css({
                    padding: this.options.padding,
                    height: this.options.height
                })
                .empty()
                .append(data);
        },

        center: function () {
            this.popupJS.css({
                top: ((jQuery(window).height() - this.popupJS.height()) / 2),
                left: ((jQuery(window).width() - this.popupJS.width()) / 2)
            });

            return this;
        },

        show: function () {

            if (this.visible) { return; }

            if (this.popupJS.parent().length === 0) {
                // or unload in case of first call
                if (this.modal) {
                    this.modal.appendTo(document.body);
                }
                this.popupJS.appendTo(document.body);
            }

            if (this.modal) {
                this.modal.show();
            }

            // positioning
            this.popupJS.css({
                top: this.options.position.top,
                left: this.options.position.left
            });

            this.popupJS.css({
                'zIndex': this.options.zIndex + jQuery('.popupJS').length
            });

            // animation
            if (this.options.animate) {
                this.popupJS.addClass('animated '+this.options.animate.open);
            }

            this.popupJS.show();

            // Get the center of the screen if the center option is on
            if (this.options.center) {
                this.center();
            } else {
                this.enforceMargin();
            }

            // Cancel the scroll
            //document.documentElement.style.overflow = "hidden";

            this.visible = true;

        },

        hide: function () {

            if (!this.visible) { return; }
            var _this = this;

            if (this.options.animate) {
                this.popupJS.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                    _this.visible = false;
                    if (_this.options.unload) {
                        _this.unload();
                    }
                });

                this.popupJS.removeClass(this.options.animate.open).addClass(this.options.animate.close);
            } else {
                this.popupJS.animate({
                    opacity: 0
                }, 300, function () {
                    if (_this.options.modal) {
                        _this.modal.css({
                            display: 'none'
                        });
                    }
                    _this.popupJS.css({
                        display: 'none'
                    });

                    // Reactivate the scroll
                    //document.documentElement.style.overflow = "visible";
                    _this.visible = false;
                    if (_this.options.unload) {
                        _this.unload();
                    }
                });
            }

            return this;

        },

        resize: function () {
            if (this.options.modal) {
                jQuery('.popupJS-modal')
                    .css({
                        width: jQuery(document).width(),
                        height: jQuery(document).height()
                    });
            }

            if (this.options.center) {
                this.center();
            } else if(this.options.margin > 0) {
                this.enforceMargin();
            }
        },

        toggle: function () {
            this[this.visible ? 'hide' : 'show']();
            return this;
        },

        unload: function () {
            if (this.visible) {
                this.hide();
            }

            jQuery(window)
                .unbind('resize scroll');

            if (this.modal) {
                this.modal.remove();
            }

            this.popupJS.remove();
        },

        // When the dialog is outside the viewport, move it back in.
        // options.viewport is the center point of the dialog
        enforceMargin: function () {
            if (!this.options.margin) { return; }

            var $window = jQuery(window);

            // Backward compatibility hack - remove in version 2.1
            var x = this.max(
                parseInt(this.options.viewport.left, 10),
                parseInt(this.options.position.left, 10)
            );
            var y = this.max(
                parseInt(this.options.viewport.top, 10),
                parseInt(this.options.position.top, 10)
            );

            // When the popup is too far on the right, move left
            if (x + this.popupJS.width() + this.options.margin > $window.width()) {
                x = $window.width() - this.options.margin - this.popupJS.width();
            }

            // When the popup is too far down, move up
            if (y + this.popupJS.height() + this.options.margin > $window.height()) {
                y = $window.height() - this.options.margin - this.popupJS.height();
            }

            // When the popup is too far to the left, move right
            if (x < this.options.margin) {
                x = this.options.margin;
            }

            // When the popup is too far up, move down
            if (y < this.options.margin) {
                y = this.options.margin;
            }

            this.popupJS.css({ left: x, top: y });
        },

        jqueryize: function() {
            return this.popupJS;
        },

        max: function (a, b) {
            if (a > b) { return a; }
            else { return b; }
        },

    };

    // Preserve backward compatibility
    window.PopupJS = PopupJS;

})();
// vim: expandtab shiftwidth=4 tabstop=4 softtabstop=4:

jQuery.extend(PopupJS, {

    alert: function (data, callback, options) {

        var buttons = [{
            id: 'ok',
            label: 'OK',
            val: 'OK'
        }];

        options = jQuery.extend(
            { closeButton: false, buttons: buttons, callback: function () {} },
            options,
            { show: true, unload: true, callback: callback }
        );

        return new PopupJS(data, options);

    },

    ask: function (data, callback, options) {

        var buttons = [
            { id: 'yes', label: 'Yes', val: 'Y', 'class': 'btn-success' },
            { id: 'no', label: 'No', val: 'N', 'class': 'btn-danger' }
        ];

        options = jQuery.extend(
            { closeButton: false, modal: true, buttons: buttons, callback: function () {} },
            options,
            { show: true, unload: true, callback: callback }
        );

        return new PopupJS(data, options);

    },

    img: function (src, options) {

        var img = new Image();

        jQuery(img).load(function () {

            var vp = {
                width: jQuery(window).width() - 50,
                height: jQuery(window).height() - 50
            };
            var ratio = (this.width > vp.width || this.height > vp.height) ?
                Math.min(vp.width / this.width, vp.height / this.height) :
                1;

            jQuery(img)
                .css({
                    width: this.width * ratio,
                    height: this.height * ratio
                });

            options = jQuery.extend(
                {
                    show:         true,
                    unload:       true,
                    closeButton:  true,
                    width:        this.width * ratio,
                    height:       this.height * ratio,
                    padding:      0
                },
                options
            );

            new PopupJS(img, options);

        })
        .error(function () {

            // Be IE friendly
            if (typeof window.console === 'object') {
                console.log('Error loading ' + src);
            }

        })
        .attr('src', src);

    },

    load: function (url, options) {

        options = jQuery.extend(
            { show: true, unload: true, params: {} },
            options
        );

        var request = {
            url: url,
            data: options.params,
            dataType: 'html',
            cache: false,
            error: function (request, status, error) {
                // Be IE friendly
                if (typeof window.console === 'object') {
                    console.log(request.responseText);
                }
            },
            success: function (html) {
                new PopupJS(html, options);
            }
        };

        jQuery.ajax(request);

    }

});
