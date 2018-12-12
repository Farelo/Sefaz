import { Component, OnInit } from '@angular/core';
import { NouiFormatter } from 'ng2-nouislider';

export class MeterFormatter implements NouiFormatter {
    to(value: number): string {
        value = Math.floor(value * 1000);

        if(value > 1){
            if(value > 999){
                if (value % 1000){
                    var kilometer = Math.floor(value / 1000)
                    var meter = value % 1000;
                    return `${kilometer} Km e ${meter} m`;
                }else{
                    var kilometer = Math.floor(value / 1000)
                    return `${kilometer} Km`;
                }
                
            }else{
                return `${value} metros` 
            }
        }else{
            return `${value} metro`;
        }
       
    };

    from(value: string): number {
        
        return parseInt(value);
    }
}