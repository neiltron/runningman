/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'views/entry_list'
], function ($, _, Backbone, EntryListView) {
    'use strict';

    var AppRouter = Backbone.Router.extend({
        initialize: function () {
            this.containerView = $('#content');
        },

        routes: {
            '*path':  'showEntryView'
        },

        showEntryView: function () {
            this.showView(EntryListView);
        },

        showView: function (view) {
            //destroy previouw views
            this.closeCurrentView();

            //setup current view and any child views
            this.currentView = view;
            this.listenTo(this.currentView, 'render', this.renderChildViews);

            //render view
            this.containerView.html(this.currentView.render().el);
            this.currentView.delegateEvents();
        },

        closeCurrentView: function () {
            if (this.currentView) {
                _.each(this.currentView.children, function (args) {
                    var child = args[0];
                    child.close();
                }, this);

                this.currentView.close();
            }
        }
    });

    return AppRouter;
});
