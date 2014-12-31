/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'models/user',
    'views/login',
    'views/register',
    'views/entry_list'
], function ($, _, Backbone, User, LoginView, RegisterView, EntryListView) {
    'use strict';

    var AppRouter = Backbone.Router.extend({
        initialize: function () {
            window.root_url = 'http://localhost:9001';

            this.containerView = $('#content');

            this.listenTo(User, 'change:authorized', this.toggleAuthenticated);
        },

        routes: {
            'entries':  'showEntryView',
            'login':    'showLoginView',
            'register': 'showRegisterView',
            '*path':    'showEntryView'
        },

        toggleAuthenticated: function () {
            if (User.get('authorized')) {
                Backbone.history.navigate('entries', true);
                $('body').addClass('is-logged-in');
            } else {
                Backbone.history.navigate('login', true);
                $('body').removeClass('is-logged-in');
            }
        },

        showLoginView: function () {
            this.showView(LoginView);
        },

        showRegisterView: function () {
            this.showView(RegisterView);
        },

        showEntryView: function () {
            if (!User.get('authorized')) {
                this.toggleAuthenticated();

                return false;
            }

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
