/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'collections/entry'
], function ($, _, Backbone, JST, Entries) {
    'use strict';

    var EntryListView = Backbone.View.extend({
        template: JST['app/scripts/templates/entry_list.ejs'],
        emptyTemplate: JST['app/scripts/templates/entry_list_empty.ejs'],

        tagName: 'section',

        id: 'content',

        className: '',

        events: {},

        initialize: function () {
            this.collection = Entries;

            this.listenTo(this.collection, 'change', this.render);
        },

        render: function () {
            if (this.collection.length) {
                this.$el.html(this.template({ entries: this.collection.toJSON() }));
            } else {
                this.$el.html(this.emptyTemplate());
            }

            return this;
        }
    });

    return new EntryListView();
});
