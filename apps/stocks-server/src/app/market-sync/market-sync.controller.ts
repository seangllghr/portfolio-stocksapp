import { Controller, Get } from '@nestjs/common';
import { MarketSyncService } from './market-sync.service';

@Controller('market-sync')
export class MarketSyncController {
  constructor(private marketSyncService: MarketSyncService) {}

  @Get('defer-update')
  async deferNextUpdate() {
    return await this.marketSyncService.deferNextUpdate();
  }
}
