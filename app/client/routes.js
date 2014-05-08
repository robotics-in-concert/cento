
/*
 * Hooks
 *
 */
var Hooks = {
  'loginRequired': function(pause){
    if(!(Meteor.loggingIn() || Meteor.user())){
      alertify.error("Please login.");
      // this.render('login');
      // pause();
      this.redirect('login')
      return false;
    }
  }

};

Router.configure({
  layoutTemplate: 'layout',
});

Router.onBeforeAction(function(){
  Session.set('currentSolution', Cento.Solutions.findOne({_id: this.params.solution}));
});
Router.onBeforeAction(Hooks.loginRequired, {except: ['login']});


Router.map(function(){
  this.route('home', {
    path: '/',
    template: 'home',
    data: function(){
      return {
        solutions: Cento.Solutions.find({})
      }

    }
  });

  this.route('solutions', {
    path: '/solutions',
    template: 'solutions',
    data: function(){
      return {
        solutions: Cento.Solutions.find({}),
        users: Meteor.users.find({'services.github': {$exists: true}}).fetch()
      }

    }
  });

  this.route('user_needs', {
    path: '/user_needs',
    template: 'user_needs',
    onBeforeAction: function(){
      Session.set('filesToAttach', []);
    },
    data: function(){
      var data = {};
      var groupId = this.params.group;

      data.workGroups = Cento.WorkGroups.find({solution_id: {$exists: false}});
      var query = {type: Cento.WorkItemTypes.USER_NEEDS};
      if(groupId && groupId !== ""){
        query.work_group_id = groupId;
        data.group_id = groupId;
        data.currentWorkGroup = Cento.WorkGroups.findOne(groupId);
      }

      data.workItems = Cento.WorkItems.find(query, {limit: Session.get('itemsLimit'), sort: {'created': -1},
        transform: function(doc){
          doc.user = Meteor.users.findOne(doc.user_id);
          doc.solutions = Cento.Solutions.find({'related.related_work_id': doc._id}).fetch();
          return doc;
        }
       });
      data.notifications = Cento.WorkItems.find(query, {limit: 4, sort: {'created': -1},
        transform: function(doc){
          doc.user = Meteor.users.findOne(doc.user_id);
          doc.solutions = Cento.Solutions.find({'related.related_work_id': doc._id}).fetch();
          return doc;
        }
       });

      return data;
    }
  });

  this.route('solutions_ideations', {
    path: '/solutions/:solution/ideations',
    template: 'ideation',
    onBeforeAction: function(){
      var ITEMS_PER_PAGE = 10;
      Session.setDefault('itemsLimit', ITEMS_PER_PAGE);
      Session.set('filesToAttach', []);
    },
    data: function(){
      var groupId = this.params.group;
      var sid = this.params.solution;
    
      var data = {};
      data.solutions = Cento.Solutions.find({});
      data.users = Meteor.users.find({});
      
      data.workGroups = Cento.WorkGroups.find({solution_id: sid});
      var query = {type: Cento.WorkItemTypes.IDEA, solution_id: sid};
      if(groupId && groupId !== ""){
        query.work_group_id = groupId;
        data.group_id = groupId;
        data.currentWorkGroup = Cento.WorkGroups.findOne(groupId);
      }

      data.workItems = Cento.WorkItems.find(query, {limit: Session.get('itemsLimit'), sort: {'created': -1},
        transform: function(doc){
          doc.user = Meteor.users.findOne(doc.user_id);
          return doc;
        }
       });

      return data;
    }
  });




  this.route('solutions_modelings', {
    path: '/solutions/:solution/modelings',
    template: 'modeling_list',
    onBeforeAction: function(){
      var firstItem = Cento.WorkItems.findOne({
        type: Cento.WorkItemTypes.MODELING,
        solution_id: this.params.solution
      });

      console.log('obc........');

      Router.go('solutions_modelings_show', {solution: this.params.solution, item: firstItem._id});


    },
    data: function(){
      var data = {};

      data.workItems = Cento.WorkItems.find({
        type: Cento.WorkItemTypes.MODELING,
        solution_id: this.params.solution
      });


      return data;
    }

  });
  this.route('solutions_modelings_show', {
    path: '/solutions/:solution/modelings/:item',
    template: 'modeling_show',
    data: function(){
      var data = {};

      data.workItems = Cento.WorkItems.find({
        type: Cento.WorkItemTypes.MODELING,
        solution_id: this.params.solution
      });

      data.workItem = Cento.WorkItems.findOne({_id: this.params.item}, {
        transform: function(doc){
         console.log(doc);
         var related_ideation = Cento.WorkItems.findOne({_id: doc.related[0].related_work_id});
         doc.related_ideation = related_ideation;
         return doc;
       }
      });
      data.artifacts = Cento.Artifacts.find({work_item_id: this.params.item});



      return data;
    }

  });

  this.route('battle_loom', {
    path: '/battle_loom',
    template: 'battle_loom',
    data: function(){
      var data = {};
      return data;
    }
  });

  this.route('management', {
    path: '/management',
    template: 'management'
  });

  this.route('solution', {
    path: '/solution',
    template: 'solution'
  });

  this.route('google_drive', {
    path: '/google_drive',
    template: 'google_drive'
  });
  this.route('manage', {
    path: '/manage',
    template: 'manage'
  });
  this.route('login', {
    path: '/login',
  });

  this.route('users', {
    path: '/users',
  });

  /*
   * admin
   */

  this.route('admin', {
    path: '/admin',
    layoutTemplate: 'admin_layout',
    template: 'admin',
    data: function(){
    }
  });
  this.route('admin_users', {
    path: '/admin/users',
    layoutTemplate: 'admin_layout',
    template: 'admin_users',
    data: function(){
      return {
        users: Meteor.users.find({'services.github':{$exists: true}})
      };
    }

  });
  this.route('admin_artifacts', {
    path: '/admin/artifacts',
    layoutTemplate: 'admin_layout',
    template: 'admin_artifacts',
    data: function(){
      return {
        artifacts: Cento.Artifacts.find({})
      };
    }

  });
  this.route('admin_user_needs', {
    path: '/admin/user_needs',
    layoutTemplate: 'admin_layout',
    template: 'admin_user_needs',
    data: function(){
      return {
        solutions: Cento.Solutions.find({})
      };
    }

  });
  this.route('admin_solutions', {
    path: '/admin/solutions',
    layoutTemplate: 'admin_layout',
    template: 'admin_solutions',
    data: function(){
      return {
        solutions: Cento.Solutions.find({})
      };
    }

  });

  /*
  this.route('ideation', {
    path: '/ideation',
    template: 'ideation',
    before: function(){
      var ITEMS_PER_PAGE = 10;
      Session.setDefault('itemsLimit', ITEMS_PER_PAGE);
      Session.set('filesToAttach', []);
    },
    data: function(){
      console.log("DATA!!!!")
      console.log(this.params);
      var categoryId = this.params.category;
      var sid = this.params.solution;
    
      var data = {};
      if(this.params.solution){
        data.solution = Cento.Solutions.findOne({_id: this.params.solution});
      }
      var query = {type: 'ideation'};
      if(categoryId && categoryId !== ""){
        query.category = categoryId;
        data.category = categoryId;
        data.workGroups = Cento.WorkGroups.find({solution_id: sid});

        console.log(categoryId);
      }

      data['posts'] = Cento.Posts.find(query, {limit: Session.get('itemsLimit'), sort: {'created': -1},
        transform: function(doc){
          doc.user = Meteor.users.findOne(doc.user_id);
          return doc;
        }
       });

      if(categoryId){
        data.currentCategory = Cento.Categories.findOne(categoryId);
        return data;
      }
      return data;
    }
    });
    */

});
