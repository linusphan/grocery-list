const localStorage = window.localStorage;

function updateLocalStorage(items) {
  if (!localStorage) { return; }

  localStorage.setItem('items', JSON.stringify(items));
}

Handlebars.registerPartial('item', $('#item').html());

const ItemModel = Backbone.Model.extend({
  idAttribute: 'id',

  initialize: function () {
    this.collection.incrementID();
    this.set('id', this.collection.lastID);
  },
});

const ItemsCollection = Backbone.Collection.extend({
  lastID: 0,
  model: ItemModel,

  incrementID: function () {
    this.lastID++;
  },

  sortBy: function (prop) {
    this.models = _(this.models).sortBy(function (model) {
      return model.attributes[prop];
    });

    App.render();
  },

  sortByName: function () {
    this.sortBy('name');
  },

  initialize: function () {
    this.on('remove reset', App.render.bind(App));
    this.on('add', this.sortByName);
  },
});

const App = {
  $body: $('tbody'),
  template: Handlebars.compile($('#items').html()),

  render: function () {
    this.$body.html(this.template({ items: this.Items.models }));
  },

  removeItem: function (e) {
    e.preventDefault();

    const model = this.Items.get(+$(e.target).attr('data-id'));
    this.Items.remove(model);
  },

  bind: function () {
    this.$body.on('click', 'a', this.removeItem.bind(this));
  },

  init: function () {
    this.Items = new ItemsCollection(itemsJSON);
    this.Items.sortByName();
    this.render();
    this.bind();
  },
};

App.init();

$('form').on('submit', function (e) {
  e.preventDefault();

  const inputs = $(this).serializeArray();
  const attrs = {};

  inputs.forEach(function (input) {
    attrs[input.name] = input.value;
  });

  const item = App.Items.add(attrs);

  this.reset();
});

$('th').on('click', function () {
  const prop = $(this).attr('data-prop');
  App.Items.sortBy(prop);
});

$('p a').on('click', function (e) {
  e.preventDefault();

  App.Items.reset();
});
