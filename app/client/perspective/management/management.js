
// old code
// Template.management.rendered = function(){
  // var svg = this.find('#svg')
  // new TrelloCards(svg)
// };
Template.management.rendered = function(){

  $('body').click(function(){
    var dd = $('#card_actions_dropdown');
    dd.hide();
  });

};
Template.card.events({
  'click .card': function(e){
    var m = this;


    Router.go('solutions_modelings_show', {solution: m.solution_id, item: m._id});

    return false;
  },
  'click .more': function(e){
    var m = this;

    Session.set('selectedCardId', m._id);
    var a = $(e.target);
    var dd = $('#card_actions_dropdown');

    dd.show()
      .css('top', a.offset().top + a.height())
      .css('left', a.offset().left);
    return false;
  }

});


