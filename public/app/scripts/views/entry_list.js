/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'pickadate',
    'pickadateDate',
    'googlechart',
    'templates',
    'collections/entry',
    'views/entry'
], function ($, _, Backbone, pickadate, pickadateDate, googlechart, JST, Entries, EntryItemView) {
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

                this.drawWeeklyAvgGraph();
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

        drawWeeklyAvgGraph: function () {
            var chartData = [],
                groupedByDate = _.groupBy(this.collection.models, function(model) {
                    var groupDate = new Date(model.get('date'));
                    return groupDate.getWeek() + '/' + groupDate.getFullYear();
                });

            // get average per week and save it to chartData
            // in a format that google visualizations will like
            _.each(groupedByDate, function (week, i) {
                var avg = _.reduce(week, function(memo, model) {
                    return memo + model.get('distance');
                }, 0) / week.length;

                // round the avg to 1 decimal point
                avg = Math.round(avg * 10) / 10

                chartData.push([i, avg, '#4d7dca'])
            });

            // reverse order so most recent is on far right
            // and prepend a header row to label columns
            chartData.reverse().unshift(['Week', 'Average', { role: 'style' }]);
            chartData = google.visualization.arrayToDataTable(chartData);

            var view = new Backbone.GoogleChart({
                chartType: 'ColumnChart',
                chartArea: {width: '100%', height: '100%'},
                dataTable: chartData,
                colors: ['#f0f'],
                options: { 'title': 'Weeks', 'legend': 'none' },
            });

            this.$el.find('#weekly_graph').html(view.render().el);
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
