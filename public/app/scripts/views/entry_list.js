/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'collections/entry',
    'views/entry'
], function ($, _, Backbone, JST, Entries, EntryItemView) {
    'use strict';

    var EntryListView = Backbone.View.extend({
        template: JST['app/scripts/templates/entry_list.ejs'],
        emptyTemplate: JST['app/scripts/templates/entry_list_empty.ejs'],
        loadingTemplate: JST['app/scripts/templates/entry_list_loading.ejs'],

        tagName: 'table',

        id: 'entry_list',

        className: '',

        events: {},

        initialize: function () {
            this.collection = Entries;

            this.listenTo(this.collection, 'change', this.render);
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'remove', this.render);
            this.listenTo(this.collection, 'add', this.addOne);
        },

        addOne: function (model) {
            // remove the empty state placeholder if it exists
            var emptyEl = this.$el.find('.empty');

            if (emptyEl.length) {
                this.render();
            } else {
                var itemView = new EntryItemView({ model: model });
                this.$el.find('tbody').append(itemView.render().el)
            }
        },

        addAll: function () {
            if (this.collection.length > 0) {
                _.each(this.collection.models, function (model) {
                    this.addOne(model);
                }, this);
            } else {
                this.$el.html(this.emptyTemplate());
            }
        },

        render: function () {
            if (this.collection.loaded) {
                this.$el.html(this.template());
                this.addAll();
            } else {
                this.$el.html(this.loadingTemplate());
            }

            return this;
        }
    });

    return new EntryListView();
});
