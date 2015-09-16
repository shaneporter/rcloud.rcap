define([
    'pubsub',
    'site/pubSubTable',
    'controls/factories/controlFactory'
], function(PubSub, pubSubTable, ControlFactory) {

    'use strict';

    var controlFactory = new ControlFactory();

    // :::: TODO: refactor code below - both methods are very similar ::::

    var MenuManager = Class.extend({
        init: function() {

        },
        initialise: function() {

            var pageListItemMarkup = '<li data-pageid="<%=p.id%>"><a href="#"><em class="navigation-title"><%=p.navigationTitle%></em> <span class="page-settings" title="Modify page settings">Settings</span></a></li>';

            // subscribe here - is this the best place?:
            PubSub.subscribe(pubSubTable.initSite, function(msg, site) {

                console.info('menuManager: pubSubTable.initSite');

                // do stuff with the site's pages:
                var templateStr = '<% _.each(pages, function(p){ %>' + pageListItemMarkup + '<% }); %>';
                var template = _.template(templateStr);
                $('#pages').html(template({
                    pages: site.pages
                }));

                // click handler for page:
                $('body').on('click', '#pages a', function() {
                    $('#pages li').removeClass('selected');
                    var li = $(this).closest('li');
                    li.addClass('selected');

                    // just the id:
                    PubSub.publish(pubSubTable.changeSelectedPageId, li.data('pageid'));
                });

                // sort 'em':
                $('#pages').sortable({
                    containment: 'parent',
                    update: function( /*event, ui*/ ) {

                        var pageIds = [];
                        $('#pages li').each(function() {
                            pageIds.push($(this).data('pageid'));
                        });

                        PubSub.publish(pubSubTable.changePageOrder, pageIds);
                    }
                });

                // the first is as good as any:
                $('#pages a:eq(0)').trigger('click');
            });

            PubSub.subscribe('ui:' + pubSubTable.addPage, function(msg, page) {

                console.info('menuManager: pubSubTable.addPage');

                var template = _.template(pageListItemMarkup);
                $('#pages').append(template({
                    p: page
                }));

                // select the newly added page:
                $('#pages li[data-pageid="' + page.id + '"] a').trigger('click');
            });

            PubSub.subscribe(pubSubTable.updatePage, function(msg, pageObj) {

                console.info('menuManager: pubSubTable.updatePage');

                $('#pages li[data-pageid="' + pageObj.id + '"] .navigation-title').text(pageObj.navigationTitle);
            });

            PubSub.subscribe(pubSubTable.deletePageConfirm, function(msg, pageId) {

                console.info('menuManager: pubSubTable.deletePageConfirm');

                $('#pages li[data-pageid="' + pageId + '"]').remove();

                // select the first item:
                $('#pages li').removeClass('selected');
                $('#pages li:eq(0)').addClass('selected');
            });

        },
        initialiseControlsMenu: function() {
            var controls = controlFactory.getGridControls();
            var templateStr = '<% _.each(controls, function(control){ %><li data-type="<%=control.type%>"><a href="#" class="control-<%=control.type %>" title="Add <%=control.type%>"><%= control.label %></a></li><% }); %>';
            var template = _.template(templateStr);
            $('.menu .controls').append(template({
                controls: controls
            }));
        },
        intialiseFormBuilderMenu: function() {
            var childControls = controlFactory.getChildControls();
            var templateStr = '<% _.each(controls, function(control){ %><li data-type="<%=control.type%>"><a href="#" class="control-<%=control.type %>" title="Add <%=control.label%>"><%= control.label %></a></li><% }); %>';
            var template = _.template(templateStr);
            $('#dialog-form-builder .controls').append(template({
                controls: childControls
            }));
        },
        getPages: function() {
            // get the page items:
            var pages = [];
            $('#pages li').each(function() {
                pages.push($(this).data('pageid'));
            });
            return pages;
        }
    });

    return MenuManager;

});
