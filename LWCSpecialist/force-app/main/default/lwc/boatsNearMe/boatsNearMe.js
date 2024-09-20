import { LightningElement,wire, api } from 'lwc';
// imports
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';


const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
export default class BoatsNearMe extends LightningElement {
  @api boatTypeId;
  mapMarkers = [];
  isLoading = true;
  isRendered = false;
  latitude;
  longitude;
  data;
  error;
  
  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  @wire(getBoatsByLocation,{latitude:'$latitude',longitude:'$longitude',boatTypeId:'$boatTypeId'})
  wiredBoatsJSON({error, data}) {
    if (data) {
        this.isLoading = true;
        console.log(data);
        console.log('from boats near me : '+ this.boatTypeId );
        console.log(JSON.parse(data));
       
        this.createMapMarkers(JSON.parse(data));
        setTimeout(()=>{
          this.isLoading = false;
        }, 1500);
        // this.isLoading = false;
        this.error = undefined;
    } else if (error) {
        this.dispatchEvent(new ShowToastEvent({
          title:ERROR_TITLE,
          //message:error.body.message,
          variant:ERROR_VARIANT
        })
      );
      
    }
   }
  
  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() {
    
      if(this.isRendered == false){
        this.getLocationFromBrowser();   
      }
      this.isRendered = true;
   }
  
  // Gets the location from the Browser
  // position => {latitude and longitude}
  getLocationFromBrowser() { 
    navigator.geolocation.getCurrentPosition((position) => { 
        this.latitude = position.coords.latitude,
        this.longitude = position.coords.longitude
      });
  }
  
  // Creates the map markers
  createMapMarkers(boatData) {
      const newMarkers = boatData.map(boat => {
        return {
            location: {
              Latitude: boat.Geolocation__Latitude__s,
              Longitude: boat.Geolocation__Longitude__s
            },
            title: boat.Name
        };
      });
      newMarkers.unshift({
        location: {
            Latitude: this.latitude,
            Longitude: this.longitude
        },
        title: LABEL_YOU_ARE_HERE,
        icon: ICON_STANDARD_USER
      });
      this.mapMarkers = newMarkers;
      
   }
}