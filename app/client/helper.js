UI.registerHelper('$include', function(arr, item){
  return _.include(arr, item);

});

UI.registerHelper('isNotEmpty', function(coll){
  console.log('EEMMM', coll, coll.count());
  console.log(Cento.WorkItems.find({zzzz: 123}).count());


  return coll.count() > 0 ? true : false;
});

UI.registerHelper('default', function(a, x) {
  if(typeof a === 'undefined'){
    return x;
  }
  return a;
});


UI.registerHelper('relatedItems', function(id){
  var doc = Cento.WorkItems.findOne(id);
  if(!doc){
    return [];
  }

  var _getRelated = function(item, opts){

    var opts = opts || {};

    if(typeof opts.direction === 'undefined'){
      var a = _getRelated(item, _.extend(opts, {direction: 'referred'}));
      var b = _getRelated(item, _.extend(opts, {direction: 'reference'}));
      return a.concat(b);
    }


    if(typeof item.related === 'undefined'){
      return [];
    }

    return _.chain(item.related).reject(function(ri){ return ri.type !== opts.direction; })
      .map(function(ri){ return Cento.WorkItems.findOne({_id: ri.related_work_id}); })
      .compact()
      .tap( function(e){ console.log("tap:",e); } )
      .map(function(ridoc){
        return [ridoc].concat(_getRelated(ridoc, opts));
      })
      .flatten()
      .value();

  }
  if(!doc){
    return [];
  }
  var rels = _getRelated(doc);
  console.log("RELS", doc.title, rels);
  return rels;

});

UI.registerHelper('workGroups', function () {
  var sol = Session.get('currentSolution');
  if(!sol)
    return null;
  return Cento.WorkGroups.find({solution_id: sol._id});
});

UI.registerHelper('workItemsInGroup', function (gid) {
  var sol = Session.get('currentSolution');
  var filter = {work_group_id: {$exists: false}};
  if(sol){
    filter.solution_id = sol._id;
  }

  if(gid) filter.work_group_id = gid;


  console.log("management filter", filter);


  return Cento.WorkItems.find(filter);
});


UI.registerHelper('solutionLabelText', function(labelClr){
  var sol = Session.get('currentSolution');
  var colors =  ["green", "yellow", "orange", "red", "purple", "blue"];
  var idx = _.indexOf(colors, labelClr);

  return sol.label_titles ? sol.label_titles[idx] : '';
});

UI.registerHelper('solutionLabels', function(){
  var sol = Session.get('currentSolution');
  if(!sol){
    return [];
  }
  var colors =  ["green", "yellow", "orange", "red", "purple", "blue"];
  var titles = sol.label_titles || [];

  data = _.reduce(_.zip(colors, titles), function(memo, arr){
    memo.push({color: arr[0], title: arr[1]});
    return memo;
  }, []);
  return data;
});

UI.registerHelper('$eq', function (a, b) {
  return (a === b); //Only text, numbers, boolean - not array & objects
});

UI.registerHelper('tagsJoin', function(tags){
  if(tags){
    return tags.join(", ");
  }
  return "";
});

UI.registerHelper('getChecklists', function(id){
  var coll = Cento.Checklists.find({work_item_id: id}, {}, {sort: {created: -1}});
  return coll;
});

UI.registerHelper('getWorkItem', function(id){
  return Cento.WorkItems.findOne({_id: id});
});
UI.registerHelper('getArtifact', function(id){
  return Cento.Artifacts.findOne({_id: id});
});
UI.registerHelper('artifacts', function(wid){
  return Cento.Artifacts.find({work_item_id: wid});
});


UI.registerHelper('isActivePath', function(path){
  var current = Router.current();
  return current && current.route.name == path;
});
UI.registerHelper('solutions', function(a, x) {
  return Cento.solutions();
});

UI.registerHelper('currentSolution', function(){
  return Session.get('currentSolution');
});
UI.registerHelper('formatDate', function(dt, format){
  return moment(dt).format(format);
});

UI.registerHelper('activeIfEq', function(a, b){
  if(a === b) {
    return "active";
  } else {
    return "";
  }
});
UI.registerHelper('selectIfEq', function(a, b){
  if(a === b) {
    console.log('1');
    return "selected";
  } else {
    console.log('2');
    return "";
  }
});

UI.registerHelper('itemStatusLabelClass', function(status){
  if(status === 'todo'){
    return 'label-default';
  }else if(status == 'doing'){
    return 'label-info';
  }else if(status == 'done'){
    return 'label-success';
  }
});

UI.registerHelper('fileIconPath', function(name){
  var m = name.match(/\.([0-9a-zA-Z]+)$/i);
  var ext = "file";
  if(m){
    ext = m[1];
  }

  return "/fileicons/"+ext+".png";
});
UI.registerHelper('fileIsImage', function(name){
  var m = name.match(/\.([0-9a-zA-Z]+)$/i);
  if(_.include(['jpg', 'jpeg', 'png', 'gif'], m[1].toLowerCase()))
    return true;
  return false;
});

UI.registerHelper('nl2br', function(text){
  var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
    '$1' + '<br>' + '$2');
  return new Spacebars.SafeString(nl2br);
});


function userProfile(user){
  if(_.has(user.services, "google"))
    return user.services.google;
  else if(_.has(user.services, "github"))
    return user.profile;
  else null;
}

UI.registerHelper('avatarUrl', function(user){
  var u = user;
  if(typeof user === 'string'){
    u = Meteor.users.findOne(u);
  }
  if(!u || !u.profile){
    return "";
  }
  return u.profile.avatar_url;

});

UI.registerHelper('allUsers', function(){
  return Meteor.users.find();
});

UI.registerHelper('username', function(user){
  var u = user;
  if(typeof user === 'string'){
    u = Meteor.users.findOne(u);
  }
  if(!u || !u.profile){
    return "";
  }
  return u.profile.login;
});

