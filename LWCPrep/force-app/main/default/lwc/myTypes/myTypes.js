//myTypes.js
import LightningDatatable from 'lightning/datatable';
import customName from './customName.html';
import customNumber from './customNumber.html';
import customPicklist from './customPicklist.html';

export default class MyTypes extends LightningDatatable {
    
    static customTypes = {
        customText: {
            template: customName,
            standardCellLayout: true,
            typeAttributes: ['accountName'],
        },
        customNumber: {
            template: customNumber,
            standardCellLayout: false,
            typeAttributes: ['status'],
        },
        customPicklist: {
            template: customPicklist,
            standardCellLayout: false,
            typeAttributes: ['options', 'value'],
        }
        // Other types here
    }

}