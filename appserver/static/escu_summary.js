require([
   'underscore',
   'jquery',
   'splunkjs/mvc',
   'splunkjs/mvc/searchmanager',
   '../app/DA-ESS-ContentUpdate/js/lib/tabs',
   'css!../app/DA-ESS-ContentUpdate/js/lib/tabs.css',
   'css!../app/DA-ESS-ContentUpdate/escu_summary.css',
   'splunkjs/mvc/simplexml/ready!'
 ], function(_, $, mvc, SearchManager) {
    $('.es-soc-analytic-story-stats').html(_.template('<%- _("Analytic Story Summary").t() %>'));
    $('.es-soc-search-stats').html(_.template('<%- _("Search Summary").t() %>'));

    let tokenModel = mvc.Components.get('default');

    // searchQuery - 
    let kcpSearch = new SearchManager({
      id: "kcpSearch",
      preview: true,
      cache: true,
      status_buckets: 300,
      earliest_time: '-24h@h',
      latest_time: 'now',
      search: '| rest /services/configs/conf-analytic_stories splunk_server=local count=0 | spath input=mappings path=kill_chain_phases{} output=kcp | stats count by kcp',
    });

    let results = kcpSearch.data("preview");

    results.on("data", function() {
      results.data().rows.forEach(row => {
        let killchainID = '#' + row[0].toLowerCase().replace(/ /g,'');
        $(killchainID).html(row[1]);
      });
    });

    $('#analytic_filter_clear').on('click', function() {
      tokenModel.set('form.as_cis', '*');
      tokenModel.set('form.as_category', '*');
      tokenModel.set('form.as_kill_chain_phase', '*');
      tokenModel.set('form.as_mitre_attack', '*');
      tokenModel.set('form.as_data_models', '*');
    });

    $('#search_filter_clear').on('click', function() {
      tokenModel.set('form.cis', '*');
      tokenModel.set('form.searchtype', '*');
      tokenModel.set('form.kill_chain_phase', '*');
      tokenModel.set('form.mitre_attack', '*');
      tokenModel.set('form.data_models', '*');
    });
 });
