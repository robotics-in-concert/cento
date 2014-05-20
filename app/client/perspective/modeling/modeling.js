
Template.modelings.helpers({
  'users': function(){
    return Meteor.users.find({'services.github': {$exists: true}}).fetch();
  },

  'artifacts': function(wid){
    return Cento.Artifacts.find({work_item_id: wid});
  },
  'new_replys': function(login){
    return Cento.WorkItems.find({deleted_at: {$exists: false}, type: Cento.WorkItemTypes.MODELING, 'comments.body': new RegExp("@"+login)}).fetch();
  }
});


Template.modelings.rendered = function(){
};
Template.modelings.events({
  'change select.filter_status': function(e){
    Session.set('modelingFilterStatus', $(e.target).val());
  },
  'change select.filter_member': function(e){
    Session.set('modelingFilterMember', $(e.target).val());
  },
  'click .show_ideation': function(){
    Session.set('currentIdeation', this._id);
    $('#modal-show-ideation').modal();
    return false;
  },

  'click .toggle_rel': function(e){
    var $e = $(e.target);
    var $tr = $e.closest('tr').next('tr');
    $tr.toggle();

    return false;
  },
  'click .show': function(e){
    var id = this._id;
    console.log('yyy', id);
    Session.set('currentModelingItem', id);
    $('#modal-show-modeling').modal();
    return false;
  },
  'click .delete': function(e){
    var id = this._id;
    Cento.deleteWorkItem(id);
    return false;
  },
});
Template.modeling_item.events({
  'change select': function(e){
    var newStatus = $(e.target).val();
    Cento.WorkItems.update({_id: this._id}, {$set: {status: newStatus}});
  }

});

Template.modeling_show.events({
  'change input': function(e, t){
    _.each(e.target.files, function(file){
      console.log(file);
      // Meteor.saveFile(file);
    });
    // t.find('input[type=file]').value = '';
  },
  'click .delete_artifact': function(e){
    var aid = $(e.target).closest('[data-artifact_id]').data('artifact_id')
    console.log(aid);
    Cento.Artifacts.remove({_id:aid});
    alertify.success('Artifact deleted.');
    return false;
  },
  'click .create_artifact': function(e){
    var f = $(e.target).closest('form');
    var modal = $(e.target).closest('.modal');
    var arr = f.serializeArray();
    var data = {work_item_id: this._id};
    _.each(arr, function(kv){
      data[kv.name] = kv.value;
    });
    console.log(data);

    var id = Cento.Artifacts.insert(data);
    console.log(id);

    var file = f.find('input[type=file]')[0].files[0];
    
    Meteor.saveFile(file, function(e, r){
      Cento.Artifacts.update({_id: id}, {$push: {attachments: {_id: Random.id(), name: r}}});
      modal.modal('hide');

    });

    return false;
    
  }
});

