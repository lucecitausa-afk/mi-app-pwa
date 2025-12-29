export function fetchGEDQuestions(amount,difficulty,history) {
   const questions = [ 
  {
    "id": 1,
    "difficulty": "easy",
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "answer": "4"
  },
  {
    "id": 2,
    "difficulty": "medium",
    "question": "Solve for x: x + 2 = 7",
    "options": ["1", "2", "3", "4"],
    "answer": "5"
  }
  {
    "id": 3,
    "difficulty": "hard",
    "question": "Solve for x: 2x + 3 = 7",
    "options": ["1", "2", "3", "4"],
    "answer": "2"
  }
];

   return questions.filter(q => q.difficulty === difficulty).slice(0,amount);
}



