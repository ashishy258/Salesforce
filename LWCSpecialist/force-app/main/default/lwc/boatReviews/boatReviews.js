import { LightningElement, api, wire } from 'lwc';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

// imports
export default class BoatReviews extends NavigationMixin(LightningElement) {
    // Private
    boatId;
    error;
    boatReviews=0;
    isLoading = true;
    
    // Getter and Setter to allow for logic to run on recordId change
    @api
    get recordId() { 
        return this.boatId;
    }
    set recordId(value) {
       //sets boatId attribute
      //sets boatId assignment
      //get reviews associated with boatId
      //this.setAttribute('boatId', value);
      this.boatId = value;
      this.getReviews();
    }
     
    
    
    // Getter to determine if there are reviews to display
    get reviewsToShow() { 
      return (this.boatReviews.length>0)?true:false;
    }
    
    // Public method to force a refresh of the reviews invoking getReviews
    @api
    refresh() { 
      this.getReviews();
    }
    
    // Imperative Apex call to get reviews for given boat
    // returns immediately if boatId is empty or null
    // sets isLoading to true during the process and false when it’s completed
    // Gets all the boatReviews from the result, checking for errors.
    getReviews() { 
      getAllReviews({
        boatId: this.boatId
        })
        .then(result => {
          this.boatReviews = result;
          this.isLoading = false;
        })
        .catch(error => {
          this.showToast('ERROR', error.body.message, 'error');
          this.error = error;
        });
    }
    
    // Helper method to use NavigationMixin to navigate to a given record on click
    navigateToRecord(event) {  
      const userId = event.target.getAttribute('data-record-id');
        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
              recordId: userId,
              objectApiName: "User",
              actionName: "view",
            }
          });
    }

    showToast(title, message, variant) {
      const evt = new ShowToastEvent({
          title: title,
          message: message,
          variant: variant,
      });
      this.dispatchEvent(evt);
  }
  }