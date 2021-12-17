import ICategory from '../interfaces/ICategory';
import categories from '../constants/categories';
import sort from '../helpers/sort';

export function getCategories(): Promise<ICategory[]> {
  return Promise.resolve(categories);
}

export function getCategoryById(id: number): Promise<ICategory | undefined> {
  const cat = categories.find((c) => c.id === id);
  return Promise.resolve(cat);
}

export function deleteCategory(id: number): Promise<void> {
  const catIndex = categories.findIndex((cat) => cat.id === id);
  if (catIndex < 0) {
    return Promise.reject(new Error('Category not found'));
  }

  categories.splice(catIndex, 1);
  return Promise.resolve();
}

export function createCategory(category: ICategory): Promise<ICategory> {
  const isExist = typeof categories
    .find((cat) => cat.name.toLowerCase() === category.name.toLowerCase()) !== 'undefined';

  if (isExist) {
    return Promise.reject(new Error(`Category with name ${category.name} is already exists`));
  }

  const newId = Date.now();
  const model = { ...category, id: newId };
  categories.push(model);
  sort(categories);

  return Promise.resolve(model);
}

export function updateCategory(category: ICategory): Promise<ICategory> {
  let newName = '';

  for (let i = 0; i < categories.length; i++) {
    if (categories[i].id === category.id) {
      newName = category.name;
      categories.splice(i, 1);
    }
  }

  const model = { ...category, name: newName };
  categories.push(model);
  sort(categories);

  return Promise.resolve(model);
}
