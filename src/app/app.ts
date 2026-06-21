import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  // Si usas CSS o SCSS, asegúrate de que el nombre coincida aquí
  styleUrls: ['./app.scss'] 
})
export class App { // <--- ¡ESTE ES EL CAMBIO CLAVE!
  title = 'deepl_arabica';
}