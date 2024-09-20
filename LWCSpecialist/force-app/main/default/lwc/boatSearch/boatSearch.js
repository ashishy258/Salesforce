import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class BoatSearch extends NavigationMixin(LightningElement) {
    isLoading = false;
    boatTypeId='';
    // Handles loading event
    handleLoading() { 
        this.isLoading = true;
    }
        
    // Handles done loading event
    handleDoneLoading() {
        this.isLoading = false;
     }
    
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) {
        this.boatTypeId = event.detail;
        this.template.querySelector("c-boat-search-results").searchBoats(this.boatTypeId);
        this.template.querySelector("c-boat-search-results").cPage = 1;
        this.template.querySelector("c-boat-search-results").refresh();
     }
    
    createNewBoat() {
      
       // Navigate to the Account home page
       this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
            objectApiName: 'Boat__c',
            actionName: 'new',
        },
    });
     }
  }