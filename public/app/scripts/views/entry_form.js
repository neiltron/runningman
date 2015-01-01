/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/entry',
    'collections/entry'
], function ($, _, Backbone, JST, Entry, Entries) {
    'use strict';

    var EntryFormView = Backbone.View.extend({
        template: JST['app/scripts/templates/entry_form.ejs'],

        tagName: 'div',

        id: 'entry_form_container',

        className: '',

        events: {
            'submit form':   'saveEntry',
            'click .cancel': 'closeModal'
        },

        initialize: function () {
            this.model = new Entry();
        },

        closeModal: function (e) {
            if (typeof e !== 'undefined') { e.preventDefault(); }

            this.undelegateEvents();
            window.history.back();
        },

        saveEntry: function (e) {
            e.preventDefault();

            var formEl = this.$el.find('form'),
                that = this;

            this.model.save({
                distance: formEl.find('#distance').val(),
                duration: formEl.find('#duration').val(),
                date: formEl.find('#date').val()
            }, {
                success: function (model, data) {
                   Entries.add(model);

                   that.closeModal();
                },
                error: function (model, data) {
                   formEl.find('.flash')
                    .addClass('flash-error')
                    .text('There was an error saving your entry.');
                },
            });
        },

        render: function () {
            this.$el.html(this.template());

            return this;
        }
    });

    return EntryFormView;
});