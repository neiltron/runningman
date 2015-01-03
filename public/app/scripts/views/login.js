/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/user'
], function ($, _, Backbone, JST, User) {
    'use strict';

    var LoginView = Backbone.View.extend({
        template: JST['app/scripts/templates/login.ejs'],

        tagName: 'form',

        id: 'login',

        className: '',

        events: {
            'submit': 'login'
        },

        initialize: function () {
            this.model = User;

            this.listenTo(this.model, 'change:loggingIn', this.toggleLoginButton);
            this.listenTo(this.model, 'change:lastError', this.setAlert);
        },

        toggleLoginButton: function () {
            var loginEnabled = this.model.get('loggingIn');

            this.$el.find('#submit').attr('disabled', loginEnabled);
        },

        setAlert: function () {
            var flashEl = this.$el.find('.flash'),
                message = this.model.get('lastError');

            if (message === '') {
                flashEl.removeClass('active flash-*');
            } else {
                flashEl
                    .addClass('active flash-error')
                    .html(message);
            }
        },

        login: function (e) {
            e.preventDefault();

            this.model.set({
                email: this.$el.find('#email').val(),
                password: this.$el.find('#password').val()
            });
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));

            return this;
        }
    });

    return LoginView;
});
