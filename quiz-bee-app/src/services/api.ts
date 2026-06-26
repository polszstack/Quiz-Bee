import axios from 'axios';
import type {
  QuizResponse,
  CategoryResponse,
  QuestionWithAnswers,
  PlayerInfo
} from '../types/quiz';

const API_BASE_URL = 'https://opentdb.com/api.php';
const CATEGORY_API_URL = 'https://opentdb.com/api_category.php';

export async function fetchCategories(): Promise<CategoryResponse> {
  try {
    const response = await axios.get<CategoryResponse>(CATEGORY_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function fetchQuestions(
  playerInfo: PlayerInfo
): Promise<QuestionWithAnswers[]> {
  try {
    const params: Record<string, string | number> = {
      amount: 10,
      type: 'multiple'
    };

    if (playerInfo.category !== 0) {
      params.category = playerInfo.category;
    }

    if (playerInfo.difficulty !== 'any') {
      params.difficulty = playerInfo.difficulty;
    }

    const response = await axios.get<QuizResponse>(API_BASE_URL, { params });

    return response.data.results.map((question) => ({
      question: decodeHTML(question.question),
      category: decodeHTML(question.category),
      difficulty: question.difficulty,
      type: question.type,
      answers: shuffleArray([
        ...question.incorrect_answers.map(decodeHTML),
        decodeHTML(question.correct_answer)
      ]),
      correctAnswer: decodeHTML(question.correct_answer)
    }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    // safer swap for TypeScript
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }

  return shuffled;
}

function decodeHTML(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}