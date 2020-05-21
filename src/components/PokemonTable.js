import '../css/jquery.datatables.min.css';
import React from 'react';

const $ = require('jquery'); 
require('datatables.net-buttons')(window, $); 
$.DataTable = require('datatables.net-responsive'); 
//https://www.youtube.com/watch?v=ZCKj0SJRTB8
//https://stackoverflow.com/questions/16539578/datatables-warning-requested-unknown-parameter-0-from-the-data-source-for-row#33639519
export default class PokemonTable extends React.Component {
    componentDidMount() {
      this.$el = $(this.el);
      
      this.$el.DataTable(
          {           
              responsive: {
                  details: {
                    type: "inline",
                    display: $.fn.dataTable.Responsive.display.childRow
                  }
              },
              "columnDefs": [{
                "defaultContent": "-",
                "targets": "_all"
              }],
              ajax: {url:'http://localhost:3000/pokemon', dataSrc: "" },
              columns:[
                  {data: 'idNumber', title: "ID Number"},                  
                  {data: 'name', title: "Name", render: (data, type, full, meta)=>{
                      return "<a href=www.google.com>"+data+"</a>"
                  }},
                  {data: 'kms', title: "KM/Candy"},
                  {data: 'miles', title: "Miles/Candy"},
                  {data: 'threeStars', title: "Three Stars"},
                  {data: 'needed', title: "Needed"},
                  {data: 'evolutionCost', title: "Evolution Cost"},
                  {data: 'evolvesInto', title: "Evolves Into"},
                  {data: 'candyRemaining', title: "Candy Remaining"},
                  {data: 'kmsRemaining', title: "KM Remaining"},
                  {data: 'milesRemaining', title: "Miles Remaining"},
              ]
          }
      )
      console.log(this.props.data); 
    }
    componentWillUnmount() {
        
    }   
    
    render() {       

        return (
           <table className="display responsive nowrap" width="100%" ref={el => this.el = el}>
           </table>
        )
    }
}
