DataItems = new Meteor.Collection('data');

if (Meteor.isClient) {
  console.orig_log = console.log;
  console.log = function(s) {
    if(typeof s == "object")
      console.orig_log(s);
    else
      $('div.messages ul').append('<li>'+s+'</li>');
  };

  Template.hello.eachTag = function() {
    return "{{#each}} "+Meteor.release;
  };

  Template.hello.code = function () {
    var r = "<template name='hello'>\n";
    r+=" {{> dataEach}}\n";
    r+="</template>\n";
    r+="\n";
    r+="<template name='dataEach'>\n";
    r+="  <ul class='dataEach'>\n";
    r+="    {{#each data}}\n";
    r+="      {{> dataTemplate}}\n";
    r+="    {{/each}}\n";
    r+="  </ul>\n";
    r+="</template>\n";
    r+="\n";
    r+="<template name='dataTemplate'>\n";
    r+="  <li class='dataTemplate'>\n";
    r+="   {{title}} <sup><a href='#' id='{{_id}}' class='delete' title='delete'>x</a></sup>\n";
    r+="  </li>\n";
    r+="</template>\n";

    r+="\n\nTemplate.dataEach.data = function(){ return DataItems.find().fetch() }";
    return r;
  };

  Template.hello.codeRendered = function() {
    r = "Template.dataTemplate.rendered = function() {\n";
    r+= " console.log('dataTemplate rendered with number of a.delete = <b>'+$(this.find('a.delete'))</b>.size());\n";
    r+= "};\n";
    return r;
  };

  Template.hello.events({
    'click input.add': function (e,t) {
      if($('input.dataItem').val() != "")
        DataItems.insert({title: $('input.dataItem').val()});
      $('input.dataItem').val("").focus();
    },
    'change input.dataItem': function(e, t) {
      e.preventDefault();
      $('input.add').focus();
    }
  });

  Template.hello.rendered = function() {
    console.log('Template hello rendered');
    $('input.dataItem').focus();
  };

  Template.dataEach.rendered = function() {
    console.log('dataEach rendered with number of a.delete = '+$('a.delete').size());
    console.log(this);
  };

  Template.dataEach.data = function() {
    return DataItems.find().fetch();
  };

  Template.dataTemplate.rendered = function() {
    // console.log('dataTemplate rendered with number of a.delete = '+$('a.delete').size());
    console.log('dataTemplate rendered with number of a.delete = '+$(this.find('a.delete')).size());
    console.log(this);
  };

  Template.dataTemplate.events({
    'click a.delete': function(e, t) {
      e.preventDefault();
      console.log('deleting '+e.target.id);
      DataItems.remove({_id: e.target.id});      
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
