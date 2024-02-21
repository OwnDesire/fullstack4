interface IBlog {
  title: string,
  author: string,
  url: string,
  likes: number
}

interface IBlogComplete extends IBlog {
  id: string;
}

export { IBlog, IBlogComplete };