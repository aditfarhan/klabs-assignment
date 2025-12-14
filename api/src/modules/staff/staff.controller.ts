import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ValidationPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { GetStaffDto } from './dto/get-staff.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { SelfResourceGuard } from '../../common/guards/self-resource.guard';
import { Public } from '../../decorators/public.decorator';

@Controller({ version: '1', path: 'staffs' })
export class StaffController {
  constructor(private readonly staffService: StaffService) { }

  @Post()
  @Public() // NOTE: Public for demo/testing. In production, restrict to admins only.
  async create(@Body() options: CreateStaffDto) {
    const staff = await this.staffService.create(options);
    return { data: staff };
  }

  @Get()
  async findAll(@Query(ValidationPipe) options: GetStaffDto) {
    const { staffs, count, meta } = await this.staffService.findAll(options);
    return { data: staffs, count, meta };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const admin = await this.staffService.findOne({ id });

    return { data: admin };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, SelfResourceGuard)
  async update(@Param('id') id: string, @Body() options: UpdateStaffDto) {
    const admin = await this.staffService.update(id, options);
    return { data: admin };
  }
}
