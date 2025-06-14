import { ApiProperty } from '@nestjs/swagger';

export class ReportStatusResponseDto {
  @ApiProperty({ example: '3fdf-23ff-123f', description: 'Unique report ID' })
  reportId: string;
}

export class ReportProgressDto {
  @ApiProperty({ example: 'Running' })
  status: string;
}
