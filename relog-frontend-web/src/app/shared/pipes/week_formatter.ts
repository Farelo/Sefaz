import { Component, OnInit } from '@angular/core';
import { NouiFormatter } from 'ng2-nouislider';

export class WeekFormatter implements NouiFormatter {
    to(value: number): string {
        value = Math.floor(value/604800000);
        return value > 1 ? `${value} semanas` : `${value} semana`;
    };

    from(value: string): number {
        
        return parseInt(value);
    }
}