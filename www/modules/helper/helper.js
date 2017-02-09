define(['jquery', 'underscore', 'backbone', 'iscroll', 'text!modules/helper/viewTemplate.html'], function($, _, Backbone, IScroll, ViewTemplate) {
	var view = Backbone.View.extend({
		template : _.template(ViewTemplate),
		events : {
			"pageshow" : "pageShow"
		},
		initialize : function(options) {
		},
		pageShow : function() {
			new IScroll('#helperPage .content', {
				preventDefault : false,
				bounceEasing : 'circular',
				bounceTime : 1200
			});
			$(document).bind('touchmove', function(e) {
				e.preventDefault();
			});
		},
		render : function() {
			this.$el.append(this.template());
			return this;
		}
	});
	return view;
}); 