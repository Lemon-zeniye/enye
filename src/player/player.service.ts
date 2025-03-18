import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayerService {
  getAllPlayers() {
    return 'all players';
  }
}
