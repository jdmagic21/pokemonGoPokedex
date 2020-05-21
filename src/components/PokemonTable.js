import '../css/jquery.datatables.min.css';
import React from 'react';

const $ = require('jquery'); 
$.DataTable = require('datatables.net'); 
//https://www.youtube.com/watch?v=ZCKj0SJRTB8
export default class PokemonTable extends React.Component {
    componentDidMount() {
      this.$el = $(this.el);
      
      this.$el.DataTable(
          {
              responsive: true,
              ajax: {url:'http://localhost:3000/pokemon', dataSrc: "" },
              columns:[
                  {data: 'idNumber', title: "ID Number"},                  
                  {data: 'name', title: "Name"},
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
           <table className="display" width="100%" ref={el => this.el = el}>
           </table>
        )
    }
}
