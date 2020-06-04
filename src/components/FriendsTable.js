import '../css/jquery.datatables.min.css';
import React from 'react';
import moment from 'moment'; 

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
            ajax: {url:`/friends/all`, dataSrc: "" },
            columns:[
                {data: 'name', title: "Name", render: (data, type, full, meta)=>{
                    return "<a href=/friends/edit/"+full.name+">"+data+"</a>"
                }},                  
                {data: 'daysNextStatus', title: "Days To Next Status"},
                {data: 'status', title: "Current Friend Level" },
                {data: 'dateUpdated', title:"Last Modified", render: (data, type, full, meta)=>{
                   if(data && full.status !== "best"){
                       return moment(data).fromNow();
                   }
                }},
                {title: "Estimated Status Change Date", render:(data, type, full)=>{
                    if(full.status !== "best"){
                        return moment().add(full.daysNextStatus, "days").format("MM/DD/YYYY");                       
                    }
                }}
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