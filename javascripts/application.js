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

const ItemsView = Backbone.View.extend({
  el: 'tbody',
  template: Handlebars.compile($('#items').html()),
  events: {
    'click a': 'removeItem',
  },

  render: function () {
    this.$el.html(this.template({ items: this.collection.toJSON() }));
  },

  removeItem: function (e) {
    e.preventDefault();

    const model = this.collection.get(+$(e.target).attr('data-id'));
    this.collection.remove(model);
    updateLocalStorage(this.collection.toJSON());
  },

  initialize: function () {
    this.listenTo(this.collection, 'remove reset rerender', this.render);
  },
});

const ItemsCollection = Backbone.Collection.extend({
  lastID: 0,
  model: ItemModel,

  incrementID: function () {
    this.lastID++;
  },

  sortByProp: function (prop) {
    this.comparator = prop;
    this.sort();
    this.trigger('rerender');
  },

  sortByName: function () {
    this.sortByProp('name');
  },

  initialize: function () {
    this.on('add', this.sortByName);
  },
});

const App = {
  init: function () {
    if (
      typeof(Storage) === undefined
      || typeof(Storage) === 'undefined'
      || localStorage.items === undefined
    ) {
      this.Items = new ItemsCollection(itemsJSON);
    } else {
      this.Items = new ItemsCollection();

      let items = JSON.parse(localStorage.getItem('items'));
      items = _.sortBy(items, 'id');

      items.forEach((itemData) => {
        this.Items.add(itemData);
      });
    }

    this.View = new ItemsView({ collection: this.Items });
    this.Items.sortByName();
  },
};

$('form').on('submit', function (e) {
  e.preventDefault();

  const inputs = $(this).serializeArray();
  const attrs = {};

  inputs.forEach(function (input) {
    attrs[input.name] = input.value;
  });

  const item = App.Items.add(attrs);
  updateLocalStorage(App.Items.toJSON());

  this.reset();
});

$('th').on('click', function () {
  const prop = $(this).attr('data-prop');
  App.Items.sortByProp(prop);
});

$('p a').on('click', function (e) {
  e.preventDefault();

  App.Items.reset();
  updateLocalStorage(App.Items.toJSON());
});

App.init();
