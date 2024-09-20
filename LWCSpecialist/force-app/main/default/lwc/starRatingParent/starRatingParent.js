import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateBoatReviewRecord from '@salesforce/apex/GetChildAccounts.updateBoatReviewRecord';
import getLatestAppFeedback from '@salesforce/apex/GetChildAccounts.getLatestAppFeedback';

export default class StarRatingParent extends LightningElement {
    
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

    handleStarRatingClick(event){
        console.log('Ashish: ', event.detail.rating);
        updateBoatReviewRecord({rating: event.detail.rating, parentBoatId: 'a022w0000095b6bAAA'})
            .then(result => {
                console.log('result: ', result);
                if(result === 'success'){
                    this.showNotification('success', result, 'success');
                }
                else{
                    this.currentRating = this.selectedStars;
                    this.showNotification('error', result, 'error');
                }
            })
            .catch( error => {
                this.currentRating = this.selectedStars;
                this.showToast('error', error.body.message, 'error');
            })
    }

    showNotification(_title, _message, _variant) {
        const evt = new ShowToastEvent({
            title: _title,
            message: _message,
            variant: _variant,
        });
        this.dispatchEvent(evt);
    }
}