function kmToMiles(km)
{	
		const miles = (km * 0.62137).toFixed(2); 
		return parseFloat(miles); 
}

module.exports = kmToMiles;