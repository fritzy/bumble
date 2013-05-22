var logger  = require('winston'),
    marked  = require('marked'),
    sugar   = require('sugar'),
    util    = require('util'),
    fs      = require('fs');

var parsePosts  = new (require('./ParsePost'))();

var postData;

// parse and load the post files into memory
parsePosts.on('ready', function(posts) {
    logger.info("got ready event from parsePosts");
    logger.info(util.inspect(posts)); 
    postData = posts;
});

parsePosts.setup();

// homepage
exports.index = function (req, res) {
  res.render('index', {
    pageTitle: 'home', 
    bodyId: 'home'
  });
}; 

exports.blogIndex = function (req, res) {
  if (typeof postData === 'undefined') {
    logger.info('No postData here yet');
    // parsePosts();
  }
  else {
    res.render('blogIndex', { 
      pageTitle: 'All posts', 
      bodyId: 'archive',
      postData: postData,
      postUrl: '/blog/'
    });
  }
};

exports.blogPost = function (req, res) {
  var slug = req.params.pslug, markdown;

  // get the file based on the slug in the request
  fs.readFile('blog/' + slug + '.md', 'utf8', function(err, data){
    markdown = marked(data);
    getData(slug, markdown);
  })

  // get the JSON data based on the slug
  function getData (slug, markdown) {
      jf.readFile('blog/' + slug + '.json', function(err, obj){
      postData = obj;
      render (slug, markdown, postData);
    })
  };

  // render markdown and JSON metadata
  function render(slug, markdown, postData) {
    res.render('post', {
      pageTitle: 'blog', 
      bodyId: 'post',
      slug: slug,
      content: markdown,
      title: postData.title,
      date: postData.date,
      author: postData.author
    });
  };

};

// 404
exports.notFound = function (req, res) {
  res.render('404', {status: 404, bodyId: 'fourohfour'});
};