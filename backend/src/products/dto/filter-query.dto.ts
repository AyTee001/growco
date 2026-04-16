import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from 'class-transformer';

export class FilterQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
    @IsNumber()
    categoryId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    weekOnly?: boolean;
}