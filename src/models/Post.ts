export class Post {
  userId: number;
  id: number;
  title: string;
  body: string;

  constructor({ userId, id, title, body }: Post) {
    this.userId = userId;
    this.id = id;
    this.title = title;
    this.body = body;
  }

  static fromJson(json: Post): Post {
    return new Post({
      userId: json.userId,
      id: json.id,
      title: json.title,
      body: json.body,
    });
  }
}
