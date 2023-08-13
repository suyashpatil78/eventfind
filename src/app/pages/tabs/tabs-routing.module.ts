import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'feed',
        loadChildren: () => import('../feed/feed.module').then((m) => m.FeedPageModule),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
      {
        path: 'eventpage/:id',
        loadChildren: () => import('../eventpage/eventpage.module').then((m) => m.EventpagePageModule),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
      {
        path: 'map',
        loadChildren: () => import('../map/map.module').then((m) => m.MapPageModule),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
      {
        path: 'leaderboard',
        loadChildren: () => import('../leaderboard/leaderboard.module').then((m) => m.LeaderboardPageModule),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
