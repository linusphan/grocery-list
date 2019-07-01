const ItemModel = Backbone.Model.extend({
});

const items = {
  collection: [],

  create: function (itemData) {
    const item = new ItemModel(itemData);
    this.collection.push(item);

    return item;
  },

  seedCollection: function () {
    itemsJSON.forEach(this.create.bind(this));
  },

  render: function () {
    
  },
};

const template = Handlebars.compile($('#items').html());

Handlebars.registerPartial('item', $('#item').html());

items.seedCollection();
