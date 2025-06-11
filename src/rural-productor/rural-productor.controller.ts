import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRuralProductorDto } from './dto/create-rural-productor.dto';
import { UpdateRuralProductorDto } from './dto/update-rural-productor.dto';
import { RuralProductorService } from './rural-productor.service';

@Controller('rural-productor')
export class RuralProductorController {
  constructor(private readonly ruralProductorService: RuralProductorService) {}

  @Post()
  create(@Body() createRuralProductorDto: CreateRuralProductorDto) {
    return this.ruralProductorService.create(createRuralProductorDto);
  }

  @Get()
  findAll() {
    return this.ruralProductorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ruralProductorService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRuralProductorDto: UpdateRuralProductorDto,
  ) {
    return this.ruralProductorService.update(+id, updateRuralProductorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ruralProductorService.remove(+id);
  }
}
