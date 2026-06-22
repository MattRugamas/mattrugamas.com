---
layout: null
---
(function () {
  var posts = [
    {% for post in site.posts %}
    { url: "{{ post.url }}", title: {{ post.title | escape | jsonify }} }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ];
  var link = document.getElementById('random-post');
  if (link && posts.length > 1) {
    var current = window.location.pathname;
    var others = posts.filter(function (p) { return p.url !== current; });
    var pick = others[Math.floor(Math.random() * others.length)];
    link.href = pick.url;
    link.textContent = pick.title;
  }
})();
