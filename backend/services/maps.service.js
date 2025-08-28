const axios = require('axios');
const API_KEY = process.env.MAPS_API_KEY;

module.exports.getAddressCoordinates = async (address) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: address,
                key: API_KEY
            }
        });
        if (response.data.status !== 'OK') {
            throw new Error('Error fetching coordinates');
        }
        const location = response.data.results[0].geometry.location;
        return {
            lat: location.lat,
            lng: location.lng
        } // { lat: ..., lng: ... }
    } catch (error) {
        console.error('Error in getAddressCoordinates:', error.message);
        throw error;
    }
}

module.exports.getCoordinatesAddress = async (lat, lng) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                latlng: `${lat},${lng}`,
                key: API_KEY
            }
        });
        if (response.data.status !== 'OK') {
            throw new Error('Error fetching address');
        }
        const address = response.data.results[0].formatted_address;
        return address; // "123 Main St, City, Country"
    } catch (error) {
        console.error('Error in getCoordinatesAddress:', error.message);
        throw error;
    }
}