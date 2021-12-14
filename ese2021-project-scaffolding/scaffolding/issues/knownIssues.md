# Known Issues
## ***A list of bugs and other problems***

*If you happen to fix anything, please make a note on discord and ~~cross-out~~ the issue in this file*  


> ### ~~User-service not working properly --> Frontend~~
> *in frontend/services/user.service.ts*  
> userService does only work on specific classes. For example, it seems to be working in *feed-wall.component.ts*,  
> but not in *Order.component.ts*. There it will only work directly after logging in, but not after reloading the site.  
> This Results in the component being unable to access the username (as well as any other data) of the logged-in user.
> 
> Note: userService has always been somewhat sketchy. For it to work at all, upon login, *app.component.ts* needs to call
> the backend and then manually set the user. (Maybe this is not related and perfectly fine like that.)
> ``` 
> checkUserStatus(): void {
>    // Get user data from local storage
>const userToken = localStorage.getItem('userToken');
>
>    // Set boolean whether a user is logged in or not
>    this.userService.setLoggedIn(!!userToken);
>
>    if (this.userService.getLoggedIn()) {
>      this.httpClient.get(environment.endpointURL + "user/").subscribe((user: any) => {
>        for (let i = 0; i < user.length; i++) {
>          if (user[i].userName === localStorage.getItem('userName')) {
>            this.userService.setUser(new User(user[i].userId, user[i].userName, user[i].password, new Account(user[i].firstName, user[i].lastName, user[i].email, user[i].street, user[i].phoneNumber, user[i].plz, user[i].city, '')));
>            break;
>          }
>        }
>      },
>      () => {
>        localStorage.removeItem('userName');
>        localStorage.removeItem('userToken');
>
>        this.userService.setLoggedIn(false);
>        this.userService.setUser(undefined);
>
>      })
>    }
>    this.checkAdmin();
>  }
> ```

> ### Checking whether a user is an admin --> Frontend / Backend
> Right now the frontend does not know whether a logged-in user is an admin. To find out, most components send a  
> http-request to the backend to verify. They do this even if the user is no admin, which results in about four to five  
> failed http-requests, that litter the console upon reloading the page.  
> An example can be found in *Order.component.ts*
> 
> ```
>   checkAdmin():void{
>
>    this.httpClient.get(environment.endpointURL + "admin").subscribe(() => {
>        this.admin = true;},
>      () => {
>        this.admin = false;
>      });
>}
>```
> 
> Options:
> 1. Maybe that's just the right way to do it. Normally users are not going to see the browser-console, so it's no issue.
> 2. The http-requests could be sent be once upon login/ reloading the page by app.component.ts and then a boolean 'admin'
> could be passed on to all other components via an Input. Unsure if this is Safe.
> 3. Maybe 'admin' could be a boolean stored in the user.model.ts in the frontend? Might be unsafe?

> ### Possible Security Issue with Userdata --> Frontend / Backend
> At the moment, to access all userdata, the backend only requests a valid username and userToken. This means, that  
> one can register a regular user, go to postman and then manually send a http-request to get **all account data** of everyone registered.  
> Like that one can also access data of admins. (All account data, username, hashed-password, userId, real Name, address, etc.).   
> I'm unsure whether the code responsible for this issue has been provided with the scaffolding and it's not our job to fix it as it might not  
> be in the scope of the project, but ...  
> 
> ![image](knownIssuesPictures/postman_01.png)
> The picture shows the user *zoidberg* accessing all information about the admin *yellow*. For that *zoidberg* only needs his own userToken.  
> The code responsible for this can be found in *backend --> user.controller.ts*  
> ```
> userController.get('/', verifyToken, // you can add middleware on specific requests like that
>    (req: Request, res: Response) => {
>        userService.getAll().then(users => res.send(users)).catch(err => res.status(500).send(err));
>    }
> );
> ```

# Unfinished - ToDo

> ### Editing a community post --> Frontend
> The options for editing a post are very limiting and allow only for the Text, Title and Category to be changed.  
> See *communityPost.component.ts* and communityPost.component.html*.

> ### ~~Everything Shop (:~~

> ### ~~Several html and css files --> Frontend~~
> Not very important, but a lot of things don't look particularly nice. Stuff moves around or is placed weirdly.  
> Also the favicon and the name of the tab (right now: *Frontend*) should be changed at some point.

> ### Some more testing
> Testing functionality...  
> Maybe more unit-testing --> not directly required.

> ### ~~Some general cleanup --> mainly Frontend?~~
> -Removing / updating old comments  
> -maybe rework some of the messages sent to the user (typos, etc.)  
> -removing unused / unreachable code. Empty methods, unused strings, etc.

> ### Merging / Deleting old branches


# Open Questions

> ### Is the community-post implementation sufficient? --> Frontend
> The project requirements state that posts should allow for *rich* text.  
> Right now, text can be formatted by directly using html-tags. Also only one image can be added,  
> and position, size, etc. can not be changed. There are rich-text-editors that can be implemented  
> in websites. Should we use one? Should we program it entirely on our own? 
> 
> ![image](knownIssuesPictures/communityPost_01.png)
