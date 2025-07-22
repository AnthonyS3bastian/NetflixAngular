// src/app/shared/components/carousel/carousel.component.ts
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule }     from '@angular/common';
import { RouterModule }     from '@angular/router';
import { MatIconModule }    from '@angular/material/icon';

export interface CarouselItem {
  type: 'movie' | 'series';
  id: string;
  title: string;
  image: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
  @Input() items: CarouselItem[] = [];
  @ViewChild('scrollContainer', { read: ElementRef }) container!: ElementRef<HTMLDivElement>;

  scroll(direction: -1 | 1) {
    const width = this.container.nativeElement.offsetWidth;
    this.container.nativeElement.scrollBy({ left: direction * width * 0.8, behavior: 'smooth' });
  }
}
