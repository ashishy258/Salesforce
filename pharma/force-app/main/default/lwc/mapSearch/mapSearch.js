import { LightningElement } from 'lwc';

export default class MapSearch extends LightningElement {

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