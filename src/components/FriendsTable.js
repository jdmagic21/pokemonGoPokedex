import '../css/jquery.datatables.min.css';
import React from 'react';
const $ = require('jquery'); 
require('datatables.net-buttons')(window, $); 
$.DataTable = require('datatables.net-responsive'); 

export default class FriendsTable extends React.Component {
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
            ajax: {url:`/friends`, dataSrc: "" },
            columns:[
                {data: 'name', title: "Name"},                  
                {data: 'daysNextStatus', title: "Days To Next Status"},
                {data: 'status', title: "Current Friend Level" }
            ]
        }
    )



}

render(){
    return(
        <table className="display responsive nowrap" width="100%" ref={el => this.el = el}>
           </table>
    )
}
}