import { LightningElement, api } from 'lwc';

import pubsub from "c/pubsub";
export default class Tile extends LightningElement {
 
    @api drugRecord;
    

    handleClick() {
        const val = this.template.querySelectorAll(".firstClass");
        let message = { name: val[0].title,
                        inventoryLeft: val[1].innerText,
                        price: val[2].innerText,
                        productType: val[3].innerText,
                        image: val[4].src
                       };
        pubsub.fire("simple_event", message);
        
      }
    
}