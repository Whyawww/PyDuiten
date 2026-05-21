import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateWishlistDto,
  UpdateWishlistDto,
  ReorderWishlistDto,
} from './dto/wishlist.dto';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { id: string };
}

@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(
    @Req() req: RequestWithUser,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistsService.create(req.user.id, createWishlistDto);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.wishlistsService.findAll(req.user.id);
  }

  @Patch('reorder')
  reorder(@Req() req: RequestWithUser, @Body() reorderDto: ReorderWishlistDto) {
    return this.wishlistsService.reorder(req.user.id, reorderDto);
  }

  @Patch(':id')
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(id, req.user.id, updateWishlistDto);
  }

  @Delete(':id')
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.wishlistsService.remove(id, req.user.id);
  }
}
