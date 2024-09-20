import { LightningElement } from 'lwc';

export default class Search extends LightningElement {
    searchValue;
    handleChange(event){
        const value = event.target.value;
        
        const searchEvent = new CustomEvent(
            'search',
            {
                detail : value
            }
        );
        this.dispatchEvent(searchEvent);
    }
}