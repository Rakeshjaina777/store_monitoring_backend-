import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { Response } from 'express';
import { ReportProgressDto, ReportStatusResponseDto } from 'src/common/dto/report-status-response.dto';

@ApiTags('Reports')
@Controller()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('trigger_report')
  @ApiOperation({ summary: 'Trigger report generation' })
  @ApiResponse({
    status: 201,
    description: 'Successfully triggered a report',
    type: ReportStatusResponseDto,
  })
  trigger(): ReportStatusResponseDto {
    const reportId = this.reportService.triggerReport();
    return { reportId };
  }

  @Get('get_report/:reportId')
  @ApiOperation({ summary: 'Poll for report status or get final CSV' })
  @ApiParam({ name: 'reportId', description: 'Report UUID' })
  @ApiResponse({
    status: 200,
    description: 'Report is running or completed',
    type: ReportProgressDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found or invalid',
  })
  async getReport(@Param('reportId') reportId: string, @Res() res: Response) {
    const result = this.reportService.getReport(reportId);

    if (!result || result.status === 'NOT_FOUND') {
      throw new NotFoundException('Invalid report ID');
    }

    if (result.status === 'RUNNING') {
      return res.status(HttpStatus.OK).json({ status: 'Running' });
    }

    // If complete, return CSV
    if ('csv' in result && result.csv) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=report-${reportId}.csv`,
      );
      return res.status(HttpStatus.OK).send(result.csv);
    } else {
      throw new NotFoundException('CSV data not available for this report');
    }
  }
}
