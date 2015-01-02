/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var EntryView = Backbone.View.extend({
        template: JST['app/scripts/templates/entry.ejs'],

        tagName: 'tr',

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },

        formatDate: function () {
            var date = new Date(this.model.get('date')),
                hours = date.getHours(),
                minutes = date.getMinutes(),
                minutes = minutes.length == 1 ? '0' + minutes : minutes,  // add preceding zero if necessary.
                ampm = hours > 12 ? 'pm' : 'am',                          // de-militarize...
                hours = hours > 12 ? hours - 12 : hours;                  // ...the time

            return [date.getFullYear(), date.getMonth(), date.getDate()].join('/')
                    + ' ' + [hours, minutes].join(':') + ampm;
        },

        render: function () {
            this.$el.html(this.template({ model: this.model.toJSON(), date: this.formatDate() }));

            return this;
        }
    });

    return EntryView;
});
