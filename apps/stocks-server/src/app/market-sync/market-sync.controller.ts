import { Controller, Get, Query } from '@nestjs/common';
import { MarketSyncService } from './market-sync.service';

@Controller('market-sync')
export class MarketSyncController {
  constructor(private marketSyncService: MarketSyncService) {}

  @Get('search')
  async deferNextUpdate(@Query('keyword') keyword: string) {
    return await this.marketSyncService.upstreamSearch(keyword);
  }
}
