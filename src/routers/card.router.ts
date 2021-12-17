import { Router } from 'express';
import {
  getCards,
  getCardById,
  deleteCard,
  createCard,
  updateCard,
} from './card.config';
import ICard from '../interfaces/ICard';
import { StatusCodes } from '../config/status-codes';

const router = Router();

router.get('/', async (req, res) => {
  const cards = await getCards();
  return res.json(cards);
});

router.get('/:id', async (req, res) => {
  const cardId = Number(req.params.id);

  if (!cardId) {
    return res.sendStatus(StatusCodes.BadRequest);
  }

  const card = await getCardById(cardId);

  if (!card) {
    return res.sendStatus(StatusCodes.NotFound);
  }

  return res.json(card);
});

router.delete('/:id', async (req, res) => {
  const cardId = Number(req.params.id);

  if (!cardId) {
    return res.sendStatus(StatusCodes.BadRequest);
  }

  try {
    await deleteCard(cardId);
    return res.sendStatus(StatusCodes.Ok);
  } catch (e) {
    return res.status(StatusCodes.BadRequest).send(e);
  }
});

router.post('/', async (req, res) => {
  const data = req.body as ICard;
  if (!data.word) {
    return res.sendStatus(StatusCodes.BadRequest);
  }

  try {
    const card = await createCard(data);
    return res.json(card);
  } catch (e) {
    return res.sendStatus(StatusCodes.BadRequest).send(e);
  }
});

router.put('/:id', async (req, res) => {
  const data = req.body as ICard;
  const card = await getCardById(data.id);

  if (!card) {
    return res.sendStatus(StatusCodes.BadRequest);
  }

  try {
    const newData = await updateCard(data);
    return res.json(newData);
  } catch (e) {
    return res.sendStatus(StatusCodes.BadRequest).send(e);
  }
});

export default router;
