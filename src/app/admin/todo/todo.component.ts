import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Todo, User } from 'src/app/shared/models';
import { TodosService, AuthService, ObjectsOperationsService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  @ViewChild('todoForm') todoForm: NgForm;

  user: User;
  
  todos: string[] = [];
  todosBackup: string[] = [];
  doneTodos: string[] = [];
  doneTodosBackup: string[] = [];
  noTodos: boolean = false;
  noDoneTodos: boolean = false;
  displayedMsg: string;
  displayedDoneMsg: string;

  allowSaveBtn: boolean = false;

  todo: string = '';
  busyCreating: boolean = false;

  constructor(private todosService: TodosService,
    private toastr: ToastrService,
    private authService: AuthService,
    private objectOperator: ObjectsOperationsService) {
      this.authService.user$.subscribe(res => this.user = res);
    }

  ngOnInit() {
    this.getAllTodos();
  }

  reset() {
    this.todoForm.resetForm();
    this.todo = '';
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
        if(event.previousContainer.data.length <= 0) {
          if(event.previousContainer.id == 'cdk-drop-list-0') {
            this.noTodos = true;
            this.displayedMsg = 'No active todos ...';
          } else if(event.previousContainer.id == 'cdk-drop-list-1') {
            this.noDoneTodos = true;
            this.displayedDoneMsg = 'No done todos ...';
          }
        }
        if(!this.objectOperator.areEqualObjects(this.todos, this.todosBackup) || !this.objectOperator.areEqualObjects(this.doneTodos, this.doneTodosBackup)) {
          this.allowSaveBtn = true;
        } else {
          this.allowSaveBtn = false;
        }
    }
  }

  //getting all todos
  getAllTodos() {
    try {
      this.todosService.getAll().then(snapshot => {
        let results: any = {...snapshot.data(), id: snapshot.id};
        if(results.todos) {
          this.todos = results.todos;
          this.todosBackup = this.todos.slice();
        }
        if(results.doneTodos) {
          this.doneTodos = results.doneTodos;
          this.doneTodosBackup = this.doneTodos.slice();
        }
        if(this.todos.length !== 0) {
          this.noTodos = false;
        } else {
          this.displayedMsg = `No active todos ...`;
          this.noTodos = true;
        }
        if(this.doneTodos.length !== 0) {
          this.noDoneTodos = false;
        } else {
          this.noDoneTodos = true;
          this.displayedDoneMsg = `No done todos ...`;
        }
      })
      .catch(err => {
        this.noTodos = true;
        this.displayedMsg = 'Something seem to be wrong, please reload the page ...';
      })
    } catch (error) {
      this.noTodos = true;
      this.displayedMsg = 'Something seem to be wrong, please reload the page ...';
    }
  }

  createTodo() {
    if(!this.todo.trim())
    return this.toastr.error('Please type valid note value');

    this.todos.unshift(this.todo);
    this.reset();
    this.allowSaveBtn = true;
  }

  saveActiveAndDoneTodos() {
    this.busyCreating = true;
    try {
      let data: Todo = {todos: this.todos, doneTodos: this.doneTodos};
      this.todosService.create(this.user.uid, data).then(res => {
        this.busyCreating = false;
        this.allowSaveBtn = false;
        this.toastr.success('Lists saved successfully');
        this.todosBackup = this.todos.slice();
        this.doneTodosBackup = this.doneTodos.slice();
        this.reset();
      }).catch(error => {
        this.busyCreating = false;
        this.toastr.error(error, 'Something Went Wrong');
      })
    } catch (error) {
      this.busyCreating = false;
      this.toastr.error(error, 'Something Went Wrong');
    }
  }

  clearDoneList() {
    this.doneTodos = [];
  }

  cancel() {
    this.todos = this.todosBackup.slice();
    this.doneTodos = this.doneTodosBackup.slice();
    if(!this.objectOperator.areEqualObjects(this.todos, this.todosBackup) || !this.objectOperator.areEqualObjects(this.doneTodos, this.doneTodosBackup)) {
      this.allowSaveBtn = true;
    } else {
      this.allowSaveBtn = false;
    }
  }
  
}
