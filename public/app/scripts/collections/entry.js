/*global define*/

define([
    'underscore',
    'backbone',
    'models/entry',
    'models/user'
], function (_, Backbone, Entry, User) {
    'use strict';

    var EntryCollection = Backbone.Collection.extend({
        model: Entry,
        loaded: false,

        url: function () {
            return window.root_url + '/api/1/entries?accesskey=' + User.get('accesskey');
        },

        initialize: function () {
            // set default date range to two weeks ago until now
            var start = new Date(new Date() - 1209600000),
                end = new Date();

            this.setDateRange(start, end);
        },

        parse: function (response) {
            this.loaded = true;

            return response.entries;
        },

        setDateRange: function (start, end) {
            var start = new Date(start),
                end = new Date(end);

            // if either start/end are invalid/blank, leave them undefined rather than sending NaN dates
            this.start_date = isNaN(start.getTime()) ? undefined : [start.getFullYear(), start.getMonth() + 1, start.getDate()].join('/');
            this.end_date = isNaN(end.getTime()) ? undefined : [end.getFullYear(), end.getMonth() + 1, end.getDate()].join('/');

            this.fetch({
                reset: true,
                data: {
                    start_date: this.start_date,
                    end_date: this.end_date,
                }
            })
        },

        comparator: function (model) {
          return -new Date(model.get('date')).getTime();
        },
    });

    return new EntryCollection();
});
