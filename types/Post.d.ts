export interface Post {
    _createdAt:  Date;
    _id:         string;
    _rev:        string;
    _type:       string;
    _updatedAt:  Date;
    categories:  Category[];
    description: string;
    destination: string;
    image:       Image;
    postedBy:    PostedBy;
    tags:        string[];
    title:       string;
}

export interface Category {
    _key:  string;
    _ref:  string;
    _type: string;
}

export interface Image {
    _type: string;
    asset: PostedBy;
}

export interface PostedBy {
    _ref:  string;
    _type: string;
}