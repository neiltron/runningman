/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'pickadate',
    'pickadateDate',
    'templates',
    'collections/entry',
    'views/entry'
], function ($, _, Backbone, pickadate, pickadateDate, JST, Entries, EntryItemView) {
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
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'sort', this.render);
            this.listenTo(this.collection, 'add', this.addOne);
        },

        addOne: function (model) {
            // remove the empty state placeholder if it exists
            var emptyEl = this.$el.find('.empty');

            if (emptyEl.length) {
                this.render();
            } else {
                var itemView = new EntryItemView({ model: model });
                this.$el.find('tbody.entries').append(itemView.render().el)
            }
        },

        addAll: function () {
            this.$el.find('tbody.entries').empty();

            if (this.collection.length > 0) {
                _.each(this.collection.models, function (model) {
                    this.addOne(model);
                }, this);
            } else {
                this.$el.html(this.emptyTemplate());
            }
        },

        setDateRange: function () {
            // grabs the current values of the date range pickers and pass
            // them to the entries collection, causing a fetch/reset
            var start = this.$el.find('#start_date_picker').val(),
                end = this.$el.find('#end_date_picker').val();

            this.collection.setDateRange(start, end);
        },

        render: function () {
            if (this.collection.loaded) {
                var that = this;

                this.$el
                    .html(this.template({
                        start: this.collection.start_date,
                        end: this.collection.end_date
                    }))
                    .find('#start_date_picker, #end_date_picker').each(
                        function (i, el) {
                            $(el).pickadate({
                                format: 'yyyy/m/d',
                                editable: false,
                                max: Date.now(),
                                onSet: function () {
                                    that.setDateRange();
                                }
                            });
                        }
                    );

                this.addAll();
            } else {
                this.$el.html(this.loadingTemplate());
            }

            return this;
        }
    });

    return new EntryListView();
});
