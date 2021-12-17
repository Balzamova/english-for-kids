import ICard from '../interfaces/ICard';
import ICategory from '../interfaces/ICategory';

export default function sort(array: Array<ICategory | ICard>): Array<ICategory | ICard> {
  array.sort((a: ICategory | ICard, b: ICategory | ICard) => {
    const c = +a.id;
    const d = +b.id;

    return c - d;
  });
  return array;
}
