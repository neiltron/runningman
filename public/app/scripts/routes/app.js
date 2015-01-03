/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'models/user',
    'collections/entry',
    'views/login',
    'views/register',
    'views/entry_list',
    'views/entry_form',
], function ($, _, Backbone, User, Entries, LoginView, RegisterView, EntryListView, EntryFormView) {
    'use strict';

    var AppRouter = Backbone.Router.extend({
        initialize: function () {
            window.root_url = 'http://localhost:9001';

            this.containerView = $('#content');

            this.listenTo(User, 'change:authorized', this.toggleAuthenticated);
        },

        routes: {
            'entries/new':        'showEntryForm',
            'entries/:id/edit':   'showEntryForm',
            'entries':            'showEntryView',
            'login':              'showLoginView',
            'register':           'showRegisterView',
            '*path':              'showEntryView'
        },

        toggleAuthenticated: function () {
            if (User.get('authorized')) {
                Entries.fetch({ reset: true });

                Backbone.history.navigate('entries', true);
                $('body').addClass('is-logged-in');
            } else {
                Backbone.history.navigate('login', true);
                $('body').removeClass('is-logged-in');
            }
        },

        showLoginView: function () {
            var loginView = new LoginView();

            this.showView(loginView);
        },

        showRegisterView: function () {
            var registerView = new RegisterView();

            this.showView(registerView);
        },

        showEntryForm: function (id) {
            if (!User.get('authorized')) {
                this.toggleAuthenticated();
                return false;
            }

            var view = new EntryFormView({ entryId: id });
            this.containerView.append(view.render().el);
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
