import { Component, OnInit } from '@angular/core';
import { NouiFormatter } from 'ng2-nouislider';

export class ChargeFormatter implements NouiFormatter {
    to(value: number): string {
        value = Math.floor(value);
        return `${value} %` ;
    };

    from(value: string): number {

        return parseInt(value);
    }
}