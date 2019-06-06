import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/shared/services/projects.service';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/shared/models/project.model';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];
  noData: boolean = false;
  displayedMsg: string;
  showAddProjectsBtn: boolean = false;
  currentSelectedOption;

  viewOptions = [
    {title: 'All Projects' ,value: 'all', selected: true},
    {title: 'Active Projects' ,value: 'active',},
    {title: 'Closed Projects' ,value: 'closed',},
  ]

  constructor(private projectsService: ProjectsService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getAllProjects('all');
  }

  reset() {
    this.projects = [];
    this.noData = false;
    this.displayedMsg = undefined;
  }

  //getting all projects
  getAllProjects(option) {
    try {
      this.projectsService.getAll(option).then(snapshot => {
        snapshot.docs.map(doc => {
          const data = doc.data() as Project;
          const id = doc.id;
          this.projects.push({ id, ...data });
        })
        if(this.projects.length !== 0) {
          this.noData = false;
        } else {
          //no data to display (data length === 0)
          this.noData = true;
          this.displayedMsg = `No ${option == 'all'? '' : option} projects yet ...`;
          option == 'closed'? this.showAddProjectsBtn = false : this.showAddProjectsBtn = true;
        }
      })
      .catch(err => {
        console.log(err);
        this.noData = true;
        this.displayedMsg = 'Something seem to be wrong, please reload the page ...';
      })
    } catch (error) {
      console.log(error);
      this.noData = true;
      this.displayedMsg = 'Something seem to be wrong, please reload the page ...';
    }
  }

  getProjects(optSelect: MatSelectChange) {
    let option = optSelect.value;
    this.currentSelectedOption = option;
    this.reset();
    this.getAllProjects(option);
  }

  //when set closed project from projects-viewer component
  //have to get projects with the current filter
  refreshProjects() {
    this.getAllProjects(this.currentSelectedOption);
  }

}
