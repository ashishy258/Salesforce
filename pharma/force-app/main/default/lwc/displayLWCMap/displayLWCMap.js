import { LightningElement , wire, track, api} from 'lwc';

import getClinicLocations from '@salesforce/apex/DisplayMapController.getClinicLocations';

export default class DisplayLWCMap extends LightningElement {

    error;  

    @track mapMarkers = [];
    zoomLevel = 4;
    
    @wire(getClinicLocations)
    wiredClinicLocations({ error, data }) {
        console.log("inside wired");
        if (data) {            
            data.forEach(dataItem => {
                this.mapMarkers = [...this.mapMarkers ,
                    {
                        location: {
                            City: dataItem.City__c,
                            Country: dataItem.Country__c,
                        },
        
                        icon: 'custom:custom26',
                        title: dataItem.Name,
                    }                                    
                ];
              });            
            this.error = undefined;
        } else if (error) {
            this.error = error;
        }
    }

    handleEvent(event){
        console.log("inside handleevent");
        this.mapMarkers = [];
        const eventval = event.detail;

        getClinicLocations({
            physicianNameInitial : eventval
        })
        .then(data =>{
            data.forEach(dataItem => {
                this.mapMarkers = [...this.mapMarkers ,
                    {
                        location: {
                            City: dataItem.City__c,
                            Country: dataItem.Country__c,
                        },
                        icon: 'custom:custom44',
                        title: dataItem.Name,
                    }                                    
                ];
              }); 
              console.log("inside result"); 
            this.errors = undefined;
        })
        .catch(error =>{
            this.errors = error;
        })


    }

}