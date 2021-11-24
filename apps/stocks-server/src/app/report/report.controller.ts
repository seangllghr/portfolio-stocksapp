import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get('industry/:industry')
  async getIndustryReport(@Param('industry') industry: string) {
    return await this.reportService.generateIndustryReport(industry)
  }

  @Post('stocks')
  async getStocksReport(@Body('symbols') symbols: string[]) {
    return await this.reportService.generateStockReport(symbols)
  }

}
