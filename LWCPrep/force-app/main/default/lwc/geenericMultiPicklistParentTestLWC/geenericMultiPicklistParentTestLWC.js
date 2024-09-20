import { LightningElement } from 'lwc';

export default class GeenericMultiPicklistParentTestLWC extends LightningElement {

    label = 'Test Parent';
    options = [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'inProgress' },
        { label: 'Finished', value: 'finished' },
    ];

    handleMultiPickValues(event){
        console.log('here: ', event.detail);
    }
}