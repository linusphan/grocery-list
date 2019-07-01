const template = Handlebars.compile($('#items').html());
Handlebars.registerPartial('item', $('#item').html());

const ItemModel = Backbone.Model.extend({
  idAttribute: 'id',
});

const items = {
  $body: $('tbody'),
  collection: [],

  empty: function () {
    this.collection = [];
    this.render();
  },

  create: function (itemData) {
    itemData.id = this.collection.length + 1;
    const item = new ItemModel(itemData);

    this.collection.push(item);

    return item;
  },

  seedCollection: function () {
    itemsJSON.forEach(this.create.bind(this));
  },

  render: function () {
    this.$body.html(template({ items: this.collection }));
  },

  remove: function (e) {
    e.preventDefault();

    const $e = $(e.currentTarget);
    const model = _(this.collection).findWhere({ id: +$e.attr('data-id') });

    this.collection = _(this.collection).without(model);
    this.render();
  },

  sortBy: function (prop) {
    this.collection = _(this.collection).sortBy(function (model) {
      return model.attributes[prop];
    });

    this.render();
  },

  bind: function () {
    this.$body.on('click', 'a', this.remove.bind(this));
  },

  init: function () {
    this.seedCollection();
    this.render();
    this.bind();
  },
};

items.init();

$('form').on('submit', function (e) {
  e.preventDefault();

  const inputs = $(this).serializeArray();
  const attrs = {};

  inputs.forEach(function (input) {
    attrs[input.name] = input.value;
  });

  const item = items.create(attrs);
  items.$body.append(Handlebars.partials.item(item.toJSON()));
  this.reset();
});

$('th').on('click', function () {
  const prop = $(this).attr('data-prop');
  items.sortBy(prop);
});

$('p a').on('click', function (e) {
  e.preventDefault();

  items.empty();
});
