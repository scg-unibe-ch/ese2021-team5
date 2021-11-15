import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoList } from './models/todo-list.model';
import { TodoItem } from './models/todo-item.model';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import {Account} from "./models/account.model";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  todoLists: TodoList[] = [];

  newTodoListName: string = '';

  loggedIn: boolean | undefined;

  user: User | undefined;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    userService.user$.subscribe(res => this.user = res);

    // Current value
    this.loggedIn = userService.getLoggedIn();
    //this.user = userService.getUser();

  }

  ngOnInit() {
    this.readLists();
    this.checkUserStatus();
    //console.log(this.userService.getUser()?.username); //I might remember to delete this at some point. Or I might not.
  }

  // CREATE - TodoList
  createList(): void {
    this.httpClient.post(environment.endpointURL + "todolist", {
      name: this.newTodoListName
    }).subscribe((list: any) => {
      this.todoLists.push(new TodoList(list.todoListId, list.name, []));
      this.newTodoListName = '';
    })
  }

  // READ - TodoList, TodoItem
  readLists(): void {
    this.httpClient.get(environment.endpointURL + "todolist").subscribe((lists: any) => {
      lists.forEach((list: any) => {
        const todoItems: TodoItem[] = [];

        list.todoItems.forEach((item: any) => {
          todoItems.push(new TodoItem(item.todoItemId, item.todoListId, item.name, item.itemImage, item.done));
        });

        this.todoLists.push(new TodoList(list.todoListId, list.name, todoItems))
      });
    });
  }

  // UPDATE - TodoList
  updateList(todoList: TodoList): void {
    this.httpClient.put(environment.endpointURL + "todolist/" + todoList.listId, {
      name: todoList.name
    }).subscribe();
  }

  // DELETE - TodoList
  deleteList(todoList: TodoList): void {
    this.httpClient.delete(environment.endpointURL + "todolist/" + todoList.listId).subscribe(() => {
      this.todoLists.splice(this.todoLists.indexOf(todoList), 1);
    });
  }

  /**
   * Checks the user status to see whether there is already a logged in user upon reloading the page.
   * If a user is logged in, a request is sent to the backend, to get the corresponding user data.
   */
  checkUserStatus(): void {
    // Get user data from local storage
    const userToken = localStorage.getItem('userToken');

    // Set boolean whether a user is logged in or not
    this.userService.setLoggedIn(!!userToken);

    if (this.userService.getLoggedIn()) {
      this.httpClient.get(environment.endpointURL + "user/").subscribe((user: any) => {
        for (let i = 0; i < user.length; i++) {
          if (user[i].userName === localStorage.getItem('userName')) {
            this.userService.setUser(new User(user[i].userId, user[i].userName, user[i].password, new Account(user[i].firstName, user[i].lastName, user[i].email, user[i].street, user[i].phoneNumber, user[i].plz, user[i].city, '')));
            break;
          }
        }
      },
      () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('userToken');

        this.userService.setLoggedIn(false);
        this.userService.setUser(undefined);

      })
    }

  }
}
