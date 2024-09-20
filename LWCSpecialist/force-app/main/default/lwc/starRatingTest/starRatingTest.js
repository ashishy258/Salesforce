import { LightningElement, wire, track } from 'lwc';
import getLatestAppFeedback from '@salesforce/apex/GetChildAccounts.getLatestAppFeedback';
import { refreshApex } from '@salesforce/apex';

export default class StarRatingTest extends LightningElement {

    @track wiredAccountList = [];
    currentRating = 0;
    selectedStars;

    @wire(getLatestAppFeedback,{parentBoatId:'a022w0000095b6bAAA'})
    latestAppfeedback(result) {
        this.wiredAccountList = result;
        if(result.data){
            this.currentRating = result.data.averageAppRating;
            this.selectedStars = result.data.averageAppRating;
        }
    }

    refreshData(){
        console.log('here: ');
        refreshApex(this.wiredAccountList);
        console.log('hereAfter: ');
    }
}