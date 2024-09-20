import { LightningElement } from 'lwc';
import authenticLinkdin from '@salesforce/apex/LinkdInCallout.authenticLinkdin';

export default class LinkdInConnect extends LightningElement {

    handleAuthenticate(){
        authenticLinkdin()
            .then(data => {
                console.log('ashish');
            })
            .catch(error => {
                console.log(error);
            });
    }
}