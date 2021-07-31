import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  deleteCategory,
  createCategory,
  updateCategory,
} from './category.config';
import ICategory from '../interfaces/ICategory';
import { StatusCodes } from '../config/status-codes';

const router = Router();

router.get('/', async (req, res) => {
  const categories = await getCategories();
  res.json(categories);
});

router.get('/:id', async (req, res) => {
  const catId = Number(req.params.id);

  if (!catId) {
    return res.sendStatus(StatusCodes.BadRequest);
  }

  const cat = await getCategoryById(catId);

  if (!cat) {
    return res.sendStatus(StatusCodes.NotFound);
  }

  return res.json(cat);
});

router.delete('/:id', async (req, res) => {
  const catId = Number(req.params.id);

  if (!catId) {
    return res.sendStatus(StatusCodes.BadRequest);
  }

  try {
    await deleteCategory(catId);
    return res.sendStatus(StatusCodes.Ok);
  } catch (e) {
    return res.status(StatusCodes.BadRequest).send(e);
  }
});

router.post('/', async (req, res) => {
  const data = req.body as ICategory;
  if (!data.name) {
    return res.sendStatus(StatusCodes.BadRequest);
  }

  try {
    const category = await createCategory(data);
    return res.json(category);
  } catch (e) {
    return res.sendStatus(StatusCodes.BadRequest).send(e);
  }
});

router.put('/:id', async (req, res) => {
  const data = req.body as ICategory;
  const category = await getCategoryById(data.id);

  if (!category) {
    return res.sendStatus(StatusCodes.BadRequest);
  }

  try {
    const newData = await updateCategory(data);
    return res.json(newData);
  } catch (e) {
    return res.sendStatus(StatusCodes.BadRequest).send(e);
  }
});

export default router;
