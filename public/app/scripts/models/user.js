/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var UserModel = Backbone.Model.extend({
        url: function () { return window.root_url + '/api/1/users/signin' },

        initialize: function() {
            this.listenTo(this, 'change:email change:password', this.login, this);
        },

        defaults: {
            authorized: false,
            loggingIn: false
        },

        login: function () {
            if (this.get('password') == '') {
                return;
            }

            this.set('loggingIn', true);
            var that = this;

            that.fetch({
                type: 'post',
                data: {
                    email: that.get('email'),
                    password: that.get('password')
                },
                success: function (model, data, c) {
                    that.set({
                        accesskey: data.authentication_token,
                        authorized: true
                    });
                },
                error: function (model, data) {
                    that.set({
                        accesskey: '',
                        authorized: false,
                        lastError: data.responseJSON.error
                    });
                },
                complete: function () {
                    that.set('loggingIn', false);
                }
            });
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            // return response;
        }
    });

    return new UserModel();
});
