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

        events: {
            'click .delete': 'deletePost'
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.close);
        },

        deletePost: function (e) {
            e.preventDefault();

            this.model.destroy();
        },

        render: function () {
            this.$el.html(this.template({ model: this.model.toJSON(), date: this.model.formatDate() }));

            return this;
        }
    });

    return EntryView;
});
