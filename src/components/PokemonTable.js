import '../css/jquery.datatables.min.css';
import React from 'react';
const $ = require('jquery'); 
require('datatables.net-buttons')(window, $); 
$.DataTable = require('datatables.net-responsive'); 

export default class PokemonTable extends React.Component {
    componentDidMount() {
      this.$el = $(this.el);
      $.extend($.fn.dataTableExt.oStdClasses, {
        "sFilterInput": "form-control",
        "sLengthSelect": "form-control"
    });

      this.$el.DataTable(
          {           
              responsive: {
                  details: {
                    display: $.fn.dataTable.Responsive.display.childRowImmediate,
            type: ''
                  }
              },
              "columnDefs": [{
                "defaultContent": "-",
                "targets": "_all"
              }],
              aaSorting: [],
              pageLength: 50,
              ajax: {url:`/pokemon?sort=milesRemaining`, dataSrc: "" },
              columns:[
                  {data: 'idNumber', title: "ID Number"},                  
                  {data: 'name', title: "Name", render: (data, type, full, meta)=>{
                      return "<a href=/pokemon/edit/"+full.idNumber+">"+data+"</a>"
                  }},
                  {data: 'milesRemaining', title: "Miles Remaining" },
                  {data: 'threeStars', title: "Three Stars"},
                  {data: 'needed', title: "Needed"},
                  {data: 'candyCount', title: "Candy Count"},
                  {data: 'evolutionCost', title: "Evolution Cost"},
                  {data: 'evolvesInto', title: "Evolves Into"},
                  {data: 'candyRemaining', title: "Candy Remaining"}                  
              ]
          }
      )
    }
    componentWillUnmount() { 
        //this.$el.DataTable().destroy();
    }   
    
    render() {       

        return (
           <table className="display responsive nowrap" width="100%" ref={el => this.el = el}>
           </table>
        )
    }
}
