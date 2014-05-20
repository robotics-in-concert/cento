Template.modal_comment.events({
  'click .btn.comment': function(e){

    var f = $(e.target).closest('form');
    var id = this._id;
    var txt = f.find('textarea').val();

    if(this.type != null && this.type != ''){
      Cento.WorkItems.update({_id: id},
          {$inc: {comments_count: 1}, $push: {comments:{_id: Random.id(), body: txt, 'created':new Date(), user_id: Meteor.userId()}}});
    }else{
      Cento.Artifacts.update({_id: id},
          {$push: {comments:{_id: Random.id(), body: txt, 'created':new Date(), user_id: Meteor.userId()}}});
    }
    Cento.createAction(Cento.ActionTypes.COMMENT_ON_USERNEEDS, id, {body: txt});
    f[0].reset();
    return false;
  },

  'click .delete_comment': function(e){
    var pid = $(e.target).closest('li.post').data('post_id');
    var cid = $(e.target).closest('li').data('comment_id');
    console.log(cid);
    Cento.WorkItems.update({_id:pid}, {$pull:{comments:{_id: cid}}});
    return false;
  }
});
