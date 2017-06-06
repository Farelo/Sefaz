import { TestBed, inject } from '@angular/core/testing';

import { EmbalagensService } from './embalagens.service';

describe('EmbalagensService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmbalagensService]
    });
  });

  it('should ...', inject([EmbalagensService], (service: EmbalagensService) => {
    expect(service).toBeTruthy();
  }));
});
