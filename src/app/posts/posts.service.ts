import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    this.http.get<{ message: string, posts: Post[] }>('http://localhost:4455/api/posts')
      .subscribe((postsData) => {
        console.log(postsData.message);
        this.posts = postsData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http.post<{ message: string, posts: Post[] }>('http://localhost:4455/api/posts', post)
      .subscribe((respondData) => {
        console.log(respondData.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
