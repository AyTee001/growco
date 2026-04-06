import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { Basket } from "../../shared/header/basket/basket";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, Header, Footer, Basket],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {}