import { TestBed } from '@angular/core/testing';

import { BlockdaemonService } from './blockdaemon.service';

describe('BlockdaemonService', () => {
  let service: BlockdaemonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockdaemonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
