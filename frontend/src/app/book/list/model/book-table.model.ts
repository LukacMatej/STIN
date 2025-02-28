export interface BookTableModel {
  id: number;
  title: string;
  subtitle: string;
  authors: string[];
  categories: string[];
  thumbnail: string;
  description: string;
  price: number;
  isbn13: string;
  disabled: boolean;
}
