/*global define*/

define([
    'underscore',
    'backbone',
    'models/user'
], function (_, Backbone, User) {
    'use strict';

    var EntryModel = Backbone.Model.extend({
        url: function () {
            // if model is new, make entryId an empty string
            // this will be used to differentiate between
            // url endpoints below
            var entryId = this.isNew() ? '' : this.get('id');

            return window.root_url + '/api/1/entries/' + entryId + '?accesskey=' + User.get('accesskey');
        },

        initialize: function() {},

        defaults: {},

        validate: function(attrs, options) {},

        parse: function(response, options)  {
            return response;
        },

        formatDate: function () {
            // skip formatting and return empty string is date isnt set
            // e.g., if the post is created without one and hasnt been saved yet
            if (typeof this.get('date') === 'undefined') {
                return '';
            }

            var date = new Date(this.get('date')),
                hours = date.getHours(),
                minutes = date.getMinutes(),
                minutes = minutes.toString().length == 1 ? '0' + minutes : minutes,  // add preceding zero if necessary.
                ampm = hours > 12 ? 'pm' : 'am',                          // de-militarize...
                hours = hours > 12 ? hours - 12 : hours;                  // ...the time

            return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/')
                    + ' ' + [hours, minutes].join(':') + ampm;
        },
    });

    return EntryModel;
});
