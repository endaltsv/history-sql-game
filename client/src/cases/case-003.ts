import type { Case } from "../types";

const secretCalculations: Case = {
  id: "case-003",
  title: "Тайные расчёты",
  difficulty: 2,
  description:
    "В казначейских покоях обнаружены подозрительные финансовые операции. Необходимо выяснить, кто получил аномально большие выплаты накануне исчезновения знамени.",
  xpReward: 200,
  completed: false,
  isNew: false,
  category: "intermediate",
  brief: `Пока в лагере царит суматоха, в тиши казначейских покоев вы слышите о странных финансовых операциях. Говорят, что в канун исчезновения знамени кто-то получил аномально большую выплату – сумма, которая могла стать платой за измену. Деньги, казалось бы, не должны были выделяться сверх нормы, и эта аномалия будоражит умы всех, кто привык к строгому учёту. Возможно, крупная выплата — это часть заговора, призванная замаскировать истинные намерения.

Вы направляетесь к таблице finances, чтобы изучить казённые записи.`,
  objectives: [
    "Найти все выплаты, превышающие 50 монет",
    "Определить получателей крупных выплат за 6 сентября 1380 года",
    "Проанализировать подозрительные финансовые операции",
  ],
  solution: {
    answer: "SELECT recipient_name, amount FROM finances WHERE transaction_date = '1380-09-06' AND amount > 50",
    successMessage:
      "Отлично! Вы обнаружили подозрительные финансовые операции. Теперь можно проанализировать, кто мог быть причастен к заговору.",
    explanation: `Вы успешно выполнили запрос к таблице finances, чтобы найти все выплаты, превышающие 50 монет за 6 сентября 1380 года. 
Этот запрос поможет вам:
• Выявить получателей крупных выплат
• Определить размеры подозрительных транзакций
• Установить связь между финансовыми операциями и исчезновением знамени`,
  },
};

export default secretCalculations;
