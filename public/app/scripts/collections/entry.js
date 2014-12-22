/*global define*/

define([
    'underscore',
    'backbone',
    'models/entry'
], function (_, Backbone, EntryModel) {
    'use strict';

    var EntryCollection = Backbone.Collection.extend({
        model: EntryModel
    });

    return new EntryCollection();
});
