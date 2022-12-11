import { ProjectService } from './../project.service';
import { IProject } from './../../shared/interfaces/project';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

  token: string | null = localStorage.getItem('token')
  project: IProject | undefined

  constructor(private projectService: ProjectService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.getProject();
  }

  getProject(): void {
    this.project = undefined;
    const id = this.activatedRoute.snapshot.params['id'];
    this.projectService.getById(id).subscribe({
      next: (project) => {
        if (project) {
          this.project = project
        }else{
          this.router.navigate(['error'])
        }
      },
      error: (err) => {
        console.log(err);
        this.router.navigate(['error'])
      }
    })
  }
}
