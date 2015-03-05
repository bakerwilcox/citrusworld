/*global window*/
(function (w, $) {
    'use strict';

    /*
    $.each(front.find('img').last(), function () {
        var currentScreen = $(this).closest('.scene'),
            index = $('.scene').index(currentScreen),
            offset = $(this).offset().left,
            sceneOffset = offset - currentScreen.offset().left;

        // original 6348
        // new 9287
        // difference 2939
        //$(this).offset({left: 0});
    });
    */

    var canvas,
        scenes,
        back,
        mid,
        front,
        player,
        playerDiff,
        bubbles;

    function move() {

        var pos = canvas.scrollLeft(),
            backPos  = -pos / 8,
            midPos   = -pos / 4,
            frontPos = -pos / 2,
            currentSceneIndex = Math.floor((pos + playerDiff) / 1024),
            currentScene = scenes.eq(currentSceneIndex);

        scenes.removeClass('prev next active');
        currentScene.addClass('active');
        currentScene.prev('.scene').addClass('prev');
        currentScene.next('.scene').addClass('next');

    //    if ($.browser.webkit) {
    //back.css('-webkit-transform', 'translate3d(' + backPos + 'px, 0, 0)');
    //mid.css('-webkit-transform', 'translate3d(' + midPos + 'px, 0, 0)');
    //front.css('-webkit-transform', 'translate3d(' + frontPos + 'px, 0, 0)');
    //    }
    // `else` use 'left'
    }

    function say(target, msg, final, iteration) {
        var tooltip = target.find('.tooltip'),
            i,
            duration = 5000,
            intervalId = 0;

        if (isNaN(iteration)) {
            if (tooltip[0].intervals && tooltip[0].intervals.length) {
                for (i = 0; i < tooltip[0].intervals.length; i += 1) {
                    w.clearInterval(tooltip[0].intervals[i]);
                }
            }
        }
        if (!tooltip[0].intervals) {
            tooltip[0].intervals = [];
        }
        tooltip[0].intervals.shift();

        if (msg && msg.push) {
            for (i = 0; i < msg.length; i += 1) {
                intervalId = w.setTimeout(
                    say,
                    duration * i,
                    target,
                    msg[i],
                    i === msg.length - 1,
                    i
                );
                tooltip[0].intervals.push(intervalId);
            }
        } else {
            tooltip.find('p').remove();
            if (msg) { tooltip.append('<p>' + msg + '</p>'); }
            if (final) {
                intervalId = w.setTimeout(
                    say,
                    duration,
                    target,
                    '',
                    null,
                    0
                );
                tooltip[0].intervals.push(intervalId);
            }
        }
    }
    $.fn.say = function () {
        var a = arguments;
        say($(this), a[0], a[1], a[2]);
    };

    function goTo(anchor) {
        //document.location.hash = anchor;
        var bodyWidth = $('body').width(),
            target = $('#' + anchor),
            targetWidth,
            playerWidth = player.width() || 320,
            pos;

        if (!target.length) { target = $('#citrus'); }

        switch (anchor) {
        case 'investments':
            target = $('.lemonade.stand');
            break;
        }

        targetWidth = target.width();
        pos = (target.offset().left) - (bodyWidth / 2) + (targetWidth / 2);
        pos = pos + (bodyWidth * 0.2) - (playerWidth / 2);

        if (anchor.match(/index|mortgages/)) {
            pos = pos - playerWidth - 20;
        }

        if (anchor === 'people') {
            pos = pos - 70;
        }


        if ($(w.document).scrollLeft() < pos) {
            player[0].className = 'puppet right';
        } else {
            player[0].className = 'puppet left';
        }

        function onScene() {
            player[0].className = 'puppet';
            player.say(bubbles[anchor]);
            w.location.hash = anchor;
        }

        $(w.document).scrollTo(pos, 2000, { onAfter: onScene});
    }

    function init() {
        canvas = $(w.document);
        scenes = $('.scene');
        back = $('.layer.back');
        mid = $('.layer.mid');
        front = $('.layer.front');
        player = $('#david');
        playerDiff = player.offset().left + (player.width() / 2);

        player.hover(function () {
            var self = $(this);
            self.addClass('waving');
            w.setTimeout(function () { self.removeClass('waving'); }, 1000);
        }, function () { return; });

        canvas.scroll(move);
        move();

        $.getJSON('scripts/bubbles.json', function (data) {
            bubbles = data;
            player.say(bubbles.index);
        });

        w.location.hash = 'citrus';
    }

    $(w.document).ready(init);
    w.goTo = goTo;

}(window, window.jQuery));
