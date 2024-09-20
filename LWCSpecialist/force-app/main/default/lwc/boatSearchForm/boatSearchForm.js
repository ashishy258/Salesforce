import { LightningElement, wire,track } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';

export default class BoatSearchForm extends LightningElement {
  selectedBoatTypeId = '';
  
  // Private
  error = undefined;
  
  // Needs explicit track due to nested data
  @track searchOptions={};
  
  // Wire a custom Apex method
    @wire(getBoatTypes)
    boatTypes({ data, error }) {
    if (data) {
      
      this.searchOptions = data.map(type => {
        // TODO: complete the logic
        return{
          label:type.Name,
          value:type.Id
        };      
      });
      this.searchOptions.unshift({ label: 'All Types', value: '' });
      
    } else if (error) {
      console.log('error');
      this.searchOptions = undefined;
      this.error = error;
    }
  }
  
  // Fires event that the search option has changed.
  // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
  handleSearchOptionChange(event) {
    this.selectedBoatTypeId = event.detail.value;
   
  //  for(let i=0;i<this.searchOptions.length;i++){
  //    if(this.searchOptions[i].value == this.selectedBoatTypeId){
  //      console.log(this.searchOptions[i].label);
  //    }
  //  }
    console.log(`the name is ${this.selectedBoatTypeId}`);
    // Create the const searchEvent
    const searchEvent = new CustomEvent('search',{
                detail: this.selectedBoatTypeId });
    // searchEvent must be the new custom event search
    this.dispatchEvent(searchEvent);
  }
}