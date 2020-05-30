function setIdNumberPadding(id){
    if(id < 10) return `00${id}`; 
    else if (id < 100 && id >= 10 ) return `0${id}`; 
    else return id;
}

module.exports = {setIdNumberPadding}; 