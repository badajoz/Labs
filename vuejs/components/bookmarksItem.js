Vue.component('bookmarks-item', {
    props: ['bookmark'],
    template: '<li>{{ bookmark.url }}</li>'
});