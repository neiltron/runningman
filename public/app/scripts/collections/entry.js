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

        initialize: function () {},

        parse: function (response) {
            this.loaded = true;

            return response.entries;
        },

        comparator: function (model) {
          return -new Date(model.get('date')).getTime();
        },
    });

    return new EntryCollection();
});
