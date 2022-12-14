import { AuthService } from './../../auth/auth.service';
import { ProjectService } from './../project.service';
import { IProject } from './../../shared/interfaces/project';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

  token: string | null = localStorage.getItem('token')
  project: IProject | undefined
  editMode: boolean = false;
  errors: Object | undefined
  isAuthor: boolean = false;

  constructor(private projectService: ProjectService, private authService: AuthService,private router: Router, private activatedRoute: ActivatedRoute) {
    this.getProject();
  }

  getProject(): void {
    this.project = undefined;
    const id = this.activatedRoute.snapshot.params['id'];
    this.projectService.getById(id).subscribe({
      next: (project) => {
        if (project) {
          this.project = project
          if (this.authService.user?._id == project.owner._id) {
            this.isAuthor = true;
          }else {
            this.isAuthor = false;
          }
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

  editProject(form: NgForm){
    if (this.authService.user?._id != this.project?.owner._id || !this.token) {
      this.router.navigate(['**'])
    }
    const id = this.project?._id;
    this.projectService.editProject(id, form.value).subscribe({
      next: (project) => {
        this.project = project;
        this.editMode = false;
      },
      error: (err) =>{
        this.errors = err.error?.error;
      }
    })
  }
}
