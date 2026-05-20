# Планувальник подорожей

Веб-застосунок для планування поїздок: місця, чекліст речей і статистика. Дані зберігаються в браузері, бекенд не потрібен.

## Можливості

- створення та редагування подорожей (назва, країна, дати, статус);
- список місць з відміткою «відвідано»;
- чекліст за категоріями (одяг, документи, техніка) і готовий шаблон;
- статистика: країни, відвідані місця, активні поїздки;
- фільтр поїздок за статусом;
- світла / темна тема.

## Стек

| | |
|---|---|
| Framework | Vue 3, Vite |
| UI | Nuxt UI 4.6, Tailwind CSS 4 |
| State | Pinia |
| Мова | TypeScript |
| Роутинг | Vue Router (file-based) |
| Зберігання | localStorage |

## Швидкий старт

**Потрібно:** Node.js 20+

```bash
git clone https://github.com/YOUR_USERNAME/travel-planner.git
cd travel-planner
npm install
npm run dev
```

Застосунок: [http://localhost:5173](http://localhost:5173)

## Скрипти

| Команда | Опис |
|---------|------|
| `npm run dev` | Режим розробки |
| `npm run build` | Продакшен-збірка |
| `npm run preview` | Перегляд збірки |
| `npm run typecheck` | Перевірка TypeScript |
| `npm run lint` | ESLint |

## Структура

```
src/
├── pages/              # index, trips/[id]
├── components/
├── stores/travel.ts    # Pinia + localStorage
├── types/
├── data/
├── composables/
└── utils/
```

Ключ у `localStorage`: `travel-planner-state`

## Збірка

```bash
npm run build
npm run preview
```
