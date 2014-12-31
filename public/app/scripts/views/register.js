/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var RegisterView = Backbone.View.extend({
        template: JST['app/scripts/templates/register.ejs'],

        tagName: 'form',

        id: 'register',

        className: '',

        events: {
            'submit': 'registerUser'
        },

        initialize: function () {},

        registerUser: function (e) {
            e.preventDefault();

            var that = this;

            $.ajax({
                type: 'post',
                data: {
                    email: that.$el.find('#email').val(),
                    password: that.$el.find('#password').val()
                },
                url: window.root_url + '/api/1/users/signup',
                success: function (data) {
                    that.setAlert('success', 'Account created. You can now <a href="/#login">login</a>.');
                },
                error: function (data) {
                    that.setAlert('error', data.responseJSON.error);
                }
            });
        },

        setAlert: function (state, message) {
            this.$el.find('.flash')
                .addClass('active flash-' + state)
                .html(message);
        },

        render: function () {
            this.$el.html(this.template());

            return this;
        }
    });

    return new RegisterView();
});
