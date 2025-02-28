import {Nullable} from 'primeng/ts-helpers'

import {BookAuthorDetailModel} from './book-author-detail.model'
import {BookCategoryDetailModel} from './book-category-detail.model'
import {BookCommentDetailModel} from './book-coment-detail.model'

export interface BookDetailModel {
  isbn13: string;
  isbn10: string;
  title: string;
  subtitle: Nullable<string>;
  authors: BookAuthorDetailModel[];
  categories: BookCategoryDetailModel[];
  thumbnail: Nullable<string>;
  description: Nullable<string>;
  publishedYear: Nullable<number>;
  averageRating: Nullable<number>;
  numPages: Nullable<number>;
  ratingsCount: Nullable<number>;
  bookComments: BookCommentDetailModel[];
  disabled: boolean;
  favorite: boolean;
  price: number;
}
