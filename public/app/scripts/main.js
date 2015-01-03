/*global require*/
'use strict';

require.config({
    shim: {
    },
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/lodash/dist/lodash',
        pickadate: '../bower_components/pickadate/lib/picker',
        pickadateDate: '../bower_components/pickadate/lib/picker.date'
    }
});

require([
    'backbone', 'routes/app'
], function (Backbone, App) {
    // add a close function to views to handle
    // cleanup and prevent zombie views
    Backbone.View.prototype.close = function () {
        this.trigger('close');
        this.unbind();
        this.undelegateEvents();

        this.remove();

        delete this.$el;
        delete this.el;
    };

    var app_router = new App();
    Backbone.history.start();
});
