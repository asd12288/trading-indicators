export interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  subTitle: string;
  imageUrl: string;
}

export interface BlogProps {
  blog: {
    title: string;
    content: string;
    id: string | number;
    imageUrl: string;
    subTitle: string;
  };
}
