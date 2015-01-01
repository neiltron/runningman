/*global define*/

define([
    'underscore',
    'backbone',
    'models/user'
], function (_, Backbone, User) {
    'use strict';

    var EntryModel = Backbone.Model.extend({
        url: function () {
            return window.root_url + '/api/1/entries?accesskey=' + User.get('accesskey');
        },

        initialize: function() {
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

    return EntryModel;
});
